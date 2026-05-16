"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import CopyButton from "@/components/ui/CopyButton";

// ---------- Types ----------

type Dialect = "mysql" | "postgresql" | "sqlite";

type InferredType =
  | "int"
  | "float"
  | "bool"
  | "date"
  | "datetime"
  | "text";

interface SheetData {
  name: string;
  headers: string[];
  rows: unknown[][];
}

interface ParsedFile {
  fileName: string;
  sheets: SheetData[];
}

// ---------- Constants ----------

const MAX_FILE_SIZE_MB = 25;
const PREVIEW_ROW_LIMIT = 100;
const PREVIEW_SQL_CHAR_LIMIT = 200_000;
const DEFAULT_BATCH_SIZE = 500;

const DIALECT_OPTIONS: { label: string; value: Dialect }[] = [
  { label: "MySQL", value: "mysql" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "SQLite", value: "sqlite" },
];

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/;

// ---------- Pure helpers ----------

function quoteIdent(name: string, dialect: Dialect): string {
  if (dialect === "mysql") {
    return `\`${name.replace(/`/g, "``")}\``;
  }
  return `"${name.replace(/"/g, '""')}"`;
}

function escapeSqlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

function normalizeDateValue(raw: unknown): { value: string; type: "date" | "datetime" } | null {
  if (raw instanceof Date) {
    if (!isFinite(raw.getTime())) return null;
    const iso = raw.toISOString();
    // SheetJS emits Date with time component even for date-only cells.
    // We treat anything midnight UTC as a plain date — close enough heuristic.
    if (iso.endsWith("T00:00:00.000Z")) {
      return { value: iso.slice(0, 10), type: "date" };
    }
    return { value: iso.slice(0, 19).replace("T", " "), type: "datetime" };
  }
  const s = String(raw);
  if (ISO_DATE_RE.test(s)) return { value: s, type: "date" };
  if (ISO_DATETIME_RE.test(s)) {
    const t = Date.parse(s);
    if (!Number.isNaN(t)) {
      return {
        value: new Date(t).toISOString().slice(0, 19).replace("T", " "),
        type: "datetime",
      };
    }
  }
  return null;
}

function classifyCell(raw: unknown): {
  type: InferredType | "null";
  formatted: string;
} {
  if (raw === null || raw === undefined) return { type: "null", formatted: "NULL" };
  if (typeof raw === "string" && raw.trim() === "") {
    return { type: "null", formatted: "NULL" };
  }
  if (typeof raw === "boolean") {
    return { type: "bool", formatted: raw ? "TRUE" : "FALSE" };
  }
  if (raw instanceof Date) {
    const d = normalizeDateValue(raw);
    if (d) return { type: d.type, formatted: escapeSqlString(d.value) };
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return {
      type: Number.isInteger(raw) ? "int" : "float",
      formatted: String(raw),
    };
  }
  const s = String(raw).trim();
  // Boolean literal
  const lower = s.toLowerCase();
  if (lower === "true") return { type: "bool", formatted: "TRUE" };
  if (lower === "false") return { type: "bool", formatted: "FALSE" };
  // Integer
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return { type: "int", formatted: s };
  }
  // Float
  if (/^-?\d*\.\d+(?:[eE][+-]?\d+)?$/.test(s)) {
    const n = Number(s);
    if (Number.isFinite(n)) return { type: "float", formatted: s };
  }
  // Date / datetime
  const d = normalizeDateValue(s);
  if (d) return { type: d.type, formatted: escapeSqlString(d.value) };
  // String fallback
  return { type: "text", formatted: escapeSqlString(s) };
}

function unifyType(a: InferredType, b: InferredType): InferredType {
  if (a === b) return a;
  // Numeric widening
  const numeric: InferredType[] = ["int", "float"];
  if (numeric.includes(a) && numeric.includes(b)) return "float";
  // Date narrowing
  if (
    (a === "date" && b === "datetime") ||
    (a === "datetime" && b === "date")
  ) {
    return "datetime";
  }
  return "text";
}

