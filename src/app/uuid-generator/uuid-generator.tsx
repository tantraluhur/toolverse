"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import CopyButton from "@/components/ui/CopyButton";

function generateUUID(): string {
  return crypto.randomUUID();
}

const countOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  function handleGenerate() {
    setUuids(Array.from({ length: count }, () => generateUUID()));
  }

  function handleClear() {
    setUuids([]);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Options */}
      <Dropdown
        id="uuid-count"
        label="How many UUIDs?"
        options={countOptions}
        value={String(count)}
        onChange={(val) => setCount(Number(val))}
        className="w-32"
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleGenerate}>
          Generate
        </Button>
        <CopyButton text={uuids.join("\n")} />
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <code className="flex-1 select-all break-all font-mono text-sm text-zinc-900 dark:text-zinc-100">
                {uuid}
              </code>
              <CopyButton text={uuid} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
