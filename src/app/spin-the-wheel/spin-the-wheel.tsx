"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

const COLORS = [
  "#8b5cf6", // purple
  "#00d4ff", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#84cc16", // lime
  "#a855f7", // violet
  "#06b6d4", // sky
  "#e11d48", // rose
  "#22c55e", // green
  "#eab308", // yellow
  "#0ea5e9", // light-blue
  "#d946ef", // fuchsia
  "#64748b", // slate
  "#78716c", // stone
];

function getTextColor(bg: string): string {
  // Simple luminance check
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1e1e1e" : "#ffffff";
}

export default function SpinTheWheel() {
  const [input, setInput] = useState("Option 1\nOption 2\nOption 3\nOption 4");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const options = input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);

  const isValid = options.length >= 2;

  // Draw the wheel
  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D, size: number) => {
      if (options.length < 2) return;

      const center = size / 2;
      const radius = center - 4;
      const sliceAngle = (2 * Math.PI) / options.length;

      ctx.clearRect(0, 0, size, size);

      options.forEach((option, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        const color = COLORS[i % COLORS.length];

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Draw border
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = getTextColor(color);

        // Scale font based on number of options
        const fontSize = Math.max(10, Math.min(16, 200 / options.length));
        ctx.font = `bold ${fontSize}px sans-serif`;

        // Truncate long labels
        const maxLen = 14;
        const label =
          option.length > maxLen ? option.slice(0, maxLen - 1) + "\u2026" : option;
        ctx.fillText(label, radius - 16, fontSize / 3);
        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(center, center, 12, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [options],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = canvas.clientWidth;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    drawWheel(ctx, displaySize);
  }, [drawWheel, options]);

  function handleSpin() {
    if (!isValid || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Random stopping position
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const randomAngle = (arr[0] / 0xffffffff) * 360;

    // 5-8 full rotations + random angle
    const fullRotations = 5 + Math.floor(Math.random() * 3);
    const targetRotation = rotation + fullRotations * 360 + randomAngle;

    setRotation(targetRotation);

    // Calculate winner after animation
    setTimeout(() => {
      // Normalize the final angle
      const finalAngle = targetRotation % 360;
      // The pointer is at the top (270 degrees in standard math),
      // but CSS rotation is clockwise from the top.
      // The wheel is drawn starting from 3 o'clock (0 deg in canvas).
      // With CSS rotation applied, we need to figure out which slice is at the pointer.
      // Pointer is at top. Canvas 0 deg is at 3 o'clock (right).
      // After CSS rotation of `targetRotation` degrees clockwise:
      // The slice at pointer (top = -90 deg in canvas coords) is at canvas angle:
      // canvasAngle = (-90 - targetRotation) mod 360  (convert to canvas coords)
      // But since CSS rotation goes clockwise and canvas angles go counter-clockwise...
      // Simpler: the pointer is at the top. CSS rotates the wheel clockwise.
      // After rotation, the canvas angle under the pointer is:
      // pointerCanvasAngle = (360 - (finalAngle % 360) + 270) % 360
      // 270 because the pointer is at top, which is 270 deg in canvas standard (clockwise from right)

      const pointerAngle = (360 - finalAngle + 270) % 360;
      const sliceAngle = 360 / options.length;
      const winnerIndex = Math.floor(((pointerAngle % 360) + 360) % 360 / sliceAngle) % options.length;

      setWinner(options[winnerIndex]);
      setIsSpinning(false);
    }, 4200);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-3">
          <Textarea
            id="wheel-options"
            label={`Options (${options.length} entries, 2\u201320)`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setWinner(null);
            }}
            placeholder={"Enter options, one per line:\nPizza\nSushi\nTacos\nBurgers"}
            className="h-48 sm:h-64"
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSpin}
              disabled={!isValid || isSpinning}
            >
              {isSpinning ? "Spinning..." : "Spin!"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("Option 1\nOption 2\nOption 3\nOption 4");
                setWinner(null);
                setRotation(0);
              }}
            >
              Reset
            </Button>
          </div>
          {!isValid && options.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 2 options.
            </p>
          )}
        </div>

        {/* Wheel */}
        <div className="flex flex-col items-center gap-4">
          {/* Pointer triangle */}
          <div className="flex justify-center">
            <div
              className="h-0 w-0"
              style={{
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderTop: "24px solid #8b5cf6",
              }}
            />
          </div>

          {/* Wheel container */}
          <div
            className="aspect-square w-full max-w-xs sm:max-w-sm"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : undefined,
            }}
          >
            <canvas
              ref={canvasRef}
              className="h-full w-full"
              style={{ borderRadius: "50%" }}
            />
          </div>

          {/* Winner display */}
          {winner && !isSpinning && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Winner
              </p>
              <p className="brand-gradient-text mt-1 text-2xl font-extrabold sm:text-3xl">
                {winner}!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
