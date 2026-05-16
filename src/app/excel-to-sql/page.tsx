import type { Metadata } from "next";
import ExcelToSql from "./excel-to-sql";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Excel & CSV to SQL INSERT Converter Online - Free",
  description:
    "Convert Excel and CSV rows into SQL INSERT statements for MySQL, PostgreSQL, or SQLite. Type inference, CREATE TABLE generation, batch inserts. 100% client-side.",
  alternates: {
    canonical: "https://toolverse.web.id/excel-to-sql",
  },
};

export default function ExcelToSqlPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Excel & CSV to SQL INSERT Converter",
          description:
            "Convert Excel and CSV rows into SQL INSERT statements for MySQL, PostgreSQL, or SQLite. Type inference, CREATE TABLE, batch inserts. 100% client-side.",
          url: "https://toolverse.web.id/excel-to-sql",
        })}
      />
      <TrackVisit slug="excel-to-sql" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Excel / CSV to SQL INSERT
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Drop a spreadsheet and get clean SQL INSERT statements for MySQL,
          PostgreSQL, or SQLite. Optional CREATE TABLE, type inference, and
          batch inserts. Nothing leaves your browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <ExcelToSql />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What This Tool Does
          </h2>
          <p>
            Quickly turn a CSV export or Excel sheet into ready-to-run SQL.
            Useful for seeding databases, generating fixtures, prototyping a
            schema, or migrating tabular data between systems.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How It Works
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Upload an <code>.xlsx</code>, <code>.xls</code>, or{" "}
              <code>.csv</code> file.
            </li>
            <li>
              Headers from row 1 become column names. Each subsequent row
              becomes one <code>INSERT</code>.
            </li>
            <li>Pick your SQL dialect, table name, and output options.</li>
            <li>
              Identifiers are quoted per dialect (backticks for MySQL, double
              quotes for PostgreSQL / SQLite). Strings are safely escaped.
            </li>
            <li>Copy the SQL or download it as a <code>.sql</code> file.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Type Inference
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Integers</strong> &mdash; columns where every value is a
              whole number
            </li>
            <li>
              <strong>Floats</strong> &mdash; columns with decimal numbers
            </li>
            <li>
              <strong>Booleans</strong> &mdash; <code>true</code> /{" "}
              <code>false</code> only
            </li>
            <li>
              <strong>Dates & timestamps</strong> &mdash; ISO-formatted values
            </li>
            <li>Everything else falls back to <code>TEXT</code> / <code>VARCHAR</code></li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Output Options
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>CREATE TABLE</strong> generation with inferred column
              types
            </li>
            <li>
              <strong>Batch insert</strong> &mdash; many rows per statement
              (faster for big datasets)
            </li>
            <li>
              <strong>INSERT IGNORE</strong> &mdash; dialect-aware: MySQL{" "}
              <code>INSERT IGNORE</code>, PostgreSQL{" "}
              <code>ON CONFLICT DO NOTHING</code>, SQLite{" "}
              <code>INSERT OR IGNORE</code>
            </li>
            <li>
              <strong>Include column names</strong> in each statement (off =
              <em> positional</em> inserts)
            </li>
            <li>Empty cells become <code>NULL</code></li>
          </ul>
        </section>

        <RelatedTools
          slugs={["excel-to-json", "json-formatter", "slug-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
