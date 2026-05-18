"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import Button from "@/components/ui/Button";

interface PdfFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  data: Uint8Array;
}

interface PageItem {
  id: string;          // unique per source (file+page)
  fileId: string;
  fileName: string;
  pageIndex: number;   // 0-based within source PDF
  thumbUrl: string;    // jpeg data URL
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [thumbing, setThumbing] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfjsRef = useRef<typeof import("pdfjs-dist") | null>(null);

  // Lazy-load pdfjs for thumbnails
  useEffect(() => {
    let cancelled = false;
    import("pdfjs-dist").then((mod) => {
      if (cancelled) return;
      mod.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url,
      ).toString();
      pdfjsRef.current = mod;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMergedSize(0);
  }

  async function generateThumbsForFile(file: PdfFile): Promise<PageItem[]> {
    const pdfjs = pdfjsRef.current;
    if (!pdfjs) return [];
    const doc = await pdfjs.getDocument({ data: file.data.slice().buffer }).promise;
    const items: PageItem[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      items.push({
        id: `${file.id}-${i - 1}`,
        fileId: file.id,
        fileName: file.name,
        pageIndex: i - 1,
        thumbUrl: canvas.toDataURL("image/jpeg", 0.72),
      });
      // Yield to the event loop so the UI stays responsive
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    }
    return items;
  }

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    setError("");
    const newFiles: PdfFile[] = [];

    for (const file of Array.from(fileList)) {
      if (file.type !== "application/pdf") {
        setError(`"${file.name}" is not a PDF file.`);
        continue;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError(`"${file.name}" is too large (max 50MB per file).`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);
        const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
        newFiles.push({
          id: generateId(),
          name: file.name,
          size: file.size,
          pageCount: pdf.getPageCount(),
          data,
        });
      } catch {
        setError(`"${file.name}" could not be read. It may be corrupted or encrypted.`);
      }
    }

    if (newFiles.length === 0) return;

    setFiles((prev) => [...prev, ...newFiles]);
    clearPreview();

    // Wait for pdfjs to be ready (it usually is by the time the user uploads)
    if (!pdfjsRef.current) {
      for (let i = 0; i < 50 && !pdfjsRef.current; i++) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    setThumbing(true);
    try {
      for (const f of newFiles) {
        const items = await generateThumbsForFile(f);
        setPages((prev) => [...prev, ...items]);
      }
    } catch {
      setError("Failed to render page thumbnails. The PDF may be encrypted.");
    } finally {
      setThumbing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setPages((prev) => prev.filter((p) => p.fileId !== id));
    clearPreview();
  }

  function removePage(id: string) {
    setPages((prev) => prev.filter((p) => p.id !== id));
    clearPreview();
  }

  function movePage(fromIndex: number, toIndex: number) {
    setPages((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
    clearPreview();
  }

  function handlePageDragStart(index: number) {
    dragItemRef.current = index;
  }

  function handlePageDragEnter(index: number) {
    setDragOverIndex(index);
  }

  function handlePageDragEnd() {
    if (
      dragItemRef.current !== null &&
      dragOverIndex !== null &&
      dragItemRef.current !== dragOverIndex
    ) {
      movePage(dragItemRef.current, dragOverIndex);
    }
    dragItemRef.current = null;
    setDragOverIndex(null);
  }

  function clearAll() {
    setFiles([]);
    setPages([]);
    setError("");
    clearPreview();
  }

  function handleDownload() {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "toolverse_merge.pdf";
    a.click();
  }

  async function handleMerge() {
    if (pages.length === 0) return;
    setMerging(true);
    setError("");

    try {
      const merged = await PDFDocument.create();
      // Cache loaded source PDFs so we only parse each file once
      const sourceCache = new Map<string, PDFDocument>();
      for (const page of pages) {
        let src = sourceCache.get(page.fileId);
        if (!src) {
          const file = files.find((f) => f.id === page.fileId);
          if (!file) continue;
          src = await PDFDocument.load(file.data, { ignoreEncryption: true });
          sourceCache.set(page.fileId, src);
        }
        const [copied] = await merged.copyPages(src, [page.pageIndex]);
        merged.addPage(copied);
      }

      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], {
        type: "application/pdf",
      });

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setMergedSize(blob.size);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to merge PDFs.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center transition-colors hover:border-accent-purple/50 hover:bg-accent-purple/5 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-accent-purple/40 dark:hover:bg-accent-purple/5"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/10 dark:bg-accent-purple/20">
          <svg className="h-6 w-6 text-accent-purple dark:text-accent-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Drop PDF files here or click to browse
        </p>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Max 50MB per file &middot; drag the page tiles below to reorder
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* File summary chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-700">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Sources:
          </span>
          {files.map((file) => {
            const remaining = pages.filter((p) => p.fileId === file.id).length;
            return (
              <span
                key={file.id}
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <span className="font-medium">{file.name}</span>
                <span className="text-zinc-400 dark:text-zinc-500">
                  {remaining}/{file.pageCount}
                </span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="cursor-pointer text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
                  aria-label="Remove this file and its pages"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </span>
            );
          })}
          <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
            {formatBytes(totalSize)}
          </span>
        </div>
      )}

      {/* Page grid */}
      {pages.length > 0 && (
        <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <span className="brand-gradient-text font-bold">{pages.length}</span>{" "}
              page{pages.length !== 1 ? "s" : ""} &middot; drag to reorder
            </p>
            <button
              onClick={clearAll}
              className="cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
            >
              Clear all
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pages.map((page, index) => (
              <li
                key={page.id}
                draggable
                onDragStart={() => handlePageDragStart(index)}
                onDragEnter={() => handlePageDragEnter(index)}
                onDragEnd={handlePageDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`group relative cursor-grab overflow-hidden rounded-lg border bg-white shadow-sm transition-all active:cursor-grabbing dark:bg-zinc-900 ${
                  dragOverIndex === index
                    ? "border-accent-purple ring-2 ring-accent-purple/40"
                    : "border-zinc-200 hover:border-accent-purple/40 dark:border-zinc-700"
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.thumbUrl}
                    alt={`${page.fileName} page ${page.pageIndex + 1}`}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                </div>

                {/* Index badge */}
                <span className="absolute left-1.5 top-1.5 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md bg-accent-purple px-1.5 text-[11px] font-bold text-white shadow-sm">
                  {index + 1}
                </span>

                {/* Move buttons (mobile-friendly) */}
                <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => index > 0 && movePage(index, index - 1)}
                    disabled={index === 0}
                    className="cursor-pointer rounded bg-white/90 p-0.5 text-zinc-600 shadow-sm hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:text-zinc-100"
                    aria-label="Move left"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.79 14.77a.75.75 0 01-1.06.02L7.232 10.5l4.498-4.29a.75.75 0 011.04 1.08L9.832 10l2.938 2.71a.75.75 0 01.02 1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => index < pages.length - 1 && movePage(index, index + 1)}
                    disabled={index === pages.length - 1}
                    className="cursor-pointer rounded bg-white/90 p-0.5 text-zinc-600 shadow-sm hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:text-zinc-100"
                    aria-label="Move right"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 5.23a.75.75 0 011.06-.02L12.768 9.5 8.27 13.79a.75.75 0 11-1.04-1.08L10.168 10 7.23 7.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removePage(page.id)}
                  className="absolute bottom-1.5 right-1.5 cursor-pointer rounded bg-white/90 p-0.5 text-zinc-500 opacity-0 shadow-sm transition-opacity hover:text-red-500 group-hover:opacity-100 dark:bg-zinc-900/90 dark:text-zinc-400"
                  aria-label="Remove page"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>

                {/* Footer label */}
                <div className="border-t border-zinc-100 px-2 py-1 dark:border-zinc-800">
                  <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                    {page.fileName}
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Page {page.pageIndex + 1}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {thumbing && (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Rendering thumbnails…
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {pages.length > 0 && !previewUrl && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={handleMerge}
            disabled={pages.length < 1 || merging || thumbing}
          >
            {merging ? "Processing…" : `Preview merged PDF`}
          </Button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer text-sm font-medium text-accent-purple hover:underline dark:text-accent-cyan"
          >
            + Add more files
          </button>

          {pages.length < 2 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Add more pages to merge into a multi-page PDF
            </p>
          )}
        </div>
      )}

      {/* Preview + Download */}
      {previewUrl && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950/30">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Merged successfully &middot;{" "}
                <span className="font-bold">{pages.length} pages</span> &middot;{" "}
                {formatBytes(mergedSize)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleDownload}>
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={clearPreview}>
                Edit
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer text-sm font-medium text-accent-purple hover:underline dark:text-accent-cyan"
            >
              + Add more files
            </button>
            <button
              onClick={clearAll}
              className="cursor-pointer text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Start over
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
            <iframe
              src={previewUrl}
              title="Merged PDF Preview"
              className="h-[600px] w-full sm:h-[700px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
