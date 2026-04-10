import type { Metadata } from "next";
import PdfMerge from "./pdf-merge";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "PDF Merge - Combine PDF Files Online Free",
  description:
    "Merge multiple PDF files into one document online for free. Drag to reorder, see page counts, and download instantly. 100% client-side — your files never leave your browser.",
  alternates: {
    canonical: "https://toolverse.web.id/pdf-merge",
  },
};

export default function PdfMergePage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "PDF Merge",
          description:
            "Merge multiple PDF files into one document online for free. Drag to reorder, see page counts, and download instantly. 100% client-side.",
          url: "https://toolverse.web.id/pdf-merge",
        })}
      />
      <TrackVisit slug="pdf-merge" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          PDF Merge
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload multiple PDF files, reorder them, and merge into a single
          document. Your files never leave your browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <PdfMerge />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Merge PDF Files
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Click the upload area or drag &amp; drop your PDF files into it.
            </li>
            <li>Rearrange the order by dragging files or using the arrow buttons.</li>
            <li>Remove any files you don&apos;t need with the X button.</li>
            <li>
              Click <strong>Merge</strong> to combine all PDFs into one file.
            </li>
            <li>The merged PDF downloads automatically.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Why Use This Tool?
          </h2>
          <p>
            Combining PDF files is a common task for contracts, reports,
            applications, and portfolios. Most online PDF mergers upload your
            files to their servers. Toolverse&apos;s PDF Merge runs entirely in your
            browser using the pdf-lib library &mdash; your files are never
            uploaded anywhere.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload multiple PDF files at once</li>
            <li>Drag &amp; drop or click to browse</li>
            <li>Reorder files by dragging or arrow buttons</li>
            <li>See page count and file size for each PDF</li>
            <li>Remove individual files before merging</li>
            <li>Total page count and size summary</li>
            <li>Max 50MB per file</li>
            <li>
              100% client-side &mdash; files never leave your browser
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["image-resizer", "image-converter", "qr-code-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
