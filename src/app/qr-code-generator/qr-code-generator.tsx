"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export default function QrCodeGenerator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasQr, setHasQr] = useState(false);

  const renderQr = useCallback(async (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!text.trim()) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasQr(false);
      setError("");
      return;
    }

    try {
      await QRCode.toCanvas(canvas, text, {
        width: 256,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setHasQr(true);
      setError("");
    } catch {
      setError("Failed to generate QR code. Input may be too long.");
      setHasQr(false);
    }
  }, []);

  // Live preview: re-render on input change with debounce
  useEffect(() => {
    const timeout = setTimeout(() => renderQr(input), 200);
    return () => clearTimeout(timeout);
  }, [input, renderQr]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas || !hasQr) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handleClear() {
    setInput("");
    setError("");
    setHasQr(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input side */}
        <div className="space-y-3">
          <Textarea
            id="qr-input"
            label="Text or URL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or URL to generate a QR code..."
            className="h-36 sm:h-48"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={!hasQr}
            >
              Download PNG
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Preview side */}
        <div className="flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <canvas
            ref={canvasRef}
            className={hasQr ? "" : "hidden"}
            style={{ imageRendering: "pixelated" }}
          />
          {!hasQr && (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              QR code preview will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
