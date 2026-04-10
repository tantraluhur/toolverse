import type { Metadata } from "next";
import ImageToPdf from "./image-to-pdf";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Image to PDF Converter Online Free",
  description:
    "Convert multiple JPG and PNG images into a single PDF document online for free. Set page size, orientation, and margins. 100% client-side — your images never leave your browser.",
  alternates: {
    canonical: "https://toolverse.web.id/image-to-pdf",
  },
};

export default function ImageToPdfPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Image to PDF Converter",
          description:
            "Convert multiple JPG and PNG images into a single PDF document online for free. Set page size, orientation, and margins. 100% client-side.",
          url: "https://toolverse.web.id/image-to-pdf",
        })}
      />
      <TrackVisit slug="image-to-pdf" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Image to PDF
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload images, arrange them in order, and convert to a PDF document.
          Your images never leave your browser.
        </p>

        <div className="mt-4 sm:mt-6">
          <ImageToPdf />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Convert Images to PDF
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload your JPG or PNG images by clicking or dragging them in.</li>
            <li>Drag to reorder the images, or use the arrow buttons.</li>
            <li>Choose your page size (A4 or Letter), orientation, and margin.</li>
            <li>
              Select how images fit the page: <strong>Fit</strong> (maintain
              aspect ratio), <strong>Fill</strong> (crop to fill), or{" "}
              <strong>Stretch</strong> (distort to fill).
            </li>
            <li>Click <strong>Convert to PDF</strong> to download.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload multiple JPG and PNG images</li>
            <li>Drag &amp; drop to reorder</li>
            <li>Image thumbnails with dimensions and file size</li>
            <li>Page size: A4 or Letter</li>
            <li>Orientation: portrait or landscape</li>
            <li>Margin control (0 to 72pt)</li>
            <li>Fit, fill, or stretch image to page</li>
            <li>One image per page</li>
            <li>Max 20MB per image</li>
            <li>100% client-side &mdash; images never leave your browser</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["pdf-merge", "pdf-split", "image-resizer"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
