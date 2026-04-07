import type { Metadata } from "next";
import TimezoneConverter from "./timezone-converter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Time Zone Converter Online",
  description:
    "Convert time between time zones online for free. Supports all major time zones including UTC, EST, PST, JST, WIB, and more. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/timezone-converter",
  },
};

export default function TimezoneConverterPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Time Zone Converter", description: "Convert time between time zones online for free. Supports all major time zones including UTC, EST, PST, JST, WIB, and more. No sign-up required.", url: "https://toolverse.app/timezone-converter" })} />
      <TrackVisit slug="timezone-converter" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Time Zone Converter
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Select source and target time zones, pick a date and time, and see the
        converted result instantly.
      </p>

      <div className="mt-4 sm:mt-6">
        <TimezoneConverter />
      </div>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Select the source time zone from the &quot;From&quot; dropdown.</li>
          <li>Select the target time zone from the &quot;To&quot; dropdown.</li>
          <li>Pick a date and time using the date-time input.</li>
          <li>The converted time is displayed instantly.</li>
          <li>
            Click <strong>Copy</strong> to copy either the source or converted
            time.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Supports 20+ major time zones worldwide</li>
          <li>Instant live conversion as you change inputs</li>
          <li>Uses the browser Intl API for accurate formatting</li>
          <li>Copy converted time to clipboard</li>
          <li>Works entirely in your browser &mdash; no data is sent to any server</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["uuid-generator", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
