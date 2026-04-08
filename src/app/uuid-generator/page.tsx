import type { Metadata } from "next";
import UuidGenerator from "./uuid-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "UUID Generator (v4) Online",
  description:
    "Generate random UUID v4 identifiers online for free. Create one or multiple UUIDs instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.web.id/uuid-generator",
  },
};

export default function UuidGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "UUID Generator (v4)", description: "Generate random UUID v4 identifiers online for free. Create one or multiple UUIDs instantly. No sign-up required.", url: "https://toolverse.web.id/uuid-generator" })} />
      <TrackVisit slug="uuid-generator" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          UUID Generator
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Generate random UUID v4 identifiers. Choose how many to create at once.
      </p>

      <div className="mt-4 sm:mt-6">
        <UuidGenerator />
      </div>

      {/* SEO content section */}
      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          What is a UUID?
        </h2>
        <p>
          A UUID (Universally Unique Identifier) is a 128-bit identifier that is
          guaranteed to be unique across space and time. UUID v4 is generated
          using random or pseudo-random numbers and is the most commonly used
          version. It follows the format{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
            xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
          </code>
          .
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Select how many UUIDs to generate (1&ndash;10) from the dropdown.
          </li>
          <li>
            Click <strong>Generate</strong> to create new UUIDs.
          </li>
          <li>
            Click <strong>Copy</strong> next to any UUID to copy it individually.
          </li>
          <li>
            Use the top <strong>Copy</strong> button to copy all generated UUIDs
            at once.
          </li>
          <li>
            Click <strong>Clear</strong> to reset the list.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Generate 1 to 10 UUID v4 identifiers at once</li>
          <li>Uses the native Web Crypto API for secure randomness</li>
          <li>Copy individual UUIDs or all at once</li>
          <li>Works entirely in your browser &mdash; no data is sent to any server</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["json-formatter", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
