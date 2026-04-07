"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

interface PickedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export default function ColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [color, setColor] = useState<PickedColor | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      setColor(null);
    };
    reader.readAsDataURL(file);
  }

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);
    },
    [],
  );

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;
    const hex = rgbToHex(r, g, b);
    const { h, s, l } = rgbToHsl(r, g, b);

    setColor({
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
    });
  }

  function handleClear() {
    setImageSrc(null);
    setColor(null);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Upload */}
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label
            htmlFor="image-upload"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent-purple file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:opacity-90 dark:text-zinc-400"
          />
        </div>
        {imageSrc && (
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>

      {imageSrc && (
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          {/* Image canvas */}
          <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
            {/* Hidden img to load, visible canvas for interaction */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Uploaded"
              onLoad={handleImageLoad}
              className="hidden"
            />
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full cursor-crosshair"
            />
          </div>

          {/* Color result */}
          <div className="space-y-3">
            {color ? (
              <>
                <div
                  className="h-24 w-full rounded-md border border-zinc-200 dark:border-zinc-700"
                  style={{ backgroundColor: color.hex }}
                />
                <ColorValue label="HEX" value={color.hex} />
                <ColorValue label="RGB" value={color.rgb} />
                <ColorValue label="HSL" value={color.hsl} />
              </>
            ) : (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Click anywhere on the image to pick a color.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
        <span className="mr-2 text-xs font-medium text-zinc-400">{label}</span>
        {value}
      </div>
      <CopyButton text={value} />
    </div>
  );
}
