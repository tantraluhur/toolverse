"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CopyButton from "@/components/ui/CopyButton";
import Alert from "@/components/ui/Alert";

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
        <div className="mt-0.5 truncate text-sm font-mono text-zinc-900 dark:text-zinc-100">
          {value || "\u2014"}
        </div>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [utcDate, setUtcDate] = useState("");
  const [localDate, setLocalDate] = useState("");
  const [tsError, setTsError] = useState("");

  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [unixSeconds, setUnixSeconds] = useState("");
  const [unixMilliseconds, setUnixMilliseconds] = useState("");
  const [dateError, setDateError] = useState("");

  function handleTimestampConvert() {
    setTsError("");
    setUtcDate("");
    setLocalDate("");

    if (!timestamp.trim()) return;

    const num = Number(timestamp.trim());
    if (isNaN(num)) {
      setTsError("Please enter a valid number.");
      return;
    }

    // Auto-detect seconds vs milliseconds: if > 1e12, treat as ms
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setTsError("Invalid timestamp value.");
      return;
    }

    setUtcDate(date.toUTCString());
    setLocalDate(date.toString());
  }

  function handleNow() {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(String(now));
    const date = new Date(now * 1000);
    setUtcDate(date.toUTCString());
    setLocalDate(date.toString());
    setTsError("");
  }

  function handleDateConvert() {
    setDateError("");
    setUnixSeconds("");
    setUnixMilliseconds("");

    if (!dateInput.trim()) return;

    const dateTimeStr = timeInput.trim()
      ? `${dateInput.trim()}T${timeInput.trim()}`
      : `${dateInput.trim()}T00:00:00`;

    const date = new Date(dateTimeStr);

    if (isNaN(date.getTime())) {
      setDateError("Please enter a valid date.");
      return;
    }

    const ms = date.getTime();
    setUnixSeconds(String(Math.floor(ms / 1000)));
    setUnixMilliseconds(String(ms));
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Section 1: Timestamp to Date */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-700 dark:bg-zinc-950">
        <h2 className="text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-50">
          Unix Timestamp to Date
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter a Unix timestamp (seconds or milliseconds) to convert it to a human-readable date.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Input
              id="ts-input"
              label="Unix Timestamp"
              type="text"
              inputMode="numeric"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="e.g. 1700000000"
            />
          </div>
          <Button variant="primary" onClick={handleTimestampConvert}>
            Convert
          </Button>
          <Button variant="outline" onClick={handleNow}>
            Now
          </Button>
        </div>

        {tsError && (
          <div className="mt-3">
            <Alert variant="error">{tsError}</Alert>
          </div>
        )}

        {(utcDate || localDate) && (
          <div className="mt-4 space-y-3">
            <ResultRow label="UTC" value={utcDate} />
            <ResultRow label="Local Time" value={localDate} />
          </div>
        )}
      </div>

      {/* Section 2: Date to Timestamp */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-700 dark:bg-zinc-950">
        <h2 className="text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-50">
          Date to Unix Timestamp
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter a date and optional time to convert to a Unix timestamp.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-44">
            <Input
              id="date-input"
              label="Date"
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
          <div className="w-36">
            <Input
              id="time-input"
              label="Time (optional)"
              type="time"
              step="1"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={handleDateConvert}>
            Convert
          </Button>
        </div>

        {dateError && (
          <div className="mt-3">
            <Alert variant="error">{dateError}</Alert>
          </div>
        )}

        {(unixSeconds || unixMilliseconds) && (
          <div className="mt-4 space-y-3">
            <ResultRow label="Seconds" value={unixSeconds} />
            <ResultRow label="Milliseconds" value={unixMilliseconds} />
          </div>
        )}
      </div>
    </div>
  );
}
