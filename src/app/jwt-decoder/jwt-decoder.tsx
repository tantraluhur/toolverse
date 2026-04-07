"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

interface DecodedJwt {
  header: string;
  payload: string;
  signature: string;
}

function base64UrlDecode(str: string): string {
  // Replace Base64url chars with standard Base64 and pad
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid JWT: expected 3 parts (header.payload.signature), got " +
        parts.length,
    );
  }

  const header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
  const payload = JSON.stringify(
    JSON.parse(base64UrlDecode(parts[1])),
    null,
    2,
  );
  const signature = parts[2];

  return { header, payload, signature };
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");

  function handleDecode() {
    setError("");
    setDecoded(null);

    if (!input.trim()) return;

    try {
      setDecoded(decodeJwt(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to decode JWT");
    }
  }

  function handleClear() {
    setInput("");
    setDecoded(null);
    setError("");
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Input */}
      <Textarea
        id="jwt-input"
        label="JWT Token"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JWT token here... (e.g. eyJhbGciOi...)"
        className="h-28 sm:h-32"
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleDecode}>
          Decode
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="error">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Decoded output */}
      {decoded && (
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
          <DecodedSection title="Header" value={decoded.header} />
          <DecodedSection title="Payload" value={decoded.payload} />
          <DecodedSection title="Signature" value={decoded.signature} mono />
        </div>
      )}
    </div>
  );
}

function DecodedSection({
  title,
  value,
  mono,
}: {
  title: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {title}
        </span>
        <CopyButton text={value} />
      </div>
      <pre
        className={`overflow-x-auto p-3 text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 ${mono ? "break-all font-mono" : "font-mono"}`}
      >
        {value}
      </pre>
    </div>
  );
}