function inferColumnTypes(headers: string[], rows: unknown[][]): InferredType[] {
  return headers.map((_, col) => {
    let current: InferredType | null = null;
    for (const row of rows) {
      const { type } = classifyCell(row[col]);
      if (type === "null") continue;
      if (current === null) {
        current = type as InferredType;
      } else {
        current = unifyType(current, type as InferredType);
      }
      if (current === "text") return "text"; // already widest
    }
    return current ?? "text";
  });
}

function sqlTypeFor(t: InferredType, dialect: Dialect): string {
  if (dialect === "mysql") {
    switch (t) {
      case "int":
        return "INT";
      case "float":
        return "DOUBLE";
      case "bool":
        return "TINYINT(1)";
      case "date":
        return "DATE";
      case "datetime":
        return "DATETIME";
      case "text":
        return "TEXT";
    }
  }
  if (dialect === "postgresql") {
    switch (t) {
      case "int":
        return "INTEGER";
      case "float":
        return "DOUBLE PRECISION";
      case "bool":
        return "BOOLEAN";
      case "date":
        return "DATE";
      case "datetime":
        return "TIMESTAMP";
      case "text":
        return "TEXT";
    }
  }
  // SQLite
  switch (t) {
    case "int":
      return "INTEGER";
    case "float":
      return "REAL";
    case "bool":
      return "INTEGER";
    case "date":
    case "datetime":
    case "text":
      return "TEXT";
  }
}

function formatBoolForDialect(s: string, dialect: Dialect): string {
  if (s === "NULL") return "NULL";
  if (s === "TRUE" || s === "FALSE") {
    if (dialect === "postgresql") return s; // TRUE/FALSE keywords
    return s === "TRUE" ? "1" : "0"; // MySQL TINYINT, SQLite INTEGER
  }
  return s;
}

function isRowEmpty(row: unknown[]): boolean {
  return row.every(
    (c) => c === null || c === undefined || String(c).trim() === "",
  );
}

// ---------- SQL generation ----------

interface GenerateOptions {
  dialect: Dialect;
  tableName: string;
  includeColumnNames: boolean;
  batchInsert: boolean;
  batchSize: number;
  insertIgnore: boolean;
  createTable: boolean;
}

