"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";

const formatOptions = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageConverter() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [sourceFormat, setSourceFormat] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [outputFormat, setOutputFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourceFormat(file.type);
    setSourceSize(file.size);
    setOutputSize(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = src;
      setImageSrc(src);
    };
    reader.readAsDataURL(file);
  }

  function handleConvert() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (outputFormat === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const q = outputFormat === "image/jpeg" ? quality : undefined;
    canvas.toBlob((blob) => {
      if (!blob) return;
      setOutputSize(blob.size);
      const url = URL.createObjectURL(blob);
      const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }, outputFormat, q);
  }

  function handleClear() {
    setImageSrc(null);
    setSourceFormat("");
    setSourceSize(0);
    setOutputSize(null);
    imgRef.current = null;
  }

  const formatLabel = (mime: string) => {
    const map: Record<string, string> = { "image/png": "PNG", "image/jpeg": "JPEG", "image/webp": "WebP", "image/gif": "GIF", "image/bmp": "BMP", "image/svg+xml": "SVG" };
    return map[mime] || mime;
  };

  return (
    <div className="space-y-4">
      <Input id="convert-upload" type="file" label="Upload Image" accept="image/*" onChange={handleFile} />

      {imageSrc && (
        <>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Source: {formatLabel(sourceFormat)} ({formatBytes(sourceSize)})
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <Dropdown id="output-format" label="Convert to" options={formatOptions} value={outputFormat} onChange={setOutputFormat} className="w-32" />
            {outputFormat === "image/jpeg" && (
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <Input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={handleConvert}>Convert & Download</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
            {outputSize !== null && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Output: {formatBytes(outputSize)}
                {sourceSize > 0 && (
                  <span className={outputSize < sourceSize ? " text-green-600 dark:text-green-400" : " text-red-600 dark:text-red-400"}>
                    {" "}({outputSize < sourceSize ? "-" : "+"}{Math.abs(Math.round(((outputSize - sourceSize) / sourceSize) * 100))}%)
                  </span>
                )}
              </span>
            )}
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
