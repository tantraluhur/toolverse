"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CopyButton from "@/components/ui/CopyButton";

export default function RandomNamePicker() {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  function handlePick() {
    const names = input
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);

    if (names.length === 0) {
      setPicked(null);
      return;
    }

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const index = array[0] % names.length;
    setPicked(names[index]);
  }

  function handleClear() {
    setInput("");
    setPicked(null);
  }

  const nameCount = input
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      <Textarea
        id="names-input"
        label={`Names (${nameCount} entries)`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"Enter names, one per line:\nAlice\nBob\nCharlie\nDiana"}
        className="h-48 sm:h-64"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handlePick}>
          Pick Random Name
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {picked && (
        <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Winner
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {picked}
            </p>
          </div>
          <CopyButton text={picked} />
        </div>
      )}
    </div>
  );
}
