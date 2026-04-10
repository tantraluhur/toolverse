import type { Metadata } from "next";
import PdfToImage from "./pdf-to-image";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "PDF to Image Converter Online Free - PNG & JPG",
  description:
    "Convert PDF pages to high-quality PNG or JPG images online for free. Select pages, choose resolution and format. 100% client-side — your files never leave your browser.",
  alternates: {
    canonical: "https://toolverse.web.id/pdf-to-image",
  },
};

export default function PdfToImagePage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "PDF to Image Converter",
          description:
            "Convert PDF pages to high-quality PNG or JPG images online for free. Select pages, choose resolution and format. 100% client-side.",
          url: "https://toolverse.web.id/pdf-to-image",
        })}
      />
      <TrackVisit slug="pdf-to-image" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          PDF to Image
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload a PDF and convert its pages to PNG or JPG images. Select
          specific pages and choose your quality. Your file never leaves your
          browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <PdfToImage />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Convert PDF to Images
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload your PDF file by clicking or dragging it in.</li>
            <li>Thumbnails of every page are generated automatically.</li>
            <li>Click pages to select or deselect them.</li>
            <li>Choose your output format (PNG or JPG) and resolution.</li>
            <li>Click download &mdash; single pages download directly, multiple pages as a ZIP.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            PNG vs JPG
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>PNG</strong> &mdash; lossless quality, larger files. Best for text-heavy PDFs, screenshots, or when you need transparency.</li>
            <li><strong>JPG</strong> &mdash; smaller files, slight quality loss. Best for photos and general use.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Resolution Options
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Low (1x)</strong> &mdash; fastest, smallest files. Good for quick previews.</li>
            <li><strong>Medium (2x)</strong> &mdash; balanced quality and size. Good for most uses.</li>
            <li><strong>High (3x)</strong> &mdash; highest quality, larger files. Best for printing or zooming.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Visual page thumbnails for easy selection</li>
            <li>Select specific pages or all at once</li>
            <li>PNG and JPG output formats</li>
            <li>3 resolution levels (1x, 2x, 3x)</li>
            <li>Progress bar for multi-page conversions</li>
            <li>Single page downloads directly, multi-page as ZIP</li>
            <li>Max 100MB PDF file size</li>
            <li>100% client-side &mdash; files never leave your browser</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["image-to-pdf", "pdf-merge", "pdf-split"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
