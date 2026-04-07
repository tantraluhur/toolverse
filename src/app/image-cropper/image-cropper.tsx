"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CropArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

const presets = [
  { label: "Free", ratio: 0 },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "9:16", ratio: 9 / 16 },
];

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspectRatio, setAspectRatio] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayScale, setDisplayScale] = useState(1);

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
        setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
        setAspectRatio(0);
      };
      img.src = src;
      setImageSrc(src);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (!imageSrc || !containerRef.current || origW === 0) return;
    const containerWidth = containerRef.current.clientWidth;
    setDisplayScale(containerWidth / origW);
  }, [imageSrc, origW]);

  function handlePreset(ratio: number) {
    setAspectRatio(ratio);
    if (ratio === 0) return;
    let w = origW;
    let h = Math.round(w / ratio);
    if (h > origH) {
      h = origH;
      w = Math.round(h * ratio);
    }
    const x = Math.round((origW - w) / 2);
    const y = Math.round((origH - h) / 2);
    setCrop({ x, y, w, h });
  }

  function updateCrop(field: keyof CropArea, value: number) {
    setCrop((prev) => {
      const next = { ...prev, [field]: Math.max(0, value) };
      if (next.x + next.w > origW) next.w = origW - next.x;
      if (next.y + next.h > origH) next.h = origH - next.y;
      if (next.x < 0) next.x = 0;
      if (next.y < 0) next.y = 0;
      if (aspectRatio > 0) {
        if (field === "w") {
          next.h = Math.round(next.w / aspectRatio);
          if (next.y + next.h > origH) { next.h = origH - next.y; next.w = Math.round(next.h * aspectRatio); }
        } else if (field === "h") {
          next.w = Math.round(next.h * aspectRatio);
          if (next.x + next.w > origW) { next.w = origW - next.x; next.h = Math.round(next.w / aspectRatio); }
        }
      }
      return next;
    });
  }

  const handleDownload = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || crop.w <= 0 || crop.h <= 0) return;
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cropped-${crop.w}x${crop.h}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [crop]);

  function handleClear() {
    setImageSrc(null);
    setOrigW(0);
    setOrigH(0);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    imgRef.current = null;
  }

  return (
    <div className="space-y-4">
      <Input id="crop-upload" type="file" label="Upload Image" accept="image/*" onChange={handleFile} />

      {imageSrc && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <Button key={p.label} variant={aspectRatio === p.ratio ? "primary" : "outline"} size="sm" onClick={() => handlePreset(p.ratio)}>
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["x", "y", "w", "h"] as const).map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  {field === "x" ? "Left" : field === "y" ? "Top" : field === "w" ? "Width" : "Height"}
                </label>
                <input type="number" min={0} max={field === "x" || field === "w" ? origW : origH} value={crop[field]} onChange={(e) => updateCrop(field, Number(e.target.value))} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
            ))}
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Original: {origW} x {origH} px &rarr; Crop: {crop.w} x {crop.h} px
          </p>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleDownload}>Crop & Download</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>

          <div ref={containerRef} className="relative overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="Source" className="block w-full" />
            {displayScale > 0 && (
              <>
                <div className="absolute left-0 top-0 bg-black/50" style={{ width: "100%", height: crop.y * displayScale }} />
                <div className="absolute bottom-0 left-0 bg-black/50" style={{ width: "100%", height: Math.max(0, (origH - crop.y - crop.h) * displayScale) }} />
                <div className="absolute left-0 bg-black/50" style={{ top: crop.y * displayScale, width: crop.x * displayScale, height: crop.h * displayScale }} />
                <div className="absolute right-0 bg-black/50" style={{ top: crop.y * displayScale, width: Math.max(0, (origW - crop.x - crop.w) * displayScale), height: crop.h * displayScale }} />
                <div className="absolute border-2 border-white/80" style={{ left: crop.x * displayScale, top: crop.y * displayScale, width: crop.w * displayScale, height: crop.h * displayScale }} />
              </>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
