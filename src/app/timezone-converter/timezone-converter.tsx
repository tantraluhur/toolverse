"use client";

import { useState, useMemo } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import CopyButton from "@/components/ui/CopyButton";

const timezones = [
  { label: "UTC", value: "UTC" },
  { label: "US/Eastern (EST/EDT)", value: "America/New_York" },
  { label: "US/Central (CST/CDT)", value: "America/Chicago" },
  { label: "US/Mountain (MST/MDT)", value: "America/Denver" },
  { label: "US/Pacific (PST/PDT)", value: "America/Los_Angeles" },
  { label: "London (GMT/BST)", value: "Europe/London" },
  { label: "Paris (CET/CEST)", value: "Europe/Paris" },
  { label: "Berlin (CET/CEST)", value: "Europe/Berlin" },
  { label: "Moscow (MSK)", value: "Europe/Moscow" },
  { label: "Dubai (GST)", value: "Asia/Dubai" },
  { label: "India (IST)", value: "Asia/Kolkata" },
  { label: "Bangkok (ICT)", value: "Asia/Bangkok" },
  { label: "Jakarta (WIB)", value: "Asia/Jakarta" },
  { label: "Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Hong Kong (HKT)", value: "Asia/Hong_Kong" },
  { label: "Shanghai (CST)", value: "Asia/Shanghai" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Seoul (KST)", value: "Asia/Seoul" },
  { label: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  { label: "Auckland (NZST/NZDT)", value: "Pacific/Auckland" },
  { label: "São Paulo (BRT)", value: "America/Sao_Paulo" },
];

export default function TimezoneConverter() {
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("Asia/Jakarta");
  const [dateInput, setDateInput] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });

  const converted = useMemo(() => {
    try {
      // Parse the input as a date in the "from" timezone
      const inputDate = new Date(dateInput);
      if (isNaN(inputDate.getTime())) return null;

      const fromFormatted = new Intl.DateTimeFormat("en-US", {
        timeZone: fromTz,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }).format(inputDate);

      const toFormatted = new Intl.DateTimeFormat("en-US", {
        timeZone: toTz,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }).format(inputDate);

      return { from: fromFormatted, to: toFormatted };
    } catch {
      return null;
    }
  }, [dateInput, fromTz, toTz]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Dropdown
          id="from-tz"
          label="From Time Zone"
          options={timezones}
          value={fromTz}
          onChange={setFromTz}
        />
        <Dropdown
          id="to-tz"
          label="To Time Zone"
          options={timezones}
          value={toTz}
          onChange={setToTz}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Date & Time
        </label>
        <div className="flex flex-wrap gap-2">
          <Input
            type="date"
            value={dateInput.slice(0, 10)}
            onChange={(e) =>
              setDateInput(
                e.target.value + "T" + (dateInput.slice(11) || "12:00"),
              )
            }
            className="w-auto"
          />
          <Input
            type="time"
            value={dateInput.slice(11, 16)}
            onChange={(e) =>
              setDateInput(dateInput.slice(0, 10) + "T" + e.target.value)
            }
            className="w-auto"
          />
        </div>
      </div>

      {/* Result */}
      {converted && (
        <div className="grid gap-3 sm:grid-cols-2">
          <TimeResult label="Source" value={converted.from} />
          <TimeResult label="Converted" value={converted.to} />
        </div>
      )}
    </div>
  );
}

function TimeResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
        <CopyButton text={value} />
      </div>
      <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}
