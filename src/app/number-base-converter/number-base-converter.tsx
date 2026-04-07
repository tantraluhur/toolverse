"use client";

import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

interface Base {
  label: string;
  value: string;
  radix: number;
  pattern: RegExp;
}

const BASES: Base[] = [
  { label: "Binary (Base 2)", value: "2", radix: 2, pattern: /^[01]+$/ },
  { label: "Octal (Base 8)", value: "8", radix: 8, pattern: /^[0-7]+$/ },
  { label: "Decimal (Base 10)", value: "10", radix: 10, pattern: /^[0-9]+$/ },
  {
    label: "Hexadecimal (Base 16)",
    value: "16",
    radix: 16,
    pattern: /^[0-9a-fA-F]+$/,
  },
];

const BASE_OPTIONS = BASES.map((b) => ({ label: b.label, value: b.value }));

export default function NumberBaseConverter() {
  const [inputBase, setInputBase] = useState("10");
  const [inputValue, setInputValue] = useState("");

  const currentBase = BASES.find((b) => b.value === inputBase)!;

  const { results, error } = useMemo(() => {
    if (!inputValue.trim()) {
      return { results: null, error: "" };
    }

    if (!currentBase.pattern.test(inputValue.trim())) {
      return {
        results: null,
        error: `Invalid input for ${currentBase.label}. Only digits ${
          currentBase.radix === 2
            ? "0-1"
            : currentBase.radix === 8
              ? "0-7"
              : currentBase.radix === 10
                ? "0-9"
                : "0-9 and A-F"
        } are allowed.`,
      };
    }

    try {
      const decimal = parseInt(inputValue.trim(), currentBase.radix);
      if (isNaN(decimal) || decimal < 0) {
        return { results: null, error: "Could not parse the input number." };
      }

      return {
        results: {
          Binary: decimal.toString(2),
          Octal: decimal.toString(8),
          Decimal: decimal.toString(10),
          Hexadecimal: decimal.toString(16).toUpperCase(),
        },
        error: "",
      };
    } catch {
      return { results: null, error: "Could not parse the input number." };
    }
  }, [inputValue, currentBase]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Dropdown
            id="input-base"
            label="Input Base"
            options={BASE_OPTIONS}
            value={inputBase}
            onChange={(val) => {
              setInputBase(val);
              setInputValue("");
            }}
          />
          <Input
            id="input-value"
            label="Number"
            type="text"
            placeholder={`Enter a ${currentBase.label.toLowerCase().split(" (")[0]} number...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {results && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(results).map(([label, value]) => (
            <div
              key={label}
              className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {label}
                </span>
                <CopyButton text={value} />
              </div>
              <code className="block select-all break-all font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
                {value}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
