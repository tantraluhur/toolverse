"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import Button from "@/components/ui/Button";

interface ImageFile {
  id: string;
  name: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
  bytes: Uint8Array;
  type: "png" | "jpg";
}

type PageSize = "a4" | "letter";
type Orientation = "portrait" | "landscape";
type FitMode = "fit" | "fill" | "stretch";

const PAGE_SIZES: Record<PageSize, { label: string; w: number; h: number }> = {
  a4: { label: "A4 (210 x 297 mm)", w: 595.28, h: 841.89 },
  letter: { label: "Letter (8.5 x 11 in)", w: 612, h: 792 },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [margin, setMargin] = useState(20);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback(async (fileList: FileList | File[]) => {
    setError("");
    const newImages: ImageFile[] = [];

    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError(`"${file.name}" is too large (max 20MB per image).`);
        continue;
      }

      try {
        const dataUrl = await readAsDataUrl(file);
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { width, height } = await getImageDimensions(dataUrl);
        const type = file.type === "image/png" ? "png" : "jpg";

        newImages.push({
          id: generateId(),
          name: file.name,
          size: file.size,
          width,
          height,
          dataUrl,
          bytes,
          type,
        });
      } catch {
        setError(`"${file.name}" could not be loaded.`);
      }
    }

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
    }
  }, []);

  function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function getImageDimensions(
    dataUrl: string,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addImages(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) addImages(e.dataTransfer.files);
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  function moveImage(from: number, to: number) {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function handleRowDragStart(index: number) {
    dragItemRef.current = index;
  }
  function handleRowDragEnter(index: number) {
    setDragOverIndex(index);
  }
  function handleRowDragEnd() {
    if (
      dragItemRef.current !== null &&
      dragOverIndex !== null &&
      dragItemRef.current !== dragOverIndex
    ) {
      moveImage(dragItemRef.current, dragOverIndex);
    }
    dragItemRef.current = null;
    setDragOverIndex(null);
  }

  function clearAll() {
    setImages([]);
    setError("");
  }

  async function handleConvert() {
    if (images.length === 0) return;
    setProcessing(true);
    setError("");

    try {
      const pdf = await PDFDocument.create();
      const size = PAGE_SIZES[pageSize];
      const pageW = orientation === "portrait" ? size.w : size.h;
      const pageH = orientation === "portrait" ? size.h : size.w;
      const m = margin;

      for (const img of images) {
        const page = pdf.addPage([pageW, pageH]);
        const embedded =
          img.type === "png"
            ? await pdf.embedPng(img.bytes)
            : await pdf.embedJpg(img.bytes);

        const availW = pageW - m * 2;
        const availH = pageH - m * 2;
        const imgRatio = embedded.width / embedded.height;
        const areaRatio = availW / availH;

        let drawW: number;
        let drawH: number;

        if (fitMode === "stretch") {
          drawW = availW;
          drawH = availH;
        } else if (fitMode === "fill") {
          if (imgRatio > areaRatio) {
            drawH = availH;
            drawW = drawH * imgRatio;
          } else {
            drawW = availW;
            drawH = drawW / imgRatio;
          }
        } else {
          // fit — contain within area
          if (imgRatio > areaRatio) {
            drawW = availW;
            drawH = drawW / imgRatio;
          } else {
            drawH = availH;
            drawW = drawH * imgRatio;
          }
        }

        const x = m + (availW - drawW) / 2;
        const y = m + (availH - drawH) / 2;

        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "toolverse_images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create PDF.");
    } finally {
      setProcessing(false);
    }
  }

  const totalSize = images.reduce((s, img) => s + img.size, 0);

  return (
    <div className="space-y-5">
      {/* Step 1: Upload */}
      <div>
        <StepLabel number={1} text="Upload images" />
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center transition-colors hover:border-accent-purple/50 hover:bg-accent-purple/5 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-accent-purple/40 dark:hover:bg-accent-purple/5"
        >
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Drop images here or click to browse
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            JPG, PNG &middot; Max 20MB per image
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {images.length} image{images.length !== 1 ? "s" : ""} &middot;{" "}
              {formatBytes(totalSize)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan"
              >
                + Add more
              </button>
              <button
                onClick={clearAll}
                className="cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleRowDragStart(index)}
                onDragEnter={() => handleRowDragEnter(index)}
                onDragEnd={handleRowDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`group relative cursor-grab overflow-hidden rounded-lg border transition-all active:cursor-grabbing ${
                  dragOverIndex === index
                    ? "border-accent-purple bg-accent-purple/5"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                }`}
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="aspect-square w-full object-cover"
                />

                {/* Index badge */}
                <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-black/60 text-[10px] font-bold text-white">
                  {index + 1}
                </span>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute right-1.5 top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>

                {/* File info */}
                <div className="px-2 py-1.5">
                  <p className="truncate text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    {img.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {img.width}x{img.height} &middot; {formatBytes(img.size)}
                  </p>
                </div>

                {/* Move buttons */}
                <div className="absolute bottom-8 right-1.5 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) moveImage(index, index - 1);
                    }}
                    disabled={index === 0}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-black/60 text-white disabled:opacity-30"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index < images.length - 1) moveImage(index, index + 1);
                    }}
                    disabled={index === images.length - 1}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-black/60 text-white disabled:opacity-30"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Step 2: Settings */}
          <div>
            <StepLabel number={2} text="PDF settings" />
            <div className="grid gap-4 rounded-xl border border-zinc-200 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-700">
              {/* Page size */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Page Size
                </label>
                <div className="flex gap-2">
                  {(Object.keys(PAGE_SIZES) as PageSize[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setPageSize(key)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        pageSize === key
                          ? "border-accent-purple bg-accent-purple/10 text-accent-purple dark:text-accent-cyan"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Orientation
                </label>
                <div className="flex gap-2">
                  {(["portrait", "landscape"] as Orientation[]).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOrientation(o)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        orientation === o
                          ? "border-accent-purple bg-accent-purple/10 text-accent-purple dark:text-accent-cyan"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit mode */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Image Fit
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      { key: "fit", label: "Fit" },
                      { key: "fill", label: "Fill" },
                      { key: "stretch", label: "Stretch" },
                    ] as { key: FitMode; label: string }[]
                  ).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFitMode(f.key)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        fitMode === f.key
                          ? "border-accent-purple bg-accent-purple/10 text-accent-purple dark:text-accent-cyan"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Margin: {margin}pt
                </label>
                <input
                  type="range"
                  min={0}
                  max={72}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full cursor-pointer accent-accent-purple"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>None</span>
                  <span>1 inch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Convert */}
          <div>
            <StepLabel number={3} text="Convert & download" />
            <Button
              variant="primary"
              onClick={handleConvert}
              disabled={images.length === 0 || processing}
            >
              {processing
                ? "Creating PDF..."
                : `Convert ${images.length} image${images.length !== 1 ? "s" : ""} to PDF`}
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
