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

// ---------- Types ----------

type PageSize = "a4" | "letter";
type Orientation = "portrait" | "landscape";

interface SheetData {
  name: string;
  rows: unknown[][]; // first row treated as header
}

interface ParsedFile {
  fileName: string;
  sheets: SheetData[];
}

interface RangeBounds {
  startRow: number; // 0-based, inclusive
  endRow: number;   // 0-based, inclusive
  startCol: number;
  endCol: number;
}

// ---------- Constants ----------

const MAX_FILE_SIZE_MB = 25;
const PREVIEW_ROW_LIMIT = 50;

const PAGE_SIZE_OPTIONS: { label: string; value: PageSize }[] = [
  { label: "A4", value: "a4" },
  { label: "Letter", value: "letter" },
];
const ORIENTATION_OPTIONS: { label: string; value: Orientation }[] = [
  { label: "Portrait", value: "portrait" },
  { label: "Landscape", value: "landscape" },
];

const RANGE_RE = /^([A-Za-z]+)(\d+):([A-Za-z]+)(\d+)$/;

// ---------- Pure helpers ----------

function columnLettersToIndex(letters: string): number {
  let n = 0;
  for (const ch of letters.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

function parseRange(input: string): RangeBounds | null {
  const m = input.trim().match(RANGE_RE);
  if (!m) return null;
  const startCol = columnLettersToIndex(m[1]);
  const endCol = columnLettersToIndex(m[3]);
  const startRow = Math.max(0, Number(m[2]) - 1);
  const endRow = Math.max(0, Number(m[4]) - 1);
  if (startRow > endRow || startCol > endCol) return null;
  return { startRow, endRow, startCol, endCol };
}

function sliceMatrix(rows: unknown[][], bounds: RangeBounds): unknown[][] {
  const out: unknown[][] = [];
  for (let r = bounds.startRow; r <= bounds.endRow && r < rows.length; r++) {
    const row = rows[r] ?? [];
    const slice: unknown[] = [];
    for (let c = bounds.startCol; c <= bounds.endCol; c++) {
      slice.push(row[c] ?? null);
    }
    out.push(slice);
  }
  return out;
}

function isRowEmpty(row: unknown[]): boolean {
  return row.every(
    (c) => c === null || c === undefined || String(c).trim() === "",
  );
}

function formatCellForPdf(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number") {
    // Avoid scientific notation for ordinary numbers
    if (Number.isInteger(v)) return v.toString();
    return Number(v.toFixed(6)).toString();
  }
  return String(v);
}

function detectNumericColumns(rows: unknown[][]): boolean[] {
  if (rows.length < 2) return rows[0]?.map(() => false) ?? [];
  const colCount = rows[0]?.length ?? 0;
  const numeric: boolean[] = new Array(colCount).fill(true);
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    for (let c = 0; c < colCount; c++) {
      const v = row?.[c];
      if (v === null || v === undefined || v === "") continue;
      if (
        typeof v === "number" ||
        (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v.trim()))
      ) {
        continue;
      }
      numeric[c] = false;
    }
  }
  return numeric;
}

function sanitizeForFilename(name: string): string {
  return (
    name
      .trim()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase() || "data"
  );
}

// ---------- Component ----------

