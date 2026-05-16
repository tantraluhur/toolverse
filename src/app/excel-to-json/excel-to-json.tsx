"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import CopyButton from "@/components/ui/CopyButton";

// ---------- Types ----------

type KeyFormat = "original" | "camelCase" | "snake_case" | "kebab-case";
type OutputFormat = "pretty" | "minified";

interface SheetData {
  name: string;
  headers: string[];
  rows: unknown[][]; // 2D array (raw cell values)
}

interface ParsedFile {
  fileName: string;
  sheets: SheetData[];
}

// ---------- Constants ----------

const PREVIEW_ROW_LIMIT = 100;
const PREVIEW_JSON_LIMIT = 200; // objects shown in JSON preview
const MAX_FILE_SIZE_MB = 25;

const KEY_FORMAT_OPTIONS: { label: string; value: KeyFormat }[] = [
  { label: "Original", value: "original" },
  { label: "camelCase", value: "camelCase" },
  { label: "snake_case", value: "snake_case" },
  { label: "kebab-case", value: "kebab-case" },
];

const OUTPUT_FORMAT_OPTIONS: { label: string; value: OutputFormat }[] = [
  { label: "Pretty (indented)", value: "pretty" },
  { label: "Minified (single line)", value: "minified" },
];

// ---------- Utilities ----------

function formatKey(key: string, mode: KeyFormat): string {
  if (mode === "original") return key;
  const cleaned = String(key)
    .trim()
    .replace(/[^a-zA-Z0-9 _\-]+/g, " ")
    .replace(/[_\-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (cleaned.length === 0) return key;
  switch (mode) {
    case "camelCase":
      return cleaned
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join("");
    case "snake_case":
      return cleaned.map((w) => w.toLowerCase()).join("_");
    case "kebab-case":
      return cleaned.map((w) => w.toLowerCase()).join("-");
    default:
      return key;
  }
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

function coerceValue(
  raw: unknown,
  options: { emptyAsNull: boolean; autoDetectTypes: boolean },
): unknown {
  if (raw === null || raw === undefined) {
    return options.emptyAsNull ? null : "";
  }
  if (raw instanceof Date) {
    return raw.toISOString();
  }
  if (typeof raw === "number" || typeof raw === "boolean") {
    return raw;
  }
  const s = String(raw);
  if (s === "") return options.emptyAsNull ? null : "";

  if (!options.autoDetectTypes) return s;

  // Booleans
  const lower = s.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;

  // Numbers — integer or decimal, allow leading minus
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d*\.\d+(?:[eE][+-]?\d+)?$/.test(s)) {
    const n = Number(s);
    if (!Number.isNaN(n)) return n;
  }

  // ISO dates
  if (ISO_DATE_RE.test(s)) {
    const t = Date.parse(s);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }

  return s;
}

function buildObjects(
  sheet: SheetData,
  options: {
    emptyAsNull: boolean;
    autoDetectTypes: boolean;
    keyFormat: KeyFormat;
  },
): Record<string, unknown>[] {
  const keys = sheet.headers.map((h, idx) => {
    const safe = h && String(h).trim() ? String(h) : `column_${idx + 1}`;
    return formatKey(safe, options.keyFormat);
  });
  // Disambiguate duplicate keys
  const seen: Record<string, number> = {};
  const finalKeys = keys.map((k) => {
    if (seen[k] === undefined) {
      seen[k] = 0;
      return k;
    }
    seen[k] += 1;
    return `${k}_${seen[k]}`;
  });

  return sheet.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < finalKeys.length; i++) {
      obj[finalKeys[i]] = coerceValue(row[i], {
        emptyAsNull: options.emptyAsNull,
        autoDetectTypes: options.autoDetectTypes,
      });
    }
    return obj;
  });
}

function isRowEmpty(row: unknown[]): boolean {
  return row.every(
    (c) => c === null || c === undefined || String(c).trim() === "",
  );
}

// ---------- Component ----------

