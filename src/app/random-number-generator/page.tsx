import type { Metadata } from "next";
import RandomNumberGenerator from "./random-number-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Random Number Generator - Cryptographically Secure",
  description:
    "Generate cryptographically secure random numbers with customizable range, count, and integer-only options. Uses crypto.getRandomValues for true randomness.",
  alternates: {
    canonical: "https://toolverse.app/random-number-generator",
  },
};

export default function RandomNumberGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Random Number Generator", description: "Generate cryptographically secure random numbers with customizable range, count, and integer-only options. Uses crypto.getRandomValues for true randomness.", url: "https://toolverse.app/random-number-generator" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Random Number Generator
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Generate cryptographically secure random numbers with custom range and count.
        </p>

        <div className="mt-4 sm:mt-6">
          <RandomNumberGenerator />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            True Randomness in Your Browser
          </h2>
          <p>
            This tool uses the Web Crypto API&apos;s{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              crypto.getRandomValues
            </code>{" "}
            to generate cryptographically secure random numbers. Unlike{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              Math.random()
            </code>
            , which uses a pseudo-random algorithm, this method provides true
            randomness suitable for security-sensitive applications.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Set the <strong>minimum</strong> and <strong>maximum</strong> values for your range.</li>
            <li>Choose how many numbers to generate (1 to 100).</li>
            <li>Toggle <strong>Integer only</strong> to restrict output to whole numbers.</li>
            <li>Click <strong>Generate</strong> to create random numbers.</li>
            <li>Copy individual numbers or all results at once.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Common Use Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Lottery and raffle number generation</li>
            <li>Statistical sampling and simulations</li>
            <li>Game development and dice rolling</li>
            <li>Random selection from a range</li>
            <li>Testing and quality assurance</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["password-generator", "uuid-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
