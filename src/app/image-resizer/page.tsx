import type { Metadata } from "next";
import ImageResizer from "./image-resizer";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Image Resizer Online - Resize Images Free",
  description:
    "Resize images to custom dimensions online for free. Set exact width and height, lock aspect ratio, preview, and download. Fast, private, and works entirely in your browser.",
  alternates: {
    canonical: "https://toolverse.app/image-resizer",
  },
};

export default function ImageResizerPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Image Resizer Online", description: "Resize images to custom dimensions online for free. Set exact width and height, lock aspect ratio, preview, and download. Fast, private, and works entirely in your browser.", url: "https://toolverse.app/image-resizer" })} />
      <TrackVisit slug="image-resizer" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Image Resizer
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Upload an image and resize it to custom dimensions. Lock the aspect
        ratio for proportional scaling, preview the result, and download.
      </p>

      <div className="mt-4 sm:mt-6">
        <ImageResizer />
      </div>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Click the upload button to select an image from your device.</li>
          <li>View the original dimensions displayed automatically.</li>
          <li>Enter a new width or height &mdash; with aspect ratio locked, the other dimension updates automatically.</li>
          <li>Click <strong>Resize &amp; Download</strong> to save the resized image.</li>
          <li>Use the <strong>Clear</strong> button to start over with a new image.</li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Resize images to exact pixel dimensions</li>
          <li>Lock aspect ratio for proportional scaling</li>
          <li>Live preview of the resized image</li>
          <li>Supports PNG, JPEG, WebP, and other common formats</li>
          <li>Downloads in the same format as the original image</li>
          <li>Works entirely in your browser &mdash; no images are uploaded to a server</li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Why Resize Images?
        </h2>
        <p>
          Resizing images is essential for optimizing web performance, meeting
          social media dimension requirements, reducing file sizes for email
          attachments, and preparing images for print. This tool lets you set
          precise dimensions while maintaining image quality, all without
          installing any software.
        </p>
      </section>

        <RelatedTools
          slugs={["image-converter", "image-cropper", "color-picker"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
