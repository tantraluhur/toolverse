import type { Metadata } from "next";
import ExcelToPdf from "./excel-to-pdf";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Excel to PDF Converter Online - Free XLSX to PDF",
  description:
    "Convert Excel (.xlsx, .xls) spreadsheets to clean PDF documents online for free. Pick sheet, page size, orientation, margins, fit-to-page, custom range. 100% client-side.",
  alternates: {
    canonical: "https://toolverse.web.id/excel-to-pdf",
  },
};

export default function ExcelToPdfPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Excel to PDF Converter Online",
          description:
            "Convert Excel (.xlsx, .xls) spreadsheets to clean PDF documents online for free. Page size, orientation, margins, fit-to-page, custom range. 100% client-side.",
          url: "https://toolverse.web.id/excel-to-pdf",
        })}
      />
      <TrackVisit slug="excel-to-pdf" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Excel to PDF
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Convert Excel spreadsheets into clean, readable PDFs. Pick a sheet or
          export them all, choose page size and orientation, then download.
          Everything runs in your browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <ExcelToPdf />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What This Tool Does
          </h2>
          <p>
            Spreadsheets are perfect for crunching numbers, but PDFs are the
            standard for sharing reports, invoices, and class handouts. This
            tool reads your Excel file in the browser and lays out the data as a
            clean table inside a PDF &mdash; no plugins, no upload to a server.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How It Works
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Upload an <code>.xlsx</code> or <code>.xls</code> file (drag &
              drop or click).
            </li>
            <li>
              Pick the sheet you want, or export <em>All Sheets</em> as one
              multi-page PDF.
            </li>
            <li>
              Choose A4 or Letter, portrait or landscape, and adjust margins.
            </li>
            <li>
              Optionally enter a cell range like <code>A1:E50</code> to export
              just that region.
            </li>
            <li>
              Click <strong>Download PDF</strong> and you&apos;re done.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Formatting Notes
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              The first row is rendered as a tinted header for readability.
            </li>
            <li>
              All cells get clean borders, with number columns right-aligned.
            </li>
            <li>
              <strong>Fit to page</strong> shrinks wide tables so every column
              fits the page width.
            </li>
            <li>
              Source cell colors and complex formatting are not preserved
              &mdash; export targets clean, readable tables for office and
              school use.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Drag-and-drop upload</li>
            <li>Multi-sheet preview with selector</li>
            <li>Page size (A4 / Letter) and orientation (portrait / landscape)</li>
            <li>Custom margins</li>
            <li>Fit-to-page width</li>
            <li>Cell-range export (e.g. <code>A1:E50</code>)</li>
            <li>100% client-side &mdash; nothing leaves your browser</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["excel-to-json", "excel-to-sql", "pdf-merge"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
