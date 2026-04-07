"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

// --- Age calculation ---

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
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const totalDays = Math.floor(
    (today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24),
  );

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

// --- Constants ---

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

// --- Component ---

export default function AgeCalculator() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!selectedDate) return null;
    if (selectedDate > today) {
      setError("Date of birth cannot be in the future.");
      return null;
    }
    setError("");
    return calculateAge(selectedDate, today);
  }, [selectedDate, today]);

  function handleSelectDay(day: number) {
    const date = new Date(calYear, calMonth, day);
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
    setError("");
  }

  function handleClear() {
    setSelectedDate(null);
    setError("");
    setCalMonth(today.getMonth());
    setCalYear(today.getFullYear());
  }

  function handleToday() {
    setCalMonth(today.getMonth());
    setCalYear(today.getFullYear());
  }

  function handleMonthChange(month: number) {
    setCalMonth(month);
    // If switching to a future month in the current year, cap to today's month
    if (calYear === today.getFullYear() && month > today.getMonth()) {
      setCalMonth(today.getMonth());
    }
  }

  function handleYearChange(year: number) {
    setCalYear(year);
    // If switching to current year and month is in the future, cap it
    if (year === today.getFullYear() && calMonth > today.getMonth()) {
      setCalMonth(today.getMonth());
    }
  }

  // Calendar grid
  const totalDaysInMonth = daysInMonth(calMonth, calYear);
  const startDay = firstDayOfMonth(calMonth, calYear);

  // Clamp month options if viewing current year
  const monthOptions = MONTH_NAMES.map((name, i) => ({
    label: name,
    value: i,
    disabled: calYear === today.getFullYear() && i > today.getMonth(),
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* Calendar */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Year + Month selectors */}
          <div className="mb-4 flex gap-2">
            <MonthDropdown
              value={calMonth}
              options={monthOptions}
              onChange={handleMonthChange}
            />
            <YearDropdown
              value={calYear}
              maxYear={today.getFullYear()}
              onChange={handleYearChange}
            />
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {DAY_HEADERS.map((d) => (
              <div
                key={d}
                className="py-1 text-xs font-medium text-zinc-400 dark:text-zinc-500"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 text-center">
            {Array.from({ length: startDay }, (_, i) => (
              <div key={`e-${i}`} className="p-1" />
            ))}

            {Array.from({ length: totalDaysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(calYear, calMonth, day);
              const isFuture = date > today;
              const isToday =
                day === today.getDate() &&
                calMonth === today.getMonth() &&
                calYear === today.getFullYear();
              const isSelected =
                selectedDate !== null &&
                day === selectedDate.getDate() &&
                calMonth === selectedDate.getMonth() &&
                calYear === selectedDate.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => !isFuture && handleSelectDay(day)}
                  disabled={isFuture}
                  className={`m-0.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-30 ${
                    isSelected
                      ? "brand-gradient text-white shadow-sm"
                      : isToday
                        ? "border border-accent-purple/50 text-accent-purple dark:text-accent-cyan"
                        : "text-zinc-700 hover:bg-accent-purple/10 hover:text-accent-purple dark:text-zinc-300 dark:hover:bg-accent-purple/10 dark:hover:text-accent-cyan"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <button
              onClick={handleToday}
              className="cursor-pointer text-xs font-medium text-accent-purple hover:underline dark:text-accent-cyan"
            >
              Go to today
            </button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {/* Selected date */}
          {selectedDate && (
            <div className="mt-3 rounded-lg bg-accent-purple/5 px-3 py-2 text-center text-sm font-medium text-zinc-800 dark:bg-accent-purple/10 dark:text-zinc-200">
              {MONTH_SHORT[selectedDate.getMonth()]}{" "}
              {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {!result && !error && (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 p-8 dark:border-zinc-800">
              <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
                Select your date of birth from the calendar to see your age.
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Your age is
                </p>
                <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                  <AgeUnit value={result.years} label="year" />
                  <AgeUnit value={result.months} label="month" />
                  <AgeUnit value={result.days} label="day" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                  label="Total Months"
                  value={result.totalMonths.toLocaleString()}
                />
                <StatCard
                  label="Total Days"
                  value={result.totalDays.toLocaleString()}
                />
                <StatCard
                  label="Next Birthday"
                  value={
                    result.nextBirthdayDays === 0
                      ? "Today! 🎂"
                      : `${result.nextBirthdayDays} day${result.nextBirthdayDays !== 1 ? "s" : ""}`
                  }
                  highlight={result.nextBirthdayDays === 0}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Month Dropdown ---

function MonthDropdown({
  value,
  options,
  onChange,
}: {
  value: number;
  options: { label: string; value: number; disabled: boolean }[];
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
      >
        {MONTH_NAMES[value]}
        <ChevronDownIcon />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                if (!opt.disabled) {
                  onChange(opt.value);
                  setOpen(false);
                }
              }}
              className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                opt.disabled
                  ? "cursor-not-allowed text-zinc-300 dark:text-zinc-700"
                  : opt.value === value
                    ? "bg-accent-purple/10 font-medium text-accent-purple dark:text-accent-cyan"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Year Dropdown ---

function YearDropdown({
  value,
  maxYear,
  onChange,
}: {
  value: number;
  maxYear: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const minYear = maxYear - 120;
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // Scroll to selected year when opening
  useEffect(() => {
    if (!open || !listRef.current) return;
    const idx = years.indexOf(value);
    if (idx >= 0) {
      const item = listRef.current.children[idx] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "center" });
    }
  }, [open, value, years]);

  return (
    <div ref={ref} className="relative w-24">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
      >
        {value}
        <ChevronDownIcon />
      </button>
      {open && (
        <ul
          ref={listRef}
          className="absolute right-0 z-50 mt-1 max-h-52 w-28 overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {years.map((y) => (
            <li
              key={y}
              onClick={() => {
                onChange(y);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-1.5 text-center text-sm transition-colors ${
                y === value
                  ? "bg-accent-purple/10 font-medium text-accent-purple dark:text-accent-cyan"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {y}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Sub-components ---

function AgeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <span className="text-3xl font-bold sm:text-4xl">
        <span className="brand-gradient-text">{value}</span>
      </span>{" "}
      <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
        {value === 1 ? label : `${label}s`}
      </span>
    </span>
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
    <div className="rounded-xl border border-zinc-200 p-4 text-center dark:border-zinc-700">
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

// --- Icons ---

function ChevronDownIcon() {
  return (
    <svg
      className="ml-1 h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
