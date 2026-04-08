import type { Metadata } from "next";
import UrlEncoder from "./url-encoder";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder - Encode & Decode URLs Online",
  description:
    "Free online URL encoder and decoder. Encode special characters for URLs or decode percent-encoded strings instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.web.id/url-encoder",
  },
};

export default function UrlEncoderPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "URL Encoder / Decoder", description: "Free online URL encoder and decoder. Encode special characters for URLs or decode percent-encoded strings instantly. No sign-up required.", url: "https://toolverse.web.id/url-encoder" })} />
      <TrackVisit slug="url-encoder" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          URL Encoder / Decoder
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Encode or decode URL components instantly. Paste your text or URL below.
        </p>

        <div className="mt-4 sm:mt-6">
          <UrlEncoder />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is URL Encoding?
          </h2>
          <p>
            URL encoding, also known as percent-encoding, replaces special characters
            in a URL with a percent sign followed by their hexadecimal representation.
            This ensures that URLs are transmitted correctly over the internet, since
            certain characters have special meanings in URLs (such as &amp;, =, and ?).
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Paste your text or URL into the input field.</li>
            <li>Click <strong>Encode</strong> to URL-encode the input using encodeURIComponent.</li>
            <li>Click <strong>Decode</strong> to decode a percent-encoded string back to plain text.</li>
            <li>Click <strong>Copy</strong> to copy the output to your clipboard.</li>
            <li>Click <strong>Clear</strong> to reset both fields.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Encode text using encodeURIComponent</li>
            <li>Decode percent-encoded strings using decodeURIComponent</li>
            <li>Error handling for invalid encoded strings</li>
            <li>Copy result to clipboard with one click</li>
            <li>Works entirely in your browser &mdash; no data is sent to any server</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["base64-encoder", "hash-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
