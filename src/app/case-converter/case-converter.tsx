"use client";

import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toUpperCase(text: string): string {
  return text.toUpperCase();
}

function toLowerCase(text: string): string {
  return text.toLowerCase();
}

function toTitleCase(text: string): string {
  return text.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*|[.!?]\s+)(\w)/g, (_, separator, char) => separator + char.toUpperCase());
}

function toCamelCase(text: string): string {
  const words = toWords(text);
  if (words.length === 0) return "";
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

function toPascalCase(text: string): string {
  const words = toWords(text);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function toSnakeCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join("-");
}

function toConstantCase(text: string): string {
  return toWords(text).map((w) => w.toUpperCase()).join("_");
}

type ConvertFn = (text: string) => string;

const conversions: { label: string; fn: ConvertFn }[] = [
  { label: "UPPERCASE", fn: toUpperCase },
  { label: "lowercase", fn: toLowerCase },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: toSentenceCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "PascalCase", fn: toPascalCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
  { label: "CONSTANT_CASE", fn: toConstantCase },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function handleConvert(fn: ConvertFn) {
    setOutput(fn(input));
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <Textarea
        id="case-input"
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste your text here..."
        className="h-32 sm:h-48"
      />

      <div className="flex flex-wrap gap-2">
        {conversions.map(({ label, fn }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => handleConvert(fn)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Textarea
          id="case-output"
          label="Output"
          value={output}
          readOnly
          placeholder="Converted text will appear here..."
          className="h-32 bg-zinc-50 sm:h-48 dark:bg-zinc-900"
        />
        <div className="mt-2">
          <CopyButton text={output} />
        </div>
      </div>
    </div>
  );
}
