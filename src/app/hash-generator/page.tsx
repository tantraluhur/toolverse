import type { Metadata } from "next";
import HashGenerator from "./hash-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Hash Generator - SHA-1, SHA-256, SHA-512 Online",
  description:
    "Generate SHA-1, SHA-256, and SHA-512 hashes from any text instantly. Uses the Web Crypto API for accurate, browser-based hashing. Free, fast, and private.",
  alternates: {
    canonical: "https://toolverse.app/hash-generator",
  },
};

export default function HashGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Hash Generator", description: "Generate SHA-1, SHA-256, and SHA-512 hashes from any text instantly. Uses the Web Crypto API for accurate, browser-based hashing. Free, fast, and private.", url: "https://toolverse.app/hash-generator" })} />
      <TrackVisit slug="hash-generator" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Hash Generator
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Generate cryptographic hashes from text using SHA-1, SHA-256, and SHA-512 algorithms.
        </p>

        <div className="mt-4 sm:mt-6">
          <HashGenerator />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What Is a Hash Function?
          </h2>
          <p>
            A cryptographic hash function takes an input of any length and produces a
            fixed-size string of characters. The output, called a hash or digest, is
            unique to the input data. Even a tiny change in input produces a completely
            different hash, making it useful for data integrity verification, digital
            signatures, and password storage.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Supported Algorithms
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>SHA-1</strong> &mdash; 160-bit hash, commonly used for checksums
              but considered weak for security purposes.
            </li>
            <li>
              <strong>SHA-256</strong> &mdash; 256-bit hash from the SHA-2 family,
              widely used in security applications and blockchain.
            </li>
            <li>
              <strong>SHA-512</strong> &mdash; 512-bit hash from the SHA-2 family,
              offering higher security with a longer digest.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type or paste your text into the input area.</li>
            <li>All hash values are calculated automatically as you type.</li>
            <li>Click <strong>Copy</strong> next to any hash to copy it to your clipboard.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Privacy &amp; Security
          </h2>
          <p>
            All hashing is performed entirely in your browser using the Web Crypto API.
            Your data is never sent to any server, ensuring complete privacy.
          </p>
        </section>

        <RelatedTools
          slugs={["password-generator", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
