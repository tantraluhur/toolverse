import type { Metadata } from "next";
import TimestampConverter from "./timestamp-converter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Timestamp Converter - Unix Timestamp to Date & Date to Timestamp",
  description:
    "Free online timestamp converter. Convert Unix timestamps to human-readable dates and dates to Unix timestamps instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/timestamp-converter",
  },
};

export default function TimestampConverterPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Timestamp Converter", description: "Free online timestamp converter. Convert Unix timestamps to human-readable dates and dates to Unix timestamps instantly. No sign-up required.", url: "https://toolverse.app/timestamp-converter" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Timestamp Converter
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Convert between Unix timestamps and human-readable dates instantly.
        </p>

        <div className="mt-4 sm:mt-6">
          <TimestampConverter />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is a Unix Timestamp?
          </h2>
          <p>
            A Unix timestamp (also known as Epoch time or POSIX time) is the number
            of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC. It
            is widely used in programming, databases, and APIs to represent dates and
            times in a timezone-independent way.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Enter a Unix timestamp to convert it to a human-readable date in both UTC and your local timezone.</li>
            <li>Enter a date and time to convert it to a Unix timestamp in seconds and milliseconds.</li>
            <li>Click <strong>Now</strong> to insert the current Unix timestamp.</li>
            <li>Use the copy buttons to copy any result to your clipboard.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Convert Unix timestamp to human-readable date (UTC and local time)</li>
            <li>Convert date and time to Unix timestamp (seconds and milliseconds)</li>
            <li>One-click &ldquo;Now&rdquo; button for the current timestamp</li>
            <li>Copy results to clipboard</li>
            <li>Works entirely in your browser &mdash; no data is sent to any server</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["timezone-converter", "age-calculator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
