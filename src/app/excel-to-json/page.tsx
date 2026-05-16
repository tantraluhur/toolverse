import type { Metadata } from "next";
import ExcelToJson from "./excel-to-json";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Excel & CSV to JSON Converter Online - Free",
  description:
    "Convert Excel (.xlsx, .xls) and CSV files to JSON online for free. Auto-detect headers, multi-sheet support, type detection, copy or download. 100% client-side.",
  alternates: {
    canonical: "https://toolverse.web.id/excel-to-json",
  },
};

export default function ExcelToJsonPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Excel & CSV to JSON Converter Online",
          description:
            "Convert Excel (.xlsx, .xls) and CSV files to JSON online for free. Auto-detect headers, multi-sheet support, type detection. 100% client-side.",
          url: "https://toolverse.web.id/excel-to-json",
        })}
      />
      <TrackVisit slug="excel-to-json" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Excel / CSV to JSON
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Drop an Excel or CSV file and get clean JSON instantly. Headers
          auto-detected, types inferred, multiple sheets supported. Nothing
          leaves your browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <ExcelToJson />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What This Tool Does
          </h2>
          <p>
            Spreadsheet-to-JSON is one of the most common data-wrangling tasks:
            you get a CSV export or an Excel report, and you need it as JSON to
            feed an API, seed a database, or load into a script. This tool runs
            entirely in your browser so your data never gets uploaded to a
            server.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How It Works
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Upload an <code>.xlsx</code>, <code>.xls</code>, or{" "}
              <code>.csv</code> file (drag & drop or click).
            </li>
            <li>
              The first row is treated as the header. Each following row
              becomes one JSON object.
            </li>
            <li>
              For multi-sheet Excel files, pick the sheet from the selector.
            </li>
            <li>Numbers and dates are detected and converted automatically.</li>
            <li>Copy the JSON or download as a <code>.json</code> file.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Output Options
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Pretty</strong> or <strong>minified</strong> formatting
            </li>
            <li>
              <strong>Array</strong> output (default) or one object per line
              (NDJSON)
            </li>
            <li>Empty cells as <code>null</code> or empty string</li>
            <li>
              Automatic type detection &mdash; numbers, booleans, ISO dates
            </li>
            <li>
              Key formatting &mdash; original, camelCase, snake_case, or
              kebab-case
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Common Use Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Seed a database from an export</li>
            <li>Feed a script or REST API</li>
            <li>Compare two spreadsheets as structured data</li>
            <li>Generate test fixtures</li>
            <li>Prototype dashboards or charts from a CSV</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["json-formatter", "slug-generator", "case-converter"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
