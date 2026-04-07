"use client";

import { useState, useMemo } from "react";
import { tools } from "@/lib/tools-registry";
import { categoryLabels, type ToolCategory } from "@/types/tool";
import ToolCard from "@/components/ui/ToolCard";

const badges: Record<string, "new" | "popular"> = {
  "json-formatter": "popular",
  "password-generator": "popular",
  "qr-code-generator": "popular",
};

const categoryOrder: ToolCategory[] = ["dev", "text", "security", "media", "utility"];

export default function ToolGrid() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        categoryLabels[t.category].toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Partial<Record<ToolCategory, typeof tools>> = {};
    for (const tool of filtered) {
      if (!map[tool.category]) map[tool.category] = [];
      map[tool.category]!.push(tool);
    }
    return map;
  }, [filtered]);

  const totalResults = filtered.length;

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools... (e.g. JSON, password, QR code)"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-base text-zinc-900 shadow-sm placeholder-zinc-400 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-accent-purple/30"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* Results count when searching */}
      {query.trim() && (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {totalResults === 0
            ? "No tools found. Try a different search."
            : `${totalResults} tool${totalResults !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Tool grid by category */}
      {categoryOrder.map((category) => {
        const categoryTools = grouped[category];
        if (!categoryTools || categoryTools.length === 0) return null;

        return (
          <section key={category} className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-semibold text-zinc-800 sm:mb-4 sm:text-xl dark:text-zinc-200">
              {categoryLabels[category]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  name={tool.name}
                  slug={tool.slug}
                  description={tool.description}
                  category={tool.category}
                  badge={badges[tool.slug]}
                />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}
