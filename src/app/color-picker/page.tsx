import type { Metadata } from "next";
import ColorPicker from "./color-picker";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Color Picker from Image Online",
  description:
    "Pick any color from an uploaded image online for free. Get HEX, RGB, and HSL color values instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/color-picker",
  },
};

export default function ColorPickerPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Color Picker from Image", description: "Pick any color from an uploaded image online for free. Get HEX, RGB, and HSL color values instantly. No sign-up required.", url: "https://toolverse.app/color-picker" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Color Picker from Image
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Upload an image and click anywhere on it to pick a color. Get HEX, RGB,
        and HSL values.
      </p>

      <div className="mt-4 sm:mt-6">
        <ColorPicker />
      </div>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Click the upload button to select an image from your device.</li>
          <li>Click anywhere on the image to pick a color at that pixel.</li>
          <li>The color preview and HEX, RGB, and HSL values will appear.</li>
          <li>
            Click <strong>Copy</strong> next to any value to copy it.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Pick colors from any uploaded image</li>
          <li>Get HEX, RGB, and HSL values</li>
          <li>Live color preview swatch</li>
          <li>Copy any color value with one click</li>
          <li>Works entirely in your browser &mdash; no images are uploaded to a server</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["qr-code-generator", "qr-code-scanner"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
