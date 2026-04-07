"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools-registry";
import { categoryLabels, type ToolCategory } from "@/types/tool";
import ToolCard from "@/components/ui/ToolCard";

const badges: Record<string, "new" | "popular"> = {
  "json-formatter": "popular",
  "password-generator": "popular",
  "qr-code-generator": "popular",
};

const categoryOrder: ToolCategory[] = [
  "dev",
  "text",
  "security",
  "media",
  "utility",
  "fun",
];

const categorySectionBg: Record<ToolCategory, string> = {
  dev: "bg-blue-50/40 dark:bg-blue-950/10",
  text: "bg-violet-50/40 dark:bg-violet-950/10",
  security: "bg-amber-50/40 dark:bg-amber-950/10",
  media: "bg-pink-50/40 dark:bg-pink-950/10",
  utility: "bg-emerald-50/40 dark:bg-emerald-950/10",
  fun: "bg-orange-50/40 dark:bg-orange-950/10",
};

const RECENT_KEY = "toolverse_recent";
const MAX_RECENT = 5;

function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ToolGrid() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(
    "all",
  );
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  // Load recently used tools from localStorage
  useEffect(() => {
    setRecentSlugs(getRecentTools());
  }, []);

  const recentTools = useMemo(() => {
    const result: typeof tools = [];
    for (const slug of recentSlugs) {
      const tool = tools.find((t) => t.slug === slug);
      if (tool) result.push(tool);
    }
    return result;
  }, [recentSlugs]);

  const filtered = useMemo(() => {
    let result = tools;

    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          categoryLabels[t.category].toLowerCase().includes(q),
      );
    }

    return result;
  }, [query, activeCategory]);

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
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools... (e.g. JSON, password, QR code)"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-base text-zinc-900 shadow-sm placeholder-zinc-400 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-accent-purple/30"
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

      {/* Category filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterTab
          label="All"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {categoryOrder.map((cat) => (
          <FilterTab
            key={cat}
            label={categoryLabels[cat]}
            active={activeCategory === cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? "all" : cat)
            }
          />
        ))}
      </div>

      {/* Results count when searching */}
      {query.trim() && (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {totalResults === 0
            ? "No tools found. Try a different search."
            : `${totalResults} tool${totalResults !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Recently used */}
      {!query.trim() &&
        activeCategory === "all" &&
        recentTools.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-zinc-800 sm:mb-4 sm:text-xl dark:text-zinc-200">
              Recently Used
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-accent-purple/40 hover:bg-accent-purple/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-accent-purple/30 dark:hover:bg-accent-purple/10"
                >
                  <span className="text-xs font-bold text-accent-purple dark:text-accent-cyan">
                    {tool.icon}
                  </span>
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>
        )}

      {/* Tool grid by category */}
      {categoryOrder.map((category) => {
        const categoryTools = grouped[category];
        if (!categoryTools || categoryTools.length === 0) return null;

        return (
          <section
            key={category}
            className={`-mx-4 mb-6 rounded-2xl px-4 py-5 sm:mb-8 sm:py-6 ${categorySectionBg[category]}`}
          >
            <h2 className="mb-3 text-lg font-semibold text-zinc-800 sm:mb-4 sm:text-xl dark:text-zinc-200">
              {categoryLabels[category]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  name={tool.name}
                  slug={tool.slug}
                  shortDescription={tool.shortDescription}
                  icon={tool.icon}
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

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
        active
          ? "brand-gradient text-white shadow-sm"
          : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
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
