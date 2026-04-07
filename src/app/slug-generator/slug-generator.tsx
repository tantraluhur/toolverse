"use client";

import { useState, useMemo } from "react";
import Textarea from "@/components/ui/Textarea";
import Dropdown from "@/components/ui/Dropdown";
import CopyButton from "@/components/ui/CopyButton";

const SEPARATOR_OPTIONS = [
  { label: "Hyphen (-)", value: "-" },
  { label: "Underscore (_)", value: "_" },
];

function generateSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-_]/g, "") // Remove special characters
    .replace(/[\s-_]+/g, separator) // Replace spaces and separators
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), ""); // Trim separators
}

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");

  const slug = useMemo(() => generateSlug(input, separator), [input, separator]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px]">
        <Textarea
          id="slug-input"
          label="Input Text"
          placeholder="Type or paste text to convert to a slug..."
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Dropdown
          id="slug-separator"
          label="Separator"
          options={SEPARATOR_OPTIONS}
          value={separator}
          onChange={(val) => setSeparator(val)}
        />
      </div>

      {/* Output */}
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Generated Slug
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {slug.length} character{slug.length !== 1 ? "s" : ""}
            </span>
            <CopyButton text={slug} />
          </div>
        </div>
        <code className="block select-all break-all font-mono text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
          {slug || (
            <span className="text-zinc-400 dark:text-zinc-500">
              Slug will appear here...
            </span>
          )}
        </code>
      </div>
    </div>
  );
}
