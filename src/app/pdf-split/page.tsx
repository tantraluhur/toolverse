import type { Metadata } from "next";
import PdfSplit from "./pdf-split";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "PDF Split - Extract Pages from PDF Online",
  description:
    "Split a PDF file by page ranges or extract specific pages online for free. Download individually or as a ZIP. 100% client-side — your files never leave your browser.",
  alternates: {
    canonical: "https://toolverse.web.id/pdf-split",
  },
};

export default function PdfSplitPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "PDF Split",
          description:
            "Split a PDF file by page ranges or extract specific pages online for free. Download individually or as a ZIP. 100% client-side.",
          url: "https://toolverse.web.id/pdf-split",
        })}
      />
      <TrackVisit slug="pdf-split" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          PDF Split
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload a PDF and extract specific pages or split it into multiple
          files. Your file never leaves your browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <PdfSplit />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Split a PDF
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload a PDF file by clicking or dragging it into the upload area.</li>
            <li>
              Enter page ranges like <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">1-3, 5, 8-10</code> for
              each split.
            </li>
            <li>Use quick presets to split in half or extract every page.</li>
            <li>Download each split individually or all at once as a ZIP.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Page Range Format
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Single pages: <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">1, 5, 9</code>
            </li>
            <li>
              Page ranges: <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">1-5</code>
            </li>
            <li>
              Mixed: <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">1-3, 5, 8-10</code>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Split by custom page ranges</li>
            <li>Extract individual pages</li>
            <li>Quick presets: split in half, extract every page</li>
            <li>Download each split separately or all as ZIP</li>
            <li>Validates page numbers and ranges</li>
            <li>Shows resolved page list for each range</li>
            <li>Max 100MB per file</li>
            <li>100% client-side &mdash; files never leave your browser</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["pdf-merge", "image-resizer", "image-converter"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
