"use client";

import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";

function formatResult(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "";
  return parseFloat(value.toFixed(6)).toString();
}

function CalculatorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
      <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {children}
    </div>
  );
}

function PercentOf() {
  const [percent, setPercent] = useState("");
  const [number, setNumber] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(percent);
    const n = parseFloat(number);
    if (isNaN(p) || isNaN(n)) return "";
    return formatResult((p / 100) * n);
  }, [percent, number]);

  return (
    <CalculatorSection title="What is X% of Y?">
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">What is</span>
        <div className="w-28">
          <Input
            id="pct-of-percent"
            type="number"
            placeholder="X"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">% of</span>
        <div className="w-36">
          <Input
            id="pct-of-number"
            type="number"
            placeholder="Y"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">=</span>
        <span className="brand-gradient-text text-xl font-bold">
          {result || "?"}
        </span>
      </div>
    </CalculatorSection>
  );
}

function WhatPercent() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const result = useMemo(() => {
    const xVal = parseFloat(x);
    const yVal = parseFloat(y);
    if (isNaN(xVal) || isNaN(yVal) || yVal === 0) return "";
    return formatResult((xVal / yVal) * 100);
  }, [x, y]);

  return (
    <CalculatorSection title="X is what % of Y?">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-28">
          <Input
            id="what-pct-x"
            type="number"
            placeholder="X"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          is what % of
        </span>
        <div className="w-36">
          <Input
            id="what-pct-y"
            type="number"
            placeholder="Y"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">=</span>
        <span className="brand-gradient-text text-xl font-bold">
          {result ? `${result}%` : "?"}
        </span>
      </div>
    </CalculatorSection>
  );
}

function PercentChange() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const result = useMemo(() => {
    const fromVal = parseFloat(from);
    const toVal = parseFloat(to);
    if (isNaN(fromVal) || isNaN(toVal) || fromVal === 0) return "";
    return formatResult(((toVal - fromVal) / Math.abs(fromVal)) * 100);
  }, [from, to]);

  const changeLabel = useMemo(() => {
    if (!result) return "";
    const val = parseFloat(result);
    if (val > 0) return "increase";
    if (val < 0) return "decrease";
    return "no change";
  }, [result]);

  return (
    <CalculatorSection title="Percentage change from X to Y">
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">From</span>
        <div className="w-28">
          <Input
            id="pct-change-from"
            type="number"
            placeholder="X"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">to</span>
        <div className="w-36">
          <Input
            id="pct-change-to"
            type="number"
            placeholder="Y"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">=</span>
        <span className="brand-gradient-text text-xl font-bold">
          {result ? `${result}%` : "?"}
        </span>
        {changeLabel && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            ({changeLabel})
          </span>
        )}
      </div>
    </CalculatorSection>
  );
}

export default function PercentageCalculator() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PercentOf />
      <WhatPercent />
      <PercentChange />
    </div>
  );
}
