"use client";

import { useState, useRef } from "react";
import jsQR from "jsqr";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

export default function QrCodeScanner() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setResult("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setResult(code.data);
          setError("");
        } else {
          setResult("");
          setError(
            "No QR code found in this image. Try a clearer or higher-resolution image.",
          );
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  function handleClear() {
    setResult("");
    setError("");
    setImageSrc(null);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Upload */}
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label
            htmlFor="qr-upload"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Upload QR Code Image
          </label>
          <input
            id="qr-upload"
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

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error */}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Result + Preview */}
      {imageSrc && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Image preview */}
          <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Uploaded QR code"
              className="w-full"
            />
          </div>

          {/* Decoded result */}
          <div>
            {result && (
              <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Decoded Content
                  </span>
                  <CopyButton text={result} />
                </div>
                <p className="break-all font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {result}
                </p>
                {isUrl(result) && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-accent-purple hover:underline dark:text-accent-cyan"
                  >
                    Open link &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function isUrl(text: string): boolean {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
