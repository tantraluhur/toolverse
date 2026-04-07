"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools-registry";
import { categoryLabels, type ToolCategory } from "@/types/tool";

export default function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group tools by category
  const grouped = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof tools>,
  );

  // Close dropdown on click outside
  useEffect(() => {
    if (!toolsOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [toolsOpen]);

  // Close mobile menu on route change (link click)
  function handleLinkClick() {
    setMobileOpen(false);
    setToolsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          onClick={handleLinkClick}
        >
          <span className="brand-gradient-text">Toolverse</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 text-sm sm:flex">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Home
          </Link>

          {/* Tools dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setToolsOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Tools
              <ChevronIcon open={toolsOpen} />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(grouped).map(([category, categoryTools]) => (
                  <div key={category}>
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {categoryLabels[category as ToolCategory]}
                    </div>
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        onClick={handleLinkClick}
                        className="block px-3 py-1.5 text-sm text-zinc-700 hover:bg-accent-purple/5 hover:text-accent-purple dark:text-zinc-300 dark:hover:bg-accent-purple/10 dark:hover:text-accent-cyan"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex cursor-pointer items-center justify-center sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 pb-4 pt-2 sm:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="block py-2 text-sm text-zinc-700 dark:text-zinc-300"
          >
            Home
          </Link>

          {Object.entries(grouped).map(([category, categoryTools]) => (
            <div key={category} className="mt-2">
              <div className="py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {categoryLabels[category as ToolCategory]}
              </div>
              {categoryTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  onClick={handleLinkClick}
                  className="block py-1.5 pl-2 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-6 w-6 text-zinc-700 dark:text-zinc-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6 text-zinc-700 dark:text-zinc-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
