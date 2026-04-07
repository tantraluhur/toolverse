"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

function secureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

function generateNumbers(
  min: number,
  max: number,
  count: number,
  integerOnly: boolean,
): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    const raw = secureRandom() * (max - min) + min;
    results.push(integerOnly ? Math.floor(raw) : parseFloat(raw.toFixed(6)));
  }
  return results;
}

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [integerOnly, setIntegerOnly] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = useCallback(() => {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    const countVal = parseInt(count, 10);

    if (isNaN(minVal) || isNaN(maxVal)) {
      setError("Please enter valid minimum and maximum values.");
      return;
    }

    if (minVal >= maxVal) {
      setError("Minimum must be less than maximum.");
      return;
    }

    if (isNaN(countVal) || countVal < 1 || countVal > 100) {
      setError("Count must be between 1 and 100.");
      return;
    }

    setError("");
    setResults(generateNumbers(minVal, maxVal, countVal, integerOnly));
  }, [min, max, count, integerOnly]);

  const allResultsText = results.join(", ");

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Options */}
      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="rng-min"
            label="Minimum"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <Input
            id="rng-max"
            label="Maximum"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
          <Input
            id="rng-count"
            label="Count (1-100)"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Input
            id="rng-integer"
            type="checkbox"
            label="Integer only"
            checked={integerOnly}
            onChange={(e) => setIntegerOnly(e.target.checked)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleGenerate}>
          Generate
        </Button>
        {results.length > 1 && <CopyButton text={allResultsText} />}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Results */}
      {results.length > 0 && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((num, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {num}
                </span>
                <CopyButton text={String(num)} className="ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
