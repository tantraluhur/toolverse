"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface Detection {
  tool: string;
  slug: string;
  icon: string;
  label: string;
  confidence: "high" | "medium";
}

function detect(text: string): Detection[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const results: Detection[] = [];

  // JWT — 3 dot-separated base64url segments
  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(trimmed)) {
    results.push({
      tool: "JWT Decoder",
      slug: "jwt-decoder",
      icon: "JWT",
      label: "This looks like a JWT token",
      confidence: "high",
    });
  }

  // JSON — starts with { or [
  if (/^[\[{]/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      results.push({
        tool: "JSON Formatter",
        slug: "json-formatter",
        icon: "{ }",
        label: "This looks like JSON",
        confidence: "high",
      });
    } catch {
      // malformed JSON — still suggest
      if (trimmed.length > 5) {
        results.push({
          tool: "JSON Formatter",
          slug: "json-formatter",
          icon: "{ }",
          label: "This might be JSON (has errors)",
          confidence: "medium",
        });
      }
    }
  }

  // URL — starts with http:// or https://
  if (/^https?:\/\/.+/i.test(trimmed)) {
    results.push({
      tool: "QR Code Generator",
      slug: "qr-code-generator",
      icon: "QR",
      label: "This is a URL — generate a QR code",
      confidence: "high",
    });
    results.push({
      tool: "URL Encoder",
      slug: "url-encoder",
      icon: "%",
      label: "Encode this URL",
      confidence: "medium",
    });
  }

  // URL encoded — contains %XX patterns
  if (/%[0-9A-Fa-f]{2}/.test(trimmed) && !trimmed.startsWith("http")) {
    results.push({
      tool: "URL Decoder",
      slug: "url-encoder",
      icon: "%",
      label: "This looks URL-encoded",
      confidence: "high",
    });
  }

  // Base64 — long string of base64 chars (no spaces, no special chars)
  if (
    /^[A-Za-z0-9+/=]{20,}$/.test(trimmed) &&
    trimmed.length % 4 <= 1 &&
    !results.some((r) => r.slug === "jwt-decoder")
  ) {
    results.push({
      tool: "Base64 Decoder",
      slug: "base64-encoder",
      icon: "B64",
      label: "This looks like Base64",
      confidence: "high",
    });
  }

  // UUID — matches UUID pattern
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      trimmed,
    )
  ) {
    results.push({
      tool: "UUID Generator",
      slug: "uuid-generator",
      icon: "#",
      label: "This is a UUID",
      confidence: "high",
    });
  }

  // Unix timestamp — 10 or 13 digit number
  if (/^\d{10,13}$/.test(trimmed)) {
    const num = Number(trimmed);
    const ms = trimmed.length === 13 ? num : num * 1000;
    const date = new Date(ms);
    if (date.getFullYear() > 1970 && date.getFullYear() < 2100) {
      results.push({
        tool: "Timestamp Converter",
        slug: "timestamp-converter",
        icon: "T",
        label: "This looks like a Unix timestamp",
        confidence: "high",
      });
    }
  }

  // Binary — only 0s, 1s, and spaces
  if (/^[01\s]{8,}$/.test(trimmed) && /[01]{4,}/.test(trimmed)) {
    results.push({
      tool: "Number Base Converter",
      slug: "number-base-converter",
      icon: "01",
      label: "This looks like binary",
      confidence: "high",
    });
  }

  // Hex — starts with 0x or long hex string
  if (/^(0x)?[0-9a-f]{8,}$/i.test(trimmed)) {
    results.push({
      tool: "Number Base Converter",
      slug: "number-base-converter",
      icon: "01",
      label: "This looks like hexadecimal",
      confidence: "medium",
    });
  }

  // Hash — 32, 40, 64, or 128 char hex string (MD5, SHA-1, SHA-256, SHA-512)
  if (/^[0-9a-f]{32}$/i.test(trimmed) || /^[0-9a-f]{40}$/i.test(trimmed) || /^[0-9a-f]{64}$/i.test(trimmed) || /^[0-9a-f]{128}$/i.test(trimmed)) {
    results.push({
      tool: "Hash Generator",
      slug: "hash-generator",
      icon: "#!",
      label: `This looks like a ${trimmed.length === 32 ? "MD5" : trimmed.length === 40 ? "SHA-1" : trimmed.length === 64 ? "SHA-256" : "SHA-512"} hash`,
      confidence: "high",
    });
  }

  // Multi-line text — suggest word counter or case converter
  const lineCount = trimmed.split("\n").length;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (wordCount > 10 && results.length === 0) {
    results.push({
      tool: "Word Counter",
      slug: "word-counter",
      icon: "Wc",
      label: `${wordCount} words detected`,
      confidence: "medium",
    });
  }

  if (lineCount > 3 && results.length === 0) {
    results.push({
      tool: "Case Converter",
      slug: "case-converter",
      icon: "Aa",
      label: "Convert the case of this text",
      confidence: "medium",
    });
  }

  // Fallback — any text can generate a slug or QR
  if (results.length === 0 && trimmed.length > 2) {
    results.push({
      tool: "Slug Generator",
      slug: "slug-generator",
      icon: "/",
      label: "Turn this into a URL slug",
      confidence: "medium",
    });
    results.push({
      tool: "QR Code Generator",
      slug: "qr-code-generator",
      icon: "QR",
      label: "Generate a QR code for this text",
      confidence: "medium",
    });
  }

  return results.slice(0, 4);
}

export default function SmartPaste() {
  const [pasted, setPasted] = useState("");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const text = e.clipboardData.getData("text");
      // Let the paste happen naturally
      setTimeout(() => {
        const results = detect(text);
        setDetections(results);
        setShowResults(results.length > 0);
      }, 0);
    },
    [],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setPasted(text);
      if (!text.trim()) {
        setDetections([]);
        setShowResults(false);
        return;
      }
      const results = detect(text);
      setDetections(results);
      setShowResults(results.length > 0);
    },
    [],
  );

  function handleClear() {
    setPasted("");
    setDetections([]);
    setShowResults(false);
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
      <div className="relative">
        <textarea
          value={pasted}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Paste anything here — we'll detect the format and suggest the right tool..."
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-900 shadow-sm placeholder-zinc-400 transition-all focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        {pasted && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 flex cursor-pointer items-center justify-center rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {/* Detection results */}
      {showResults && detections.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Detected — pick a tool:
            </p>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {detections.map((d) => (
              <Link
                key={d.slug + d.label}
                href={`/${d.slug}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent-purple/5 dark:hover:bg-accent-purple/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10 text-xs font-bold text-accent-purple dark:bg-accent-purple/20 dark:text-accent-cyan">
                  {d.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {d.label}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Open {d.tool} &rarr;
                  </p>
                </div>
                {d.confidence === "high" && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    Match
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
