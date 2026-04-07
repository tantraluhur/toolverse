"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

export default function Base64Encoder() {
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
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setError("Failed to encode. Input may contain unsupported characters.");
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
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setError(
        "Failed to decode. Make sure the input is valid Base64-encoded text.",
      );
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
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleEncode}>
          Encode
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          Decode
        </Button>
        <CopyButton text={output} />
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="error">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Input / Output */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Textarea
          id="base64-input"
          label="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode, or Base64 string to decode..."
          className="h-48 sm:h-80"
        />
        <Textarea
          id="base64-output"
          label="Output"
          value={output}
          readOnly
          placeholder="Result will appear here..."
          className="h-48 bg-zinc-50 sm:h-80 dark:bg-zinc-900"
        />
      </div>
    </div>
  );
}
