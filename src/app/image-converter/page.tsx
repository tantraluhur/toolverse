import type { Metadata } from "next";
import ImageConverter from "./image-converter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Image Format Converter Online - PNG, JPG, WebP",
  description:
    "Convert images between PNG, JPG, and WebP formats online for free. Adjust JPEG quality, preview before downloading, and see file size changes. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/image-converter",
  },
};

export default function ImageConverterPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Image Format Converter Online - PNG, JPG, WebP",
          description:
            "Convert images between PNG, JPG, and WebP formats online for free. Adjust JPEG quality, preview before downloading, and see file size changes. No sign-up required.",
          url: "https://toolverse.app/image-converter",
        })}
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Image Format Converter
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Convert images between PNG, JPEG, and WebP formats instantly in your
          browser. Adjust quality settings and preview the result before
          downloading.
        </p>

        <div className="mt-4 sm:mt-6">
          <ImageConverter />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            PNG vs JPG vs WebP &mdash; Which Format Should You Use?
          </h2>
          <p>
            Choosing the right image format depends on your use case. Each format
            has strengths that make it ideal for different scenarios.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>PNG</strong> &mdash; Lossless compression, supports
              transparency. Best for logos, icons, screenshots, and graphics with
              sharp edges or text.
            </li>
            <li>
              <strong>JPEG (JPG)</strong> &mdash; Lossy compression with
              adjustable quality. Best for photographs and complex images where
              small artifacts are acceptable in exchange for much smaller file
              sizes.
            </li>
            <li>
              <strong>WebP</strong> &mdash; Modern format by Google that supports
              both lossy and lossless compression, plus transparency. Produces
              smaller files than PNG and JPEG at comparable quality. Supported by
              all modern browsers.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            When to Use Each Format
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Use <strong>PNG</strong> when you need transparency or pixel-perfect
              reproduction of graphics, diagrams, or text overlays.
            </li>
            <li>
              Use <strong>JPEG</strong> when sharing photos via email, uploading
              to platforms that don&rsquo;t accept WebP, or when maximum
              compatibility matters.
            </li>
            <li>
              Use <strong>WebP</strong> for web pages and apps where you want the
              smallest file size with good visual quality. Ideal for improving
              page load speed.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How This Tool Works
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload any image from your device.</li>
            <li>Select your desired output format (PNG, JPEG, or WebP).</li>
            <li>For JPEG, adjust the quality slider to balance size and clarity.</li>
            <li>
              Click <strong>Convert &amp; Download</strong> to save the converted
              image.
            </li>
            <li>
              Everything runs in your browser &mdash; no images are uploaded to
              any server.
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["image-resizer", "image-cropper", "color-picker"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
