"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Textarea from "@/components/ui/Textarea";
import CopyButton from "@/components/ui/CopyButton";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-512";

const ALGORITHMS: Algorithm[] = ["SHA-1", "SHA-256", "SHA-512"];

async function computeHash(
  algorithm: Algorithm,
  text: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-512": "",
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateHashes = useCallback(async (text: string) => {
    if (!text) {
      setHashes({ "SHA-1": "", "SHA-256": "", "SHA-512": "" });
      return;
    }

    const results = await Promise.all(
      ALGORITHMS.map(async (algo) => {
        const hash = await computeHash(algo, text);
        return [algo, hash] as [Algorithm, string];
      }),
    );

    const newHashes: Record<Algorithm, string> = {
      "SHA-1": "",
      "SHA-256": "",
      "SHA-512": "",
    };
    for (const [algo, hash] of results) {
      newHashes[algo] = hash;
    }
    setHashes(newHashes);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      calculateHashes(input);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, calculateHashes]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <Textarea
        id="hash-input"
        label="Input Text"
        placeholder="Type or paste text to hash..."
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="space-y-3">
        {ALGORITHMS.map((algo) => (
          <div
            key={algo}
            className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {algo}
              </span>
              <CopyButton text={hashes[algo]} />
            </div>
            <code className="block select-all break-all font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
              {hashes[algo] || (
                <span className="text-zinc-400 dark:text-zinc-500">
                  Hash will appear here...
                </span>
              )}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
