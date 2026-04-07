import type { Metadata } from "next";
import QrCodeGenerator from "./qr-code-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "QR Code Generator Online",
  description:
    "Generate QR codes from text or URLs online for free. Live preview and download as PNG. Fast, private, and works entirely in your browser.",
  alternates: {
    canonical: "https://toolverse.app/qr-code-generator",
  },
};

export default function QrCodeGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "QR Code Generator", description: "Generate QR codes from text or URLs online for free. Live preview and download as PNG. Fast, private, and works entirely in your browser.", url: "https://toolverse.app/qr-code-generator" })} />
      <TrackVisit slug="qr-code-generator" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          QR Code Generator
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Enter text or a URL to generate a QR code with a live preview. Download
        as PNG.
      </p>

      <div className="mt-4 sm:mt-6">
        <QrCodeGenerator />
      </div>

      {/* SEO content section */}
      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          What is a QR Code?
        </h2>
        <p>
          A QR (Quick Response) code is a two-dimensional barcode that can store
          text, URLs, contact information, and more. It can be scanned by
          smartphone cameras and QR reader apps to quickly access the encoded
          content. QR codes are widely used in marketing, payments, ticketing,
          and product packaging.
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Type or paste text or a URL into the input field.</li>
          <li>The QR code updates automatically as you type (live preview).</li>
          <li>
            Click <strong>Download PNG</strong> to save the QR code as an image
            file.
          </li>
          <li>
            Click <strong>Clear</strong> to reset the input and QR code.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Live QR code preview as you type</li>
          <li>Download QR code as PNG image</li>
          <li>Supports text, URLs, and any UTF-8 content</li>
          <li>Clean, high-contrast black and white output</li>
          <li>
            Works entirely in your browser &mdash; no data is sent to any server
          </li>
        </ul>
      </section>

        <RelatedTools
          slugs={["url-encoder", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