function generateSql(sheet: SheetData, opts: GenerateOptions): string {
  if (sheet.headers.length === 0 || sheet.rows.length === 0) return "";

  const types = inferColumnTypes(sheet.headers, sheet.rows);
  const quotedTable = quoteIdent(opts.tableName, opts.dialect);
  const quotedCols = sheet.headers.map((h) => quoteIdent(h, opts.dialect));

  const lines: string[] = [];

  // CREATE TABLE
  if (opts.createTable) {
    const colDefs = sheet.headers.map((_, i) => {
      const colType = sqlTypeFor(types[i], opts.dialect);
      return `  ${quotedCols[i]} ${colType}`;
    });
    lines.push(`CREATE TABLE ${quotedTable} (`);
    lines.push(colDefs.join(",\n"));
    lines.push(");");
    lines.push("");
  }

  // Build VALUES tuples (formatted per row)
  const valueTuples: string[] = sheet.rows.map((row) => {
    const cells = sheet.headers.map((_, i) => {
      const { formatted } = classifyCell(row[i]);
      // Re-format booleans for the active dialect
      return formatBoolForDialect(formatted, opts.dialect);
    });
    return `(${cells.join(", ")})`;
  });

  // INSERT prefix per dialect
  const insertVerb = (() => {
    if (!opts.insertIgnore) return "INSERT";
    if (opts.dialect === "mysql") return "INSERT IGNORE";
    if (opts.dialect === "sqlite") return "INSERT OR IGNORE";
    return "INSERT"; // PostgreSQL handled at statement end
  })();

  const colList = opts.includeColumnNames
    ? ` (${quotedCols.join(", ")})`
    : "";
  const conflictSuffix =
    opts.insertIgnore && opts.dialect === "postgresql"
      ? " ON CONFLICT DO NOTHING"
      : "";

  if (opts.batchInsert) {
    const batches = chunk(valueTuples, Math.max(1, opts.batchSize));
    for (const batch of batches) {
      lines.push(
        `${insertVerb} INTO ${quotedTable}${colList} VALUES\n${batch
          .map((t) => `  ${t}`)
          .join(",\n")}${conflictSuffix};`,
      );
    }
  } else {
    for (const tuple of valueTuples) {
      lines.push(
        `${insertVerb} INTO ${quotedTable}${colList} VALUES ${tuple}${conflictSuffix};`,
      );
    }
  }

  return lines.join("\n");
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function sanitizeTableName(name: string): string {
  const cleaned = name
    .trim()
    .replace(/\.[^.]+$/, "") // strip extension
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return cleaned || "data";
}

// ---------- Component ----------

export default function ExcelToSql() {
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // SQL options
  const [tableName, setTableName] = useState("data");
  const [dialect, setDialect] = useState<Dialect>("mysql");
  const [includeColumnNames, setIncludeColumnNames] = useState(true);
  const [batchInsert, setBatchInsert] = useState(true);
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH_SIZE);
  const [insertIgnore, setInsertIgnore] = useState(false);
  const [createTable, setCreateTable] = useState(true);

  const [view, setView] = useState<"table" | "sql">("table");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- Parse -----

  const parseFile = useCallback(async (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(
        `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB to keep the browser responsive.`,
      );
      return;
    }
    setParsing(true);
    setParsed(null);
    setActiveSheet(0);

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

      const sheets: SheetData[] = workbook.SheetNames.map((name) => {
        const ws = workbook.Sheets[name];
        const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
          header: 1,
          raw: true,
          defval: null,
          blankrows: false,
        });
        if (aoa.length === 0) return { name, headers: [], rows: [] };
        const headerRow = aoa[0] ?? [];
        const headers = headerRow.map((h, i) =>
          h == null || String(h).trim() === ""
            ? `column_${i + 1}`
            : String(h),
        );
        const rows = aoa.slice(1).filter((r) => !isRowEmpty(r ?? []));
        return { name, headers, rows };
      });

      if (sheets.length === 0 || sheets.every((s) => s.headers.length === 0)) {
        setError("No data found in this file.");
        setParsing(false);
        return;
      }

      const firstNonEmpty = sheets.findIndex((s) => s.headers.length > 0);
      const idx = firstNonEmpty === -1 ? 0 : firstNonEmpty;
      setParsed({ fileName: file.name, sheets });
      setActiveSheet(idx);
      setTableName(sanitizeTableName(sheets[idx].name || file.name));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to parse: ${err.message}`
          : "Failed to parse this file. Try saving it as .xlsx or .csv.",
      );
    } finally {
      setParsing(false);
    }
  }, []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }
  function handleClear() {
    setParsed(null);
    setError(null);
    setActiveSheet(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Auto-update table name when switching sheets
  useEffect(() => {
    if (parsed) {
      setTableName(sanitizeTableName(parsed.sheets[activeSheet]?.name ?? "data"));
    }
  }, [activeSheet, parsed]);

  const sheet = parsed?.sheets[activeSheet];

  // ----- Derived: SQL -----

  const sql = useMemo(() => {
    if (!sheet) return "";
    const safeTable = sanitizeTableName(tableName);
    return generateSql(sheet, {
      dialect,
      tableName: safeTable,
      includeColumnNames,
      batchInsert,
      batchSize,
      insertIgnore,
      createTable,
    });
  }, [
    sheet,
    tableName,
    dialect,
    includeColumnNames,
    batchInsert,
    batchSize,
    insertIgnore,
    createTable,
  ]);

  // Truncate preview if SQL is huge
  const sqlPreview = useMemo(() => {
    if (sql.length <= PREVIEW_SQL_CHAR_LIMIT) return sql;
    const cut = sql.slice(0, PREVIEW_SQL_CHAR_LIMIT);
    const lastNewline = cut.lastIndexOf("\n");
    const safe = lastNewline > 0 ? cut.slice(0, lastNewline) : cut;
    return `${safe}\n\n-- … output truncated in preview (copy / download include everything)`;
  }, [sql]);

  const inferredTypes = useMemo(() => {
    if (!sheet) return [];
    return inferColumnTypes(sheet.headers, sheet.rows);
  }, [sheet]);

  const downloadSql = useCallback(() => {
    if (!sheet) return;
    const blob = new Blob([sql], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toolverse_${sanitizeTableName(tableName)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sql, tableName, sheet]);

  // ----- Render: empty -----

  if (!parsed) {
    return (
      <div className="space-y-3">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragOver
              ? "border-accent-purple bg-accent-purple/5"
              : "border-zinc-300 bg-zinc-50 hover:border-accent-purple/60 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-accent-purple/40 dark:hover:bg-zinc-800"
          }`}
        >
          <UploadIcon />
          <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {parsing ? "Parsing…" : "Drop an Excel or CSV file, or click to choose"}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            .xlsx, .xls, .csv &middot; up to {MAX_FILE_SIZE_MB} MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          className="hidden"
          onChange={handleFileInput}
        />
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    );
  }

  // ----- Render: workspace -----

  const totalRows = sheet?.rows.length ?? 0;
  const previewRows = sheet?.rows.slice(0, PREVIEW_ROW_LIMIT) ?? [];

  return (
    <div className="space-y-4">
      {/* File info + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {parsed.fileName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {parsed.sheets.length} sheet{parsed.sheets.length !== 1 ? "s" : ""}{" "}
            &middot; {totalRows} data row{totalRows !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <CopyButton text={sql} />
          <Button variant="primary" size="sm" onClick={downloadSql}>
            Download .sql
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Replace File
          </Button>
        </div>
      </div>

      {/* Sheet selector */}
      {parsed.sheets.length > 1 && (
        <Dropdown
          label="Sheet"
          options={parsed.sheets.map((s, i) => ({
            label: `${s.name} (${s.rows.length} rows)`,
            value: String(i),
          }))}
          value={String(activeSheet)}
          onChange={(v) => setActiveSheet(Number(v))}
        />
      )}

      {/* SQL options */}
      <div className="grid gap-4 rounded-md border border-zinc-200 bg-white p-4 sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-900/50">
        <Input
          id="x2s-table"
          label="Table Name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="users"
        />
        <Dropdown
          label="SQL Dialect"
          options={DIALECT_OPTIONS}
          value={dialect}
          onChange={(v) => setDialect(v as Dialect)}
        />
        <Input
          id="x2s-include-cols"
          type="checkbox"
          label="Include column names"
          checked={includeColumnNames}
          onChange={(e) => setIncludeColumnNames(e.target.checked)}
        />
        <Input
          id="x2s-batch"
          type="checkbox"
          label="Batch insert (multi-row VALUES)"
          checked={batchInsert}
          onChange={(e) => setBatchInsert(e.target.checked)}
        />
        <Input
          id="x2s-create"
          type="checkbox"
          label="Generate CREATE TABLE"
          checked={createTable}
          onChange={(e) => setCreateTable(e.target.checked)}
        />
        <Input
          id="x2s-ignore"
          type="checkbox"
          label={
            dialect === "postgresql"
              ? "ON CONFLICT DO NOTHING"
              : dialect === "sqlite"
                ? "INSERT OR IGNORE"
                : "INSERT IGNORE"
          }
          checked={insertIgnore}
          onChange={(e) => setInsertIgnore(e.target.checked)}
        />
        {batchInsert && (
          <Input
            id="x2s-batch-size"
            type="number"
            label="Rows per statement"
            min={1}
            max={5000}
            step={50}
            value={batchSize}
            onChange={(e) =>
              setBatchSize(Math.max(1, Number(e.target.value) || 1))
            }
            className="sm:col-span-2"
          />
        )}
      </div>

      {/* View tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
        <ViewTab
          label={`Table (${totalRows})`}
          active={view === "table"}
          onClick={() => setView("table")}
        />
        <ViewTab
          label="SQL"
          active={view === "sql"}
          onClick={() => setView("sql")}
        />
      </div>

      {view === "table" ? (
        <TablePreview
          headers={sheet?.headers ?? []}
          rows={previewRows}
          totalRows={totalRows}
          truncated={totalRows > PREVIEW_ROW_LIMIT}
          types={inferredTypes}
          dialect={dialect}
        />
      ) : (
        <SqlPreview content={sqlPreview} />
      )}

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}

// ---------- Sub-components ----------

function ViewTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-accent-purple text-zinc-900 dark:text-zinc-100"
          : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

function TablePreview({
  headers,
  rows,
  totalRows,
  truncated,
  types,
  dialect,
}: {
  headers: string[];
  rows: unknown[][];
  totalRows: number;
  truncated: boolean;
  types: InferredType[];
  dialect: Dialect;
}) {
  if (headers.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This sheet has no detectable columns.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-700">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="w-12 border-b border-zinc-200 px-3 py-2 text-left text-xs font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                #
              </th>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="border-b border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                >
                  <div>{h}</div>
                  <div className="font-mono text-[10px] font-normal uppercase text-accent-purple dark:text-accent-cyan">
                    {sqlTypeFor(types[i], dialect)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="even:bg-zinc-50/50 dark:even:bg-zinc-900/30"
              >
                <td className="border-b border-zinc-100 px-3 py-1.5 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                  {i + 1}
                </td>
                {headers.map((_, j) => (
                  <td
                    key={j}
                    className="border-b border-zinc-100 px-3 py-1.5 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    {renderCell(row[j])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {truncated && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Showing first {rows.length} of {totalRows} rows. Copy or download
          includes everything.
        </p>
      )}
    </div>
  );
}

function renderCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function SqlPreview({ content }: { content: string }) {
  return (
    <pre className="max-h-[500px] overflow-auto rounded-md border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100">
      <code>{highlight(content || "-- No SQL generated.")}</code>
    </pre>
  );
}

// Lightweight syntax highlighter — tokenizes keywords, strings, numbers, comments
function highlight(sql: string): React.ReactNode {
  const tokens: Array<{ text: string; cls?: string }> = [];
  const re = /(--[^\n]*)|('(?:''|[^'])*')|(\b\d+(?:\.\d+)?\b)|(\b(?:CREATE TABLE|INSERT IGNORE|INSERT OR IGNORE|INSERT|INTO|VALUES|ON CONFLICT DO NOTHING|NULL|TRUE|FALSE|INT|INTEGER|TEXT|TINYINT|VARCHAR|DOUBLE|DOUBLE PRECISION|REAL|DATE|DATETIME|TIMESTAMP|BOOLEAN)\b)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql))) {
    if (m.index > lastIndex) {
      tokens.push({ text: sql.slice(lastIndex, m.index) });
    }
    let cls: string | undefined;
    if (m[1]) cls = "text-zinc-500 italic"; // comment
    else if (m[2]) cls = "text-emerald-300"; // string
    else if (m[3]) cls = "text-orange-300"; // number
    else if (m[4]) cls = "text-accent-cyan font-semibold"; // keyword
    tokens.push({ text: m[0], cls });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < sql.length) tokens.push({ text: sql.slice(lastIndex) });
  return tokens.map((t, i) =>
    t.cls ? (
      <span key={i} className={t.cls}>
        {t.text}
      </span>
    ) : (
      <span key={i}>{t.text}</span>
    ),
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5m0 0L7.5 12M12 7.5v9"
      />
    </svg>
  );
}
