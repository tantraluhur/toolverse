import type { Metadata } from "next";
import Base64Encoder from "./base64-encoder";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder Online",
  description:
    "Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to plain text instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/base64-encoder",
  },
};

export default function Base64EncoderPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Base64 Encoder & Decoder", description: "Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to plain text instantly. No sign-up required.", url: "https://toolverse.app/base64-encoder" })} />
      <TrackVisit slug="base64-encoder" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Base64 Encoder & Decoder
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Enter text to encode to Base64, or paste a Base64 string to decode it.
      </p>

      <div className="mt-4 sm:mt-6">
        <Base64Encoder />
      </div>

      {/* SEO content section */}
      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          What is Base64?
        </h2>
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data
          as an ASCII string. It is commonly used to embed images in HTML or CSS,
          transmit data in URLs and APIs, and store complex data in text-based
          formats like JSON or XML.
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Paste your plain text or Base64 string into the input field.</li>
          <li>
            Click <strong>Encode</strong> to convert plain text to Base64.
          </li>
          <li>
            Click <strong>Decode</strong> to convert Base64 back to plain text.
          </li>
          <li>
            If the input is not valid Base64, an error message will appear.
          </li>
          <li>
            Click <strong>Copy</strong> to copy the result to your clipboard.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Encode any text (including Unicode) to Base64</li>
          <li>Decode Base64 strings back to readable text</li>
          <li>Error messages for invalid Base64 input</li>
          <li>Copy result to clipboard with one click</li>
          <li>Works entirely in your browser &mdash; no data is sent to any server</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["json-formatter", "uuid-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
