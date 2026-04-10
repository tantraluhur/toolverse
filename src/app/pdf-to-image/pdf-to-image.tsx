"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import JSZip from "jszip";
import Button from "@/components/ui/Button";

type Resolution = "low" | "medium" | "high";
type Format = "png" | "jpg";

interface PageThumb {
  pageNum: number;
  dataUrl: string;
  selected: boolean;
}

const SCALE_MAP: Record<Resolution, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const SCALE_LABELS: Record<Resolution, string> = {
  low: "Low (1x)",
  medium: "Medium (2x)",
  high: "High (3x)",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfToImage() {
  const [pdfFile, setPdfFile] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolution, setResolution] = useState<Resolution>("medium");
  const [format, setFormat] = useState<Format>("png");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfjsRef = useRef<typeof import("pdfjs-dist") | null>(null);

  // Load pdfjs lazily
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

    const pdfjs = pdfjsRef.current;
    if (!pdfjs) {
      setError("PDF library is still loading. Please try again.");
      return;
    }

    setError("");
    setLoading(true);
    setThumbs([]);

    try {
      const buffer = await file.arrayBuffer();
      const stored = new Uint8Array(buffer);
      const pdf = await pdfjs.getDocument({ data: stored.slice().buffer }).promise;
      const pageCount = pdf.numPages;

      setPdfFile(stored);
      setFileName(file.name);
      setFileSize(file.size);
      setTotalPages(pageCount);

      // Generate thumbnails at low resolution
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
          selected: true,
        });
      }
      setThumbs(newThumbs);
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    } finally {
      setLoading(false);
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

  function togglePage(pageNum: number) {
    setThumbs((prev) =>
      prev.map((t) =>
        t.pageNum === pageNum ? { ...t, selected: !t.selected } : t,
      ),
    );
  }

  function selectAll() {
    setThumbs((prev) => prev.map((t) => ({ ...t, selected: true })));
  }

  function selectNone() {
    setThumbs((prev) => prev.map((t) => ({ ...t, selected: false })));
  }

  function handleClear() {
    setPdfFile(null);
    setFileName("");
    setFileSize(0);
    setTotalPages(0);
    setThumbs([]);
    setError("");
    setProgress(0);
  }

  async function renderPage(pageNum: number): Promise<Blob> {
    const pdfjs = pdfjsRef.current!;
    const pdf = await pdfjs.getDocument({ data: pdfFile!.slice().buffer }).promise;
    const page = await pdf.getPage(pageNum);
    const scale = SCALE_MAP[resolution];
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;

    return new Promise((resolve, reject) => {
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const quality = format === "jpg" ? 0.92 : undefined;
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to render page"));
        },
        mimeType,
        quality,
      );
    });
  }

  async function handleConvert() {
    const selected = thumbs.filter((t) => t.selected);
    if (selected.length === 0 || !pdfFile) return;

    setConverting(true);
    setProgress(0);
    setError("");

    try {
      if (selected.length === 1) {
        // Single page — download directly
        const blob = await renderPage(selected[0].pageNum);
        const ext = format === "png" ? "png" : "jpg";
        downloadBlob(blob, `toolverse_page_${selected[0].pageNum}.${ext}`);
        setProgress(100);
      } else {
        // Multiple pages — download as ZIP
        const zip = new JSZip();
        for (let i = 0; i < selected.length; i++) {
          const blob = await renderPage(selected[i].pageNum);
          const ext = format === "png" ? "png" : "jpg";
          zip.file(`toolverse_page_${selected[i].pageNum}.${ext}`, blob);
          setProgress(Math.round(((i + 1) / selected.length) * 100));
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, "toolverse_pdf_images.zip");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to convert.");
    } finally {
      setConverting(false);
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

  const selectedCount = thumbs.filter((t) => t.selected).length;

  return (
    <div className="space-y-5">
      {/* Step 1: Upload */}
      {!pdfFile && (
        <div>
          <StepLabel number={1} text="Upload your PDF" />
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center transition-colors hover:border-accent-purple/50 hover:bg-accent-purple/5 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-accent-purple/40 dark:hover:bg-accent-purple/5"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/10 dark:bg-accent-purple/20">
              <svg className="h-6 w-6 text-accent-purple dark:text-accent-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
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
      {loading && (
        <div className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-700">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-accent-purple dark:border-zinc-700" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Reading PDF and generating thumbnails...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {pdfFile && !loading && thumbs.length > 0 && (
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

          {/* Step 2: Select pages */}
          <div>
            <StepLabel number={2} text="Select pages to convert" />
            <div className="mb-3 flex flex-wrap gap-2">
              <button onClick={selectAll} className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan">
                Select all
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <button onClick={selectNone} className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan">
                Select none
              </button>
              <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
                {selectedCount} of {totalPages} selected
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {thumbs.map((thumb) => (
                <button
                  key={thumb.pageNum}
                  onClick={() => togglePage(thumb.pageNum)}
                  className={`group cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    thumb.selected
                      ? "border-accent-purple shadow-sm dark:border-accent-cyan"
                      : "border-zinc-200 opacity-50 hover:opacity-80 dark:border-zinc-700"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.dataUrl}
                    alt={`Page ${thumb.pageNum}`}
                    className="w-full bg-white"
                  />
                  <div className={`py-1 text-center text-xs font-medium ${
                    thumb.selected
                      ? "bg-accent-purple/10 text-accent-purple dark:bg-accent-purple/20 dark:text-accent-cyan"
                      : "bg-zinc-50 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500"
                  }`}>
                    Page {thumb.pageNum}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Settings */}
          <div>
            <StepLabel number={3} text="Output settings" />
            <div className="grid gap-4 rounded-xl border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-700">
              {/* Format */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Format
                </label>
                <div className="flex gap-2">
                  {(["png", "jpg"] as Format[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`cursor-pointer rounded-lg border px-4 py-1.5 text-xs font-medium uppercase transition-colors ${
                        format === f
                          ? "border-accent-purple bg-accent-purple/10 text-accent-purple dark:text-accent-cyan"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Resolution
                </label>
                <div className="flex gap-2">
                  {(Object.keys(SCALE_MAP) as Resolution[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        resolution === r
                          ? "border-accent-purple bg-accent-purple/10 text-accent-purple dark:text-accent-cyan"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {SCALE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Convert */}
          <div>
            <StepLabel number={4} text="Convert & download" />

            {converting && (
              <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Converting pages...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full brand-gradient transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleConvert}
              disabled={selectedCount === 0 || converting}
            >
              {converting
                ? `Converting... ${progress}%`
                : selectedCount === 1
                  ? `Download page as ${format.toUpperCase()}`
                  : `Download ${selectedCount} pages as ZIP`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

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
