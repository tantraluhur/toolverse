"use client";

import { useState, useMemo } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import CopyButton from "@/components/ui/CopyButton";

const timezones = [
  // UTC
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },

  // North America
  { label: "US - New York (EST/EDT)", value: "America/New_York" },
  { label: "US - Chicago (CST/CDT)", value: "America/Chicago" },
  { label: "US - Denver (MST/MDT)", value: "America/Denver" },
  { label: "US - Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
  { label: "US - Anchorage (AKST/AKDT)", value: "America/Anchorage" },
  { label: "US - Honolulu (HST)", value: "Pacific/Honolulu" },
  { label: "US - Phoenix (MST)", value: "America/Phoenix" },
  { label: "Canada - Toronto (EST/EDT)", value: "America/Toronto" },
  { label: "Canada - Vancouver (PST/PDT)", value: "America/Vancouver" },
  { label: "Mexico - Mexico City (CST/CDT)", value: "America/Mexico_City" },

  // South America
  { label: "Brazil - São Paulo (BRT)", value: "America/Sao_Paulo" },
  { label: "Argentina - Buenos Aires (ART)", value: "America/Argentina/Buenos_Aires" },
  { label: "Colombia - Bogotá (COT)", value: "America/Bogota" },
  { label: "Chile - Santiago (CLT/CLST)", value: "America/Santiago" },
  { label: "Peru - Lima (PET)", value: "America/Lima" },

  // Europe
  { label: "UK - London (GMT/BST)", value: "Europe/London" },
  { label: "France - Paris (CET/CEST)", value: "Europe/Paris" },
  { label: "Germany - Berlin (CET/CEST)", value: "Europe/Berlin" },
  { label: "Spain - Madrid (CET/CEST)", value: "Europe/Madrid" },
  { label: "Italy - Rome (CET/CEST)", value: "Europe/Rome" },
  { label: "Netherlands - Amsterdam (CET/CEST)", value: "Europe/Amsterdam" },
  { label: "Belgium - Brussels (CET/CEST)", value: "Europe/Brussels" },
  { label: "Switzerland - Zurich (CET/CEST)", value: "Europe/Zurich" },
  { label: "Sweden - Stockholm (CET/CEST)", value: "Europe/Stockholm" },
  { label: "Norway - Oslo (CET/CEST)", value: "Europe/Oslo" },
  { label: "Denmark - Copenhagen (CET/CEST)", value: "Europe/Copenhagen" },
  { label: "Finland - Helsinki (EET/EEST)", value: "Europe/Helsinki" },
  { label: "Poland - Warsaw (CET/CEST)", value: "Europe/Warsaw" },
  { label: "Czech Republic - Prague (CET/CEST)", value: "Europe/Prague" },
  { label: "Austria - Vienna (CET/CEST)", value: "Europe/Vienna" },
  { label: "Greece - Athens (EET/EEST)", value: "Europe/Athens" },
  { label: "Romania - Bucharest (EET/EEST)", value: "Europe/Bucharest" },
  { label: "Portugal - Lisbon (WET/WEST)", value: "Europe/Lisbon" },
  { label: "Ireland - Dublin (GMT/IST)", value: "Europe/Dublin" },
  { label: "Russia - Moscow (MSK)", value: "Europe/Moscow" },
  { label: "Turkey - Istanbul (TRT)", value: "Europe/Istanbul" },
  { label: "Ukraine - Kyiv (EET/EEST)", value: "Europe/Kyiv" },

  // Middle East
  { label: "UAE - Dubai (GST)", value: "Asia/Dubai" },
  { label: "Saudi Arabia - Riyadh (AST)", value: "Asia/Riyadh" },
  { label: "Israel - Jerusalem (IST/IDT)", value: "Asia/Jerusalem" },
  { label: "Qatar - Doha (AST)", value: "Asia/Qatar" },
  { label: "Kuwait - Kuwait City (AST)", value: "Asia/Kuwait" },
  { label: "Iran - Tehran (IRST/IRDT)", value: "Asia/Tehran" },
  { label: "Pakistan - Karachi (PKT)", value: "Asia/Karachi" },

  // South Asia
  { label: "India - Kolkata (IST)", value: "Asia/Kolkata" },
  { label: "Sri Lanka - Colombo (IST)", value: "Asia/Colombo" },
  { label: "Bangladesh - Dhaka (BST)", value: "Asia/Dhaka" },
  { label: "Nepal - Kathmandu (NPT)", value: "Asia/Kathmandu" },

  // Southeast Asia
  { label: "Thailand - Bangkok (ICT)", value: "Asia/Bangkok" },
  { label: "Vietnam - Ho Chi Minh (ICT)", value: "Asia/Ho_Chi_Minh" },
  { label: "Indonesia - Jakarta (WIB)", value: "Asia/Jakarta" },
  { label: "Indonesia - Makassar (WITA)", value: "Asia/Makassar" },
  { label: "Indonesia - Jayapura (WIT)", value: "Asia/Jayapura" },
  { label: "Malaysia - Kuala Lumpur (MYT)", value: "Asia/Kuala_Lumpur" },
  { label: "Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Philippines - Manila (PHT)", value: "Asia/Manila" },
  { label: "Myanmar - Yangon (MMT)", value: "Asia/Yangon" },
  { label: "Cambodia - Phnom Penh (ICT)", value: "Asia/Phnom_Penh" },

  // East Asia
  { label: "China - Shanghai (CST)", value: "Asia/Shanghai" },
  { label: "Hong Kong (HKT)", value: "Asia/Hong_Kong" },
  { label: "Taiwan - Taipei (CST)", value: "Asia/Taipei" },
  { label: "Japan - Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "South Korea - Seoul (KST)", value: "Asia/Seoul" },
  { label: "Mongolia - Ulaanbaatar (ULAT)", value: "Asia/Ulaanbaatar" },

  // Oceania
  { label: "Australia - Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  { label: "Australia - Melbourne (AEST/AEDT)", value: "Australia/Melbourne" },
  { label: "Australia - Brisbane (AEST)", value: "Australia/Brisbane" },
  { label: "Australia - Perth (AWST)", value: "Australia/Perth" },
  { label: "Australia - Adelaide (ACST/ACDT)", value: "Australia/Adelaide" },
  { label: "New Zealand - Auckland (NZST/NZDT)", value: "Pacific/Auckland" },
  { label: "Fiji - Suva (FJT)", value: "Pacific/Fiji" },
  { label: "Papua New Guinea (PGT)", value: "Pacific/Port_Moresby" },

  // Africa
  { label: "South Africa - Johannesburg (SAST)", value: "Africa/Johannesburg" },
  { label: "Egypt - Cairo (EET)", value: "Africa/Cairo" },
  { label: "Nigeria - Lagos (WAT)", value: "Africa/Lagos" },
  { label: "Kenya - Nairobi (EAT)", value: "Africa/Nairobi" },
  { label: "Morocco - Casablanca (WET/WEST)", value: "Africa/Casablanca" },
  { label: "Ghana - Accra (GMT)", value: "Africa/Accra" },
  { label: "Ethiopia - Addis Ababa (EAT)", value: "Africa/Addis_Ababa" },
  { label: "Tanzania - Dar es Salaam (EAT)", value: "Africa/Dar_es_Salaam" },
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
          searchable
          placeholder="Search timezone..."
        />
        <Dropdown
          id="to-tz"
          label="To Time Zone"
          options={timezones}
          value={toTz}
          onChange={setToTz}
          searchable
          placeholder="Search timezone..."
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
