"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import Button from "@/components/ui/Button";

type SplitMode = "select" | "range" | "every";

interface PageThumb {
  pageNum: number;
  dataUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfSplit() {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [loadingThumbs, setLoadingThumbs] = useState(false);
  const [mode, setMode] = useState<SplitMode>("select");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfjsRef = useRef<typeof import("pdfjs-dist") | null>(null);

  // Load pdfjs lazily for thumbnail rendering
  useEffect(() => {
    import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url,
      ).toString();
      pdfjsRef.current = pdfjs;
    });
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File is too large (max 100MB).");
      return;
    }
    setError("");
    setLoadingThumbs(true);
    setThumbs([]);

    try {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const pdfLib = await PDFDocument.load(data, { ignoreEncryption: true });
      const pageCount = pdfLib.getPageCount();

      setPdfData(data);
      setFileName(file.name);
      setFileSize(file.size);
      setTotalPages(pageCount);
      setSelectedPages(new Set());
      setRangeFrom(1);
      setRangeTo(pageCount);
      setMode("select");

      // Generate thumbnails with pdf.js
      const pdfjs = pdfjsRef.current;
      if (pdfjs) {
        const pdf = await pdfjs.getDocument({ data: data.slice().buffer }).promise;
        const newThumbs: PageThumb[] = [];
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
          newThumbs.push({
            pageNum: i,
            dataUrl: canvas.toDataURL("image/jpeg", 0.6),
          });
        }
        setThumbs(newThumbs);
      }
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    } finally {
      setLoadingThumbs(false);
    }
  }, []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    setPdfData(null);
    setFileName("");
    setFileSize(0);
    setTotalPages(0);
    setThumbs([]);
    setSelectedPages(new Set());
    setError("");
  }

  // --- Page selection ---

  function togglePage(page: number) {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  }

  function selectAll() {
    const all = new Set<number>();
    for (let i = 1; i <= totalPages; i++) all.add(i);
    setSelectedPages(all);
  }

  function selectNone() {
    setSelectedPages(new Set());
  }

  function selectInverse() {
    const inv = new Set<number>();
    for (let i = 1; i <= totalPages; i++) {
      if (!selectedPages.has(i)) inv.add(i);
    }
    setSelectedPages(inv);
  }

  function getActivePages(): number[] {
    if (mode === "select") {
      return Array.from(selectedPages).sort((a, b) => a - b);
    }
    if (mode === "range") {
      const from = Math.max(1, Math.min(rangeFrom, totalPages));
      const to = Math.max(from, Math.min(rangeTo, totalPages));
      const pages: number[] = [];
      for (let i = from; i <= to; i++) pages.push(i);
      return pages;
    }
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  // --- Extract & download ---

  async function extractPages(pages: number[]): Promise<Uint8Array> {
    if (!pdfData) throw new Error("No PDF loaded");
    const source = await PDFDocument.load(pdfData, { ignoreEncryption: true });
    const output = await PDFDocument.create();
    const copiedPages = await output.copyPages(
      source,
      pages.map((p) => p - 1),
    );
    for (const page of copiedPages) output.addPage(page);
    return output.save();
  }

  async function handleExtract() {
    const pages = getActivePages();
    if (pages.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const zip = new JSZip();
      for (const page of pages) {
        const bytes = await extractPages([page]);
        zip.file(`toolverse_page_${page}.pdf`, bytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "toolverse_split.zip");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to split PDF.");
    } finally {
      setProcessing(false);
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activePages = getActivePages();
  const activePagesSet = new Set(activePages);

  // Helper: get thumb for a page
  function getThumb(pageNum: number): string | undefined {
    return thumbs.find((t) => t.pageNum === pageNum)?.dataUrl;
  }

  return (
    <div className="space-y-5">
      {/* Step 1: Upload */}
      {!pdfData && !loadingThumbs && (
        <div>
          <StepLabel number={1} text="Upload your PDF" />
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center transition-colors hover:border-accent-purple/50 hover:bg-accent-purple/5 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-accent-purple/40 dark:hover:bg-accent-purple/5"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/10 dark:bg-accent-purple/20">
              <UploadIcon />
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Drop a PDF file here or click to browse
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Max 100MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loadingThumbs && (
        <div className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-700">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-accent-purple dark:border-zinc-700" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Reading PDF and generating page previews...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {pdfData && !loadingThumbs && (
        <>
          {/* File info */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900/40 dark:text-red-400">
                PDF
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {fileName}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  <span className="brand-gradient-text font-bold">{totalPages}</span>{" "}
                  pages &middot; {formatBytes(fileSize)}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Change file
            </Button>
          </div>

          {/* Step 2: Choose mode */}
          <div>
            <StepLabel number={2} text="How do you want to split?" />
            <div className="grid gap-3 sm:grid-cols-3">
              <ModeCard active={mode === "select"} onClick={() => setMode("select")} title="Pick pages" description="Click page thumbnails to select" />
              <ModeCard active={mode === "range"} onClick={() => setMode("range")} title="Page range" description="Extract a continuous range" />
              <ModeCard active={mode === "every"} onClick={() => setMode("every")} title="Every page" description="Split into one file per page" />
            </div>
          </div>

          {/* Step 3: Configure */}
          <div>
            <StepLabel
              number={3}
              text={
                mode === "select"
                  ? "Click pages to select them"
                  : mode === "range"
                    ? "Set the page range"
                    : "All pages will be extracted"
              }
            />

            {/* Select mode — thumbnail grid */}
            {mode === "select" && (
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <button onClick={selectAll} className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan">Select all</button>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <button onClick={selectNone} className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan">Select none</button>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <button onClick={selectInverse} className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan">Invert</button>
                  <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedPages.size} of {totalPages} selected
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const thumb = getThumb(page);
                    const selected = selectedPages.has(page);
                    return (
                      <button
                        key={page}
                        onClick={() => togglePage(page)}
                        className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                          selected
                            ? "border-accent-purple shadow-sm dark:border-accent-cyan"
                            : "border-zinc-200 opacity-50 hover:opacity-80 dark:border-zinc-700"
                        }`}
                      >
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={`Page ${page}`} className="w-full bg-white" />
                        ) : (
                          <div className="flex aspect-[3/4] items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                            <span className="text-lg font-bold text-zinc-300 dark:text-zinc-600">{page}</span>
                          </div>
                        )}
                        <div className={`py-1 text-center text-xs font-medium ${
                          selected
                            ? "bg-accent-purple/10 text-accent-purple dark:bg-accent-purple/20 dark:text-accent-cyan"
                            : "bg-zinc-50 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500"
                        }`}>
                          Page {page}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Range mode — thumbnail strip with highlighted range */}
            {mode === "range" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">From page</label>
                    <input type="number" min={1} max={totalPages} value={rangeFrom} onChange={(e) => setRangeFrom(Math.max(1, Number(e.target.value)))} className="w-20 rounded-md border border-zinc-300 bg-white px-3 py-2 text-center text-sm text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
                  </div>
                  <span className="mt-5 text-zinc-400">to</span>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">To page</label>
                    <input type="number" min={rangeFrom} max={totalPages} value={rangeTo} onChange={(e) => setRangeTo(Math.max(rangeFrom, Number(e.target.value)))} className="w-20 rounded-md border border-zinc-300 bg-white px-3 py-2 text-center text-sm text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
                  </div>
                  <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
                    ({rangeTo - rangeFrom + 1} page{rangeTo - rangeFrom + 1 !== 1 ? "s" : ""})
                  </p>
                </div>

                {/* Thumbnail preview of range */}
                {thumbs.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const thumb = getThumb(page);
                      const inRange = page >= rangeFrom && page <= rangeTo;
                      return (
                        <div
                          key={page}
                          className={`overflow-hidden rounded-md border transition-all ${
                            inRange
                              ? "border-accent-purple shadow-sm dark:border-accent-cyan"
                              : "border-zinc-200 opacity-30 dark:border-zinc-700"
                          }`}
                        >
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt={`Page ${page}`} className="w-full bg-white" />
                          ) : (
                            <div className="flex aspect-[3/4] items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                              <span className="text-xs font-bold text-zinc-300">{page}</span>
                            </div>
                          )}
                          <div className={`py-0.5 text-center text-[10px] font-medium ${
                            inRange ? "text-accent-purple dark:text-accent-cyan" : "text-zinc-400"
                          }`}>
                            {page}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Every mode — show all thumbnails */}
            {mode === "every" && (
              <div>
                <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                  All <span className="font-semibold text-zinc-800 dark:text-zinc-200">{totalPages}</span> pages will be extracted as individual PDFs in a ZIP.
                </p>
                {thumbs.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                    {thumbs.map((thumb) => (
                      <div key={thumb.pageNum} className="overflow-hidden rounded-md border border-accent-purple/30 dark:border-accent-cyan/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumb.dataUrl} alt={`Page ${thumb.pageNum}`} className="w-full bg-white" />
                        <div className="py-0.5 text-center text-[10px] font-medium text-accent-purple dark:text-accent-cyan">
                          {thumb.pageNum}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 4: Download */}
          <div>
            <StepLabel number={4} text="Download" />
            <Button
              variant="primary"
              onClick={handleExtract}
              disabled={activePages.length === 0 || processing}
            >
              {processing
                ? "Processing..."
                : `Download ${activePages.length} page${activePages.length !== 1 ? "s" : ""} as ZIP`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// --- Sub-components ---

function StepLabel({ number, text }: { number: number; text: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full brand-gradient text-xs font-bold text-white">
        {number}
      </span>
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {text}
      </h3>
    </div>
  );
}

function ModeCard({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description: string }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-4 text-left transition-all ${
        active
          ? "border-accent-purple bg-accent-purple/5 dark:border-accent-purple/60 dark:bg-accent-purple/10"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
      }`}
    >
      <p className={`text-sm font-semibold ${active ? "text-accent-purple dark:text-accent-cyan" : "text-zinc-800 dark:text-zinc-200"}`}>
        {title}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </button>
  );
}

function UploadIcon() {
  return (
    <svg className="h-6 w-6 text-accent-purple dark:text-accent-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}
