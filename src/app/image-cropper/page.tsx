import type { Metadata } from "next";
import ImageCropper from "./image-cropper";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Image Cropper Online - Crop Images Free",
  description:
    "Crop images online for free. Select a custom region or use preset aspect ratios to crop your photos. Fast, private, and works entirely in your browser.",
  alternates: {
    canonical: "https://toolverse.app/image-cropper",
  },
};

export default function ImageCropperPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Image Cropper Online", description: "Crop images online for free. Select a custom region or use preset aspect ratios to crop your photos. Fast, private, and works entirely in your browser.", url: "https://toolverse.app/image-cropper" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Image Cropper
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload an image and select a crop region using pixel coordinates or
          preset aspect ratios. Download the cropped result instantly.
        </p>

        <div className="mt-4 sm:mt-6">
          <ImageCropper />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Why Crop Images?
          </h2>
          <p>
            Cropping lets you remove unwanted areas from a photo, focus on a
            specific subject, or resize an image to fit a required aspect ratio.
            Whether you need a square profile picture, a 16:9 banner, or a
            custom region for a design project, this tool makes it easy.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Click the upload button to select an image from your device.</li>
            <li>
              Adjust the crop region by entering X, Y, Width, and Height values
              in pixels.
            </li>
            <li>
              Optionally pick a preset aspect ratio (1:1, 4:3, 16:9, or 3:2) to
              lock the proportions.
            </li>
            <li>
              Preview the crop overlay on the image, then click{" "}
              <strong>Crop &amp; Download</strong> to save the result.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Common Use Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Create square thumbnails for social media profiles</li>
            <li>Crop screenshots to highlight a specific area</li>
            <li>Prepare 16:9 images for video thumbnails or banners</li>
            <li>Remove distracting borders or backgrounds from photos</li>
            <li>Resize product images for e-commerce listings</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Pixel-precise crop coordinates</li>
            <li>Preset aspect ratios: 1:1, 4:3, 16:9, 3:2</li>
            <li>Visual crop overlay preview</li>
            <li>Instant download of cropped image as PNG</li>
            <li>
              Works entirely in your browser &mdash; no images are uploaded to a
              server
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["image-resizer", "image-converter", "color-picker"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
