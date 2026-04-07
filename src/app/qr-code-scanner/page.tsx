import type { Metadata } from "next";
import QrCodeScanner from "./qr-code-scanner";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "QR Code Scanner Online",
  description:
    "Scan and decode QR codes from uploaded images online for free. Upload a screenshot or photo of a QR code to read its content. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/qr-code-scanner",
  },
};

export default function QrCodeScannerPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "QR Code Scanner", description: "Scan and decode QR codes from uploaded images online for free. Upload a screenshot or photo of a QR code to read its content. No sign-up required.", url: "https://toolverse.app/qr-code-scanner" })} />
      <TrackVisit slug="qr-code-scanner" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          QR Code Scanner
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Upload an image containing a QR code to decode its content instantly.
      </p>

      <div className="mt-4 sm:mt-6">
        <QrCodeScanner />
      </div>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Click the upload button and select an image with a QR code.</li>
          <li>The QR code is automatically detected and decoded.</li>
          <li>The decoded content (text or URL) is displayed.</li>
          <li>If the content is a URL, you can click to open it directly.</li>
          <li>
            Click <strong>Copy</strong> to copy the decoded content.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Decode QR codes from screenshots, photos, or saved images</li>
          <li>Automatically detects URLs and makes them clickable</li>
          <li>Image preview alongside decoded content</li>
          <li>Copy decoded content to clipboard</li>
          <li>Works entirely in your browser &mdash; no images are uploaded to a server</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["qr-code-generator", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
