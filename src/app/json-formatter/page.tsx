import type { Metadata } from "next";
import JsonFormatter from "./json-formatter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Pretty Print JSON Online",
  description:
    "Free online JSON formatter and validator. Pretty-print, minify, and validate your JSON data instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/json-formatter",
  },
};

export default function JsonFormatterPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "JSON Formatter & Validator", description: "Free online JSON formatter and validator. Pretty-print, minify, and validate your JSON data instantly. No sign-up required.", url: "https://toolverse.app/json-formatter" })} />
      <TrackVisit slug="json-formatter" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          JSON Formatter & Validator
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Paste your JSON below to format, validate, or minify it instantly.
      </p>

      <div className="mt-4 sm:mt-6">
        <JsonFormatter />
      </div>

      {/* SEO content section */}
      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          What is JSON?
        </h2>
        <p>
          JSON (JavaScript Object Notation) is a lightweight data-interchange
          format that is easy for humans to read and write, and easy for machines
          to parse and generate. It is widely used in web APIs, configuration
          files, and data storage.
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Paste your raw JSON into the input field.</li>
          <li>
            Click <strong>Format</strong> to pretty-print with indentation.
          </li>
          <li>
            Click <strong>Minify</strong> to compress into a single line.
          </li>
          <li>
            If the JSON is invalid, an error message will show what went wrong.
          </li>
          <li>
            Click <strong>Copy</strong> to copy the result to your clipboard.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Pretty-print JSON with 2-space indentation</li>
          <li>Minify JSON to reduce size</li>
          <li>Validate JSON and display syntax errors</li>
          <li>Copy formatted output to clipboard</li>
          <li>Works entirely in your browser &mdash; no data is sent to any server</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["base64-encoder", "uuid-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
