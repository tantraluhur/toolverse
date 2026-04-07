"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleEncode() {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to encode";
      setError(message);
      setOutput("");
    }
  }

  function handleDecode() {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to decode";
      setError(message);
      setOutput("");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleEncode}>
          Encode
        </Button>
        <Button variant="primary" onClick={handleDecode}>
          Decode
        </Button>
        <CopyButton text={output} />
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {error && (
        <Alert variant="error">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Textarea
          id="url-input"
          label="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text or URL here..."
          className="h-48 sm:h-80"
        />
        <Textarea
          id="url-output"
          label="Output"
          value={output}
          readOnly
          placeholder="Encoded or decoded result will appear here..."
          className="h-48 bg-zinc-50 sm:h-80 dark:bg-zinc-900"
        />
      </div>
    </div>
  );
}
