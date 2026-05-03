import type { Metadata } from "next";
import ImageWatermarker from "./image-watermarker";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Image Watermarker Online - Add Watermark to Photos Free",
  description:
    "Add a text or logo watermark to your images online for free. Customize font, color, opacity, rotation, and position. Drag to place. 100% client-side, no upload to server.",
  alternates: {
    canonical: "https://toolverse.web.id/image-watermarker",
  },
};

export default function ImageWatermarkerPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Image Watermarker Online",
          description:
            "Add a text or logo watermark to your images online for free. Customize font, color, opacity, rotation, and position. Drag to place. 100% client-side.",
          url: "https://toolverse.web.id/image-watermarker",
        })}
      />
      <TrackVisit slug="image-watermarker" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Image Watermarker
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload an image and add a text or logo watermark. Customize font,
          color, opacity, rotation, and position. Drag to place anywhere on the
          canvas.
        </p>

        <div className="mt-4 sm:mt-6">
          <ImageWatermarker />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Why Watermark Images?
          </h2>
          <p>
            Watermarks protect your photos and graphics from unauthorized use,
            reinforce brand identity, and credit the original creator. Whether
            you&apos;re a photographer protecting portfolio work, a designer
            sharing previews, or a brand publishing on social media, a clean
            watermark keeps your content recognizable wherever it travels.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload your base image (JPG, PNG, or WebP).</li>
            <li>
              Choose <strong>Text</strong> or <strong>Image</strong> watermark.
            </li>
            <li>
              For text: enter your text, then tweak font, size, color, opacity,
              and rotation.
            </li>
            <li>
              For image: upload a logo and adjust scale and opacity.
            </li>
            <li>
              Pick a preset corner, drag the watermark anywhere on the canvas,
              or enable <strong>Tile</strong> to repeat across the whole image.
            </li>
            <li>
              Choose PNG or JPG output, set quality if needed, and click{" "}
              <strong>Download</strong>.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Text or image (logo) watermark</li>
            <li>Customize font, size, color, bold, italic</li>
            <li>Opacity and rotation control</li>
            <li>Five preset positions plus free drag-to-place</li>
            <li>Tile mode for repeating watermark across the image</li>
            <li>Safe margin from edges</li>
            <li>Live preview &mdash; everything updates instantly</li>
            <li>Export as PNG or JPG with quality slider</li>
            <li>
              Works entirely in your browser &mdash; no images are uploaded to
              a server
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["image-cropper", "image-resizer", "image-converter"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
