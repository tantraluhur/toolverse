"use client";

import { useState } from "react";
import Button from "./Button";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="secondary"
      onClick={handleCopy}
      disabled={!text}
      className={className}
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
