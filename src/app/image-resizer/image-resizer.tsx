"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ratio = origW > 0 ? origH / origW : 1;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setOrigW(img.naturalWidth);
        setOrigH(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };
      img.src = src;
      setImageSrc(src);
    };
    reader.readAsDataURL(file);
  }

  function handleWidthChange(v: number) {
    setWidth(v);
    if (lockRatio && v > 0) setHeight(Math.round(v * ratio));
  }

  function handleHeightChange(v: number) {
    setHeight(v);
    if (lockRatio && v > 0 && ratio > 0) setWidth(Math.round(v / ratio));
  }

  const handleDownload = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || width <= 0 || height <= 0) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `toolverse_resized_${width}x${height}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [width, height]);

  function handleClear() {
    setImageSrc(null);
    setOrigW(0);
    setOrigH(0);
    setWidth(0);
    setHeight(0);
    imgRef.current = null;
  }

  return (
    <div className="space-y-4">
      <Input id="resize-upload" type="file" label="Upload Image" accept="image/*" onChange={handleFile} />

      {imageSrc && (
        <>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Original: {origW} x {origH} px
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Width (px)</label>
              <input type="number" min={1} value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-28 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Height (px)</label>
              <input type="number" min={1} value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-28 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
            </div>
            <Input id="lock-ratio" type="checkbox" label="Lock aspect ratio" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "50%", w: Math.round(origW * 0.5) },
              { label: "75%", w: Math.round(origW * 0.75) },
              { label: "Original", w: origW },
              { label: "1080px", w: 1080 },
              { label: "1920px", w: 1920 },
            ].map((p) => (
              <Button key={p.label} variant="outline" size="sm" onClick={() => handleWidthChange(p.w)}>
                {p.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleDownload}>Resize & Download</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>

          <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="Preview" className="max-h-96 w-full object-contain" />
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
