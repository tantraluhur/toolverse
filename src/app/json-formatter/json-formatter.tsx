"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function formatJson(indent: number) {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JSON";
      setError(message);
      setOutput("");
    }
  }

  function handleFormat() {
    formatJson(2);
  }

  function handleMinify() {
    formatJson(0);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleFormat}>
          Format
        </Button>
        <Button variant="secondary" onClick={handleMinify}>
          Minify
        </Button>
        <CopyButton text={output} />
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="error">
          <strong>Invalid JSON:</strong> {error}
        </Alert>
      )}

      {/* Input / Output */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Textarea
          id="json-input"
          label="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here...\n{"key": "value"}'
          className="h-48 sm:h-80"
        />
        <Textarea
          id="json-output"
          label="Output"
          value={output}
          readOnly
          placeholder="Formatted JSON will appear here..."
          className="h-48 bg-zinc-50 sm:h-80 dark:bg-zinc-900"
        />
      </div>
    </div>
  );
}
