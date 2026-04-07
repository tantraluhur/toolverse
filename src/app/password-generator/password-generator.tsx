"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generatePassword(
  length: number,
  uppercase: boolean,
  numbers: boolean,
  symbols: boolean,
): string {
  let charset = LOWERCASE;
  if (uppercase) charset += UPPERCASE;
  if (numbers) charset += NUMBERS;
  if (symbols) charset += SYMBOLS;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (n) => charset[n % charset.length]).join("");
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(length, uppercase, numbers, symbols));
  }, [length, uppercase, numbers, symbols]);

  function handleClear() {
    setPassword("");
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Options */}
      <div className="space-y-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
        {/* Length slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="pw-length"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Length
            </label>
            <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {length}
            </span>
          </div>
          <input
            id="pw-length"
            type="range"
            min={8}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full cursor-pointer accent-accent-purple"
          />
          <div className="mt-1 flex justify-between text-xs text-zinc-400">
            <span>8</span>
            <span>32</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Toggle
            id="pw-uppercase"
            label="Uppercase (A-Z)"
            checked={uppercase}
            onChange={setUppercase}
          />
          <Toggle
            id="pw-numbers"
            label="Numbers (0-9)"
            checked={numbers}
            onChange={setNumbers}
          />
          <Toggle
            id="pw-symbols"
            label="Symbols (!@#...)"
            checked={symbols}
            onChange={setSymbols}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleGenerate}>
          Generate
        </Button>
        <CopyButton text={password} />
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Output */}
      {password && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
          <code className="block select-all break-all font-mono text-base leading-relaxed text-zinc-900 sm:text-lg dark:text-zinc-100">
            {password}
          </code>
        </div>
      )}
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-accent-purple"
      />
      {label}
    </label>
  );
}
