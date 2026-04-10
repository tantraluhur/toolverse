"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import Button from "@/components/ui/Button";

interface PdfFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  data: Uint8Array;
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
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

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

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      clearPreview();
    }
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
    clearPreview();
  }

  function moveFile(fromIndex: number, toIndex: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
    clearPreview();
  }

  function handleRowDragStart(index: number) {
    dragItemRef.current = index;
  }

  function handleRowDragEnter(index: number) {
    setDragOverIndex(index);
  }

  function handleRowDragEnd() {
    if (dragItemRef.current !== null && dragOverIndex !== null && dragItemRef.current !== dragOverIndex) {
      moveFile(dragItemRef.current, dragOverIndex);
    }
    dragItemRef.current = null;
    setDragOverIndex(null);
  }

  function clearAll() {
    setFiles([]);
    setError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMergedSize(0);
  }

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMergedSize(0);
  }

  function handleDownload() {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "toolverse_merge.pdf";
    a.click();
  }

  async function handleMerge() {
    if (files.length < 2) return;
    setMerging(true);
    setError("");

    try {
      const merged = await PDFDocument.create();

      for (const file of files) {
        const source = await PDFDocument.load(file.data, { ignoreEncryption: true });
        const pages = await merged.copyPages(source, source.getPageIndices());
        for (const page of pages) {
          merged.addPage(page);
        }
      }

      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });

      // Revoke old preview URL if any
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
          Max 50MB per file
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

      {/* File list */}
      {files.length > 0 && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {files.length} file{files.length !== 1 ? "s" : ""} &middot;{" "}
              <span className="brand-gradient-text font-bold">{totalPages}</span> pages &middot;{" "}
              {formatBytes(totalSize)}
            </div>
            <button
              onClick={clearAll}
              className="cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
            >
              Clear all
            </button>
          </div>

          {/* Rows */}
          <ul>
            {files.map((file, index) => (
              <li
                key={file.id}
                draggable
                onDragStart={() => handleRowDragStart(index)}
                onDragEnter={() => handleRowDragEnter(index)}
                onDragEnd={handleRowDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`flex items-center gap-3 border-b border-zinc-100 px-4 py-3 last:border-b-0 dark:border-zinc-800 ${
                  dragOverIndex === index
                    ? "bg-accent-purple/5 dark:bg-accent-purple/10"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {/* Drag handle */}
                <span className="cursor-grab text-zinc-300 active:cursor-grabbing dark:text-zinc-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
                  </svg>
                </span>

                {/* Index */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {index + 1}
                </span>

                {/* PDF icon */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900/40 dark:text-red-400">
                  PDF
                </span>

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {file.pageCount} page{file.pageCount !== 1 ? "s" : ""} &middot; {formatBytes(file.size)}
                  </p>
                </div>

                {/* Move buttons (mobile-friendly alternative to drag) */}
                <div className="flex gap-1">
                  <button
                    onClick={() => index > 0 && moveFile(index, index - 1)}
                    disabled={index === 0}
                    className="cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800"
                    aria-label="Move up"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => index < files.length - 1 && moveFile(index, index + 1)}
                    disabled={index === files.length - 1}
                    className="cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800"
                    aria-label="Move down"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                  aria-label="Remove file"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && !previewUrl && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={handleMerge}
            disabled={files.length < 2 || merging}
          >
            {merging ? "Processing..." : `Preview`}
          </Button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer text-sm font-medium text-accent-purple hover:underline dark:text-accent-cyan"
          >
            + Add more files
          </button>

          {files.length < 2 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Add at least 2 PDF files to merge
            </p>
          )}
        </div>
      )}

      {/* Preview + Download */}
      {previewUrl && (
        <div className="space-y-4">
          {/* Preview header */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950/30">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Merged successfully &middot;{" "}
                <span className="font-bold">{totalPages} pages</span> &middot;{" "}
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

          {/* Add more or start over */}
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

          {/* PDF viewer */}
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