export default function ExcelToPdf() {
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [activeSheet, setActiveSheet] = useState<number | "all">(0);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Export options
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [marginMm, setMarginMm] = useState(10);
  const [fitToPage, setFitToPage] = useState(true);
  const [includeSheetTitle, setIncludeSheetTitle] = useState(true);
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- File handling -----

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
        const rows = (aoa ?? []).filter((r) => !isRowEmpty(r ?? []));
        return { name, rows };
      });
      if (sheets.every((s) => s.rows.length === 0)) {
        setError("No data found in this file.");
        setParsing(false);
        return;
      }
      setParsed({ fileName: file.name, sheets });
      const firstWithData = sheets.findIndex((s) => s.rows.length > 0);
      setActiveSheet(firstWithData === -1 ? 0 : firstWithData);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to parse: ${err.message}`
          : "Failed to parse this file. Try saving it as .xlsx.",
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
    setRangeInput("");
    setRangeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ----- Derived: preview rows (after range filter) -----

  const previewSheet =
    typeof activeSheet === "number" ? parsed?.sheets[activeSheet] : null;

  // Validate range
  useEffect(() => {
    setRangeError(null);
    if (rangeInput.trim() === "") return;
    if (!parseRange(rangeInput)) {
      setRangeError("Range should look like A1:E50.");
    }
  }, [rangeInput]);

  const previewRows = useMemo(() => {
    if (!previewSheet) return [];
    let rows = previewSheet.rows;
    if (rangeInput.trim()) {
      const bounds = parseRange(rangeInput);
      if (bounds) rows = sliceMatrix(rows, bounds);
    }
    return rows.slice(0, PREVIEW_ROW_LIMIT).map((r) => r.map(formatCellForPdf));
  }, [previewSheet, rangeInput]);

  // ----- Export -----

  const downloadPdf = useCallback(async () => {
    if (!parsed) return;
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      });

      const sheetsToExport: SheetData[] =
        activeSheet === "all"
          ? parsed.sheets.filter((s) => s.rows.length > 0)
          : [parsed.sheets[activeSheet]];

      const rangeBounds = rangeInput.trim() ? parseRange(rangeInput) : null;

      let isFirst = true;
      for (const sheet of sheetsToExport) {
        let data = sheet.rows;
        if (rangeBounds) data = sliceMatrix(data, rangeBounds);
        if (data.length === 0) continue;

        const head = [data[0].map(formatCellForPdf)];
        const body = data.slice(1).map((r) => r.map(formatCellForPdf));
        const numericCols = detectNumericColumns(data);

        if (!isFirst) doc.addPage();
        isFirst = false;

        const titleY = marginMm + 4;
        let startY = marginMm;
        if (includeSheetTitle && activeSheet === "all") {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(sheet.name, marginMm, titleY);
          startY = titleY + 4;
        }

        autoTable(doc, {
          head,
          body,
          startY,
          margin: { top: marginMm, right: marginMm, bottom: marginMm, left: marginMm },
          theme: "grid",
          tableWidth: fitToPage ? "auto" : "wrap",
          styles: {
            fontSize: 9,
            cellPadding: 1.6,
            overflow: "linebreak",
            lineColor: [180, 180, 190],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [139, 92, 246], // accent-purple
            textColor: 255,
            fontStyle: "bold",
            halign: "left",
          },
          alternateRowStyles: { fillColor: [248, 248, 250] },
          columnStyles: Object.fromEntries(
            numericCols
              .map((isNum, i) => (isNum ? [i, { halign: "right" }] : null))
              .filter(Boolean) as [number, { halign: "right" }][],
          ),
          didDrawPage: (data) => {
            // Footer page number
            const pageCount = doc.getNumberOfPages();
            const currentPage = data.pageNumber;
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(120);
            doc.text(
              `Page ${currentPage} of ${pageCount}`,
              doc.internal.pageSize.getWidth() - marginMm,
              pageHeight - 4,
              { align: "right" },
            );
            doc.setTextColor(0);
          },
        });
      }

      const base = sanitizeForFilename(parsed.fileName);
      doc.save(`toolverse_${base}.pdf`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to generate PDF: ${err.message}`
          : "Failed to generate PDF.",
      );
    } finally {
      setGenerating(false);
    }
  }, [
    parsed,
    activeSheet,
    pageSize,
    orientation,
    marginMm,
    fitToPage,
    includeSheetTitle,
    rangeInput,
  ]);

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
            {parsing ? "Parsing…" : "Drop an Excel file, or click to choose"}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            .xlsx, .xls &middot; up to {MAX_FILE_SIZE_MB} MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={handleFileInput}
        />
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    );
  }

  // ----- Render: workspace -----

  const totalRows = previewSheet?.rows.length ?? 0;
  const colCount = previewRows[0]?.length ?? 0;

  const sheetOptions = [
    ...parsed.sheets.map((s, i) => ({
      label: `${s.name} (${s.rows.length} rows)`,
      value: String(i),
    })),
    { label: `— All sheets (${parsed.sheets.length}) —`, value: "all" },
  ];

  return (
    <div className="space-y-4">
      {/* File summary + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {parsed.fileName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {parsed.sheets.length} sheet{parsed.sheets.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={downloadPdf}
            disabled={generating}
          >
            {generating ? "Generating…" : "Download PDF"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Replace File
          </Button>
        </div>
      </div>

      <Dropdown
        label="Sheet"
        options={sheetOptions}
        value={String(activeSheet)}
        onChange={(v) => setActiveSheet(v === "all" ? "all" : Number(v))}
      />

      {/* Settings */}
      <div className="grid gap-4 rounded-md border border-zinc-200 bg-white p-4 sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-900/50">
        <Dropdown
          label="Page Size"
          options={PAGE_SIZE_OPTIONS}
          value={pageSize}
          onChange={(v) => setPageSize(v as PageSize)}
        />
        <Dropdown
          label="Orientation"
          options={ORIENTATION_OPTIONS}
          value={orientation}
          onChange={(v) => setOrientation(v as Orientation)}
        />
        <Input
          id="x2p-margin"
          type="range"
          label={`Margin: ${marginMm} mm`}
          min={5}
          max={30}
          step={1}
          value={marginMm}
          onChange={(e) => setMarginMm(Number(e.target.value))}
        />
        <div>
          <Input
            id="x2p-range"
            label="Cell range (optional)"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="A1:E50"
          />
          {rangeError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {rangeError}
            </p>
          )}
        </div>
        <Input
          id="x2p-fit"
          type="checkbox"
          label="Fit table to page width"
          checked={fitToPage}
          onChange={(e) => setFitToPage(e.target.checked)}
        />
        {activeSheet === "all" && (
          <Input
            id="x2p-title"
            type="checkbox"
            label="Include sheet name as section title"
            checked={includeSheetTitle}
            onChange={(e) => setIncludeSheetTitle(e.target.checked)}
          />
        )}
      </div>

      {/* Preview */}
      {activeSheet === "all" ? (
        <div className="rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
          Exporting all {parsed.sheets.length} sheets. Each sheet starts on a
          new PDF page.
        </div>
      ) : (
        <TablePreview
          rows={previewRows}
          totalRows={totalRows}
          colCount={colCount}
          truncated={totalRows > PREVIEW_ROW_LIMIT}
        />
      )}

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}

// ---------- Sub-components ----------

function TablePreview({
  rows,
  totalRows,
  colCount,
  truncated,
}: {
  rows: string[][];
  totalRows: number;
  colCount: number;
  truncated: boolean;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This sheet (or range) has no rows.
      </p>
    );
  }
  const header = rows[0];
  const body = rows.slice(1);
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-700">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="w-12 border-b border-zinc-200 px-3 py-2 text-left text-xs font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                #
              </th>
              {header.map((h, i) => (
                <th
                  key={i}
                  className="border-b border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                >
                  {h || `Col ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr
                key={i}
                className="even:bg-zinc-50/50 dark:even:bg-zinc-900/30"
              >
                <td className="border-b border-zinc-100 px-3 py-1.5 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                  {i + 1}
                </td>
                {header.map((_, j) => (
                  <td
                    key={j}
                    className="border-b border-zinc-100 px-3 py-1.5 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    {row[j] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Preview: {body.length} of {totalRows - 1} data rows &middot; {colCount}{" "}
        columns
        {truncated && " (preview truncated — export includes everything)"}
      </p>
    </div>
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
