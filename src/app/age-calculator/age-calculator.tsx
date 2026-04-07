"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  nextBirthdayDays: number;
}

function calculateAge(dob: Date, today: Date): AgeResult {
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    // Days in the previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Total months
  const totalMonths = years * 12 + months;

  // Total days (accurate including leap years)
  const totalDays = Math.floor(
    (today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Next birthday countdown
  let nextBirthday = new Date(
    today.getFullYear(),
    dob.getMonth(),
    dob.getDate(),
  );
  if (nextBirthday <= today) {
    nextBirthday = new Date(
      today.getFullYear() + 1,
      dob.getMonth(),
      dob.getDate(),
    );
  }
  const nextBirthdayDays = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return { years, months, days, totalMonths, totalDays, nextBirthdayDays };
}

export default function AgeCalculator() {
  const [dobInput, setDobInput] = useState("");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!dobInput) {
      setError("");
      return null;
    }

    const dob = new Date(dobInput + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(dob.getTime())) {
      setError("Please enter a valid date.");
      return null;
    }

    if (dob > today) {
      setError("Date of birth cannot be in the future.");
      return null;
    }

    setError("");
    return calculateAge(dob, today);
  }, [dobInput]);

  function handleClear() {
    setDobInput("");
    setError("");
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Input */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="dob-input"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Date of Birth
          </label>
          <input
            id="dob-input"
            type="date"
            value={dobInput}
            onChange={(e) => setDobInput(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Primary age display */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Your age is
            </p>
            <p className="mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-50">
              <span className="brand-gradient-text">
                {result.years}
              </span>{" "}
              <span className="text-lg font-normal text-zinc-500 dark:text-zinc-400">
                {result.years === 1 ? "year" : "years"}
              </span>
              {", "}
              <span className="brand-gradient-text">
                {result.months}
              </span>{" "}
              <span className="text-lg font-normal text-zinc-500 dark:text-zinc-400">
                {result.months === 1 ? "month" : "months"}
              </span>
              {", "}
              <span className="brand-gradient-text">
                {result.days}
              </span>{" "}
              <span className="text-lg font-normal text-zinc-500 dark:text-zinc-400">
                {result.days === 1 ? "day" : "days"}
              </span>
            </p>
          </div>

          {/* Detail cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Months" value={result.totalMonths.toLocaleString()} />
            <StatCard label="Total Days" value={result.totalDays.toLocaleString()} />
            <StatCard
              label="Next Birthday"
              value={
                result.nextBirthdayDays === 0
                  ? "Today!"
                  : `${result.nextBirthdayDays} day${result.nextBirthdayDays !== 1 ? "s" : ""}`
              }
              highlight={result.nextBirthdayDays === 0}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md border border-zinc-200 p-4 text-center dark:border-zinc-700">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-bold ${highlight ? "brand-gradient-text" : "text-zinc-900 dark:text-zinc-50"}`}
      >
        {value}
      </p>
    </div>
  );
}
