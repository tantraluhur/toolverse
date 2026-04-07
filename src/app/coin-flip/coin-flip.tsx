"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";

type Face = "H" | "T";

export default function CoinFlip() {
  const [result, setResult] = useState<Face | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<Face[]>([]);
  const [flipKey, setFlipKey] = useState(0);

  const heads = history.filter((f) => f === "H").length;
  const tails = history.filter((f) => f === "T").length;
  const total = history.length;
  const headsPercent = total > 0 ? Math.round((heads / total) * 100) : 0;

  const flip = useCallback(() => {
    if (isFlipping) return;

    setIsFlipping(true);
    setFlipKey((k) => k + 1);

    // Use crypto for fairness
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const face: Face = arr[0] % 2 === 0 ? "H" : "T";

    // Show result after animation completes
    setTimeout(() => {
      setResult(face);
      setHistory((prev) => [face, ...prev].slice(0, 10));
      setIsFlipping(false);
    }, 1000);
  }, [isFlipping]);

  function handleReset() {
    setResult(null);
    setHistory([]);
    setIsFlipping(false);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Coin area */}
      <div className="flex flex-col items-center gap-6">
        <div
          style={{ perspective: "600px" }}
          className="flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48"
        >
          <div
            key={flipKey}
            className={`flex h-full w-full items-center justify-center rounded-full border-4 border-zinc-300 bg-gradient-to-br from-amber-200 to-yellow-400 shadow-lg dark:border-zinc-600 dark:from-amber-300 dark:to-yellow-500${isFlipping ? " animate-coin-flip" : ""}`}
          >
            <span className="text-5xl font-extrabold text-amber-900 select-none sm:text-6xl">
              {result ?? "?"}
            </span>
          </div>
        </div>

        {/* Result text */}
        {result && !isFlipping && (
          <div className="text-center">
            <p className="brand-gradient-text text-3xl font-extrabold sm:text-4xl">
              {result === "H" ? "Heads!" : "Tails!"}
            </p>
          </div>
        )}
        {isFlipping && (
          <div className="text-center">
            <p className="text-xl font-semibold text-zinc-400 dark:text-zinc-500">
              Flipping...
            </p>
          </div>
        )}
        {!result && !isFlipping && (
          <div className="text-center">
            <p className="text-lg text-zinc-400 dark:text-zinc-500">
              Press Flip to toss the coin
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <Button variant="primary" onClick={flip} disabled={isFlipping}>
          Flip
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* History strip */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Last {history.length} flip{history.length !== 1 ? "s" : ""}
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((face, i) => (
              <div
                key={`${i}-${face}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  face === "H"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                }`}
              >
                {face}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {total > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Statistics
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {total}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Total
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {heads}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Heads
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-300">
                {tails}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Tails
              </div>
            </div>
            <div>
              <div className="brand-gradient-text text-2xl font-bold">
                {headsPercent}%
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Heads %
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