export default function ExcelToJson() {
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Output options
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("pretty");
  const [arrayWrap, setArrayWrap] = useState(true);
  const [emptyAsNull, setEmptyAsNull] = useState(true);
  const [autoDetectTypes, setAutoDetectTypes] = useState(true);
  const [keyFormat, setKeyFormat] = useState<KeyFormat>("original");

  const [view, setView] = useState<"table" | "json">("table");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- Parse file -----

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
        if (aoa.length === 0) {
          return { name, headers: [], rows: [] };
        }
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

      setParsed({ fileName: file.name, sheets });
      const firstNonEmpty = sheets.findIndex((s) => s.headers.length > 0);
      setActiveSheet(firstNonEmpty === -1 ? 0 : firstNonEmpty);
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

  // ----- Derived: build JSON -----

  const sheet = parsed?.sheets[activeSheet];

  const objects = useMemo(() => {
    if (!sheet) return [];
    return buildObjects(sheet, { emptyAsNull, autoDetectTypes, keyFormat });
  }, [sheet, emptyAsNull, autoDetectTypes, keyFormat]);

  const jsonString = useMemo(() => {
    if (objects.length === 0) return arrayWrap ? "[]" : "";
    const indent = outputFormat === "pretty" ? 2 : 0;
    if (arrayWrap) {
      return JSON.stringify(objects, null, indent);
    }
    // NDJSON — one object per line, minified within line
    return objects.map((o) => JSON.stringify(o)).join("\n");
  }, [objects, outputFormat, arrayWrap]);

  // Truncated preview to avoid bogging down the textarea
  const jsonPreview = useMemo(() => {
    if (objects.length <= PREVIEW_JSON_LIMIT) return jsonString;
    const truncated = objects.slice(0, PREVIEW_JSON_LIMIT);
    const indent = outputFormat === "pretty" ? 2 : 0;
    const body = arrayWrap
      ? JSON.stringify(truncated, null, indent)
      : truncated.map((o) => JSON.stringify(o)).join("\n");
    return `${body}\n\n// … ${objects.length - PREVIEW_JSON_LIMIT} more rows truncated in preview (copy / download include all)`;
  }, [objects, jsonString, outputFormat, arrayWrap]);

  // ----- Actions -----

  const downloadJson = useCallback(() => {
    if (!sheet) return;
    const blob = new Blob([jsonString], {
      type: arrayWrap ? "application/json" : "application/x-ndjson",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ext = arrayWrap ? "json" : "ndjson";
    a.download = `toolverse_${sheet.name.toLowerCase().replace(/\s+/g, "_") || "data"}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonString, arrayWrap, sheet]);

  // ----- Render: empty state -----

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
            {parsing
              ? "Parsing…"
              : "Drop an Excel or CSV file, or click to choose"}
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
  const tablePreviewRows = sheet?.rows.slice(0, PREVIEW_ROW_LIMIT) ?? [];

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
          <CopyButton text={jsonString} />
          <Button variant="primary" size="sm" onClick={downloadJson}>
            Download JSON
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

      {/* Output settings */}
      <div className="grid gap-4 rounded-md border border-zinc-200 bg-white p-4 sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-900/50">
        <Dropdown
          label="Format"
          options={OUTPUT_FORMAT_OPTIONS}
          value={outputFormat}
          onChange={(v) => setOutputFormat(v as OutputFormat)}
        />
        <Dropdown
          label="Key Style"
          options={KEY_FORMAT_OPTIONS}
          value={keyFormat}
          onChange={(v) => setKeyFormat(v as KeyFormat)}
        />
        <Input
          id="x2j-array"
          type="checkbox"
          label="Wrap as array (uncheck for NDJSON)"
          checked={arrayWrap}
          onChange={(e) => setArrayWrap(e.target.checked)}
        />
        <Input
          id="x2j-empty"
          type="checkbox"
          label="Empty cells as null"
          checked={emptyAsNull}
          onChange={(e) => setEmptyAsNull(e.target.checked)}
        />
        <Input
          id="x2j-detect"
          type="checkbox"
          label="Auto-detect numbers, booleans, dates"
          checked={autoDetectTypes}
          onChange={(e) => setAutoDetectTypes(e.target.checked)}
        />
      </div>

      {/* View tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
        <ViewTab
          label={`Table (${totalRows})`}
          active={view === "table"}
          onClick={() => setView("table")}
        />
        <ViewTab
          label="JSON"
          active={view === "json"}
          onClick={() => setView("json")}
        />
      </div>

      {view === "table" ? (
        <TablePreview
          headers={sheet?.headers ?? []}
          rows={tablePreviewRows}
          totalRows={totalRows}
          truncated={totalRows > PREVIEW_ROW_LIMIT}
        />
      ) : (
        <JsonPreview content={jsonPreview} />
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
}: {
  headers: string[];
  rows: unknown[][];
  totalRows: number;
  truncated: boolean;
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
                  {h}
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

function JsonPreview({ content }: { content: string }) {
  return (
    <pre className="max-h-[500px] overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
      {content || "[]"}
    </pre>
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

