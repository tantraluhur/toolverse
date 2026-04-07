import type { Metadata } from "next";
import CaseConverter from "./case-converter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Case Converter - Transform Text Case Online",
  description:
    "Free online case converter. Transform text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/case-converter",
  },
};

export default function CaseConverterPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Case Converter", description: "Free online case converter. Transform text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more instantly. No sign-up required.", url: "https://toolverse.app/case-converter" })} />
      <TrackVisit slug="case-converter" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Case Converter
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Type or paste your text and click a button to convert it to any case format.
        </p>

        <div className="mt-4 sm:mt-6">
          <CaseConverter />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is a Case Converter?
          </h2>
          <p>
            A case converter is a tool that transforms text between different
            capitalization and naming conventions. It is commonly used by writers,
            developers, and content creators who need to quickly reformat text for
            code variables, headings, file names, or stylistic purposes.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Supported Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>UPPERCASE</strong> &mdash; converts all letters to upper case</li>
            <li><strong>lowercase</strong> &mdash; converts all letters to lower case</li>
            <li><strong>Title Case</strong> &mdash; capitalizes the first letter of each word</li>
            <li><strong>Sentence case</strong> &mdash; capitalizes only the first letter of each sentence</li>
            <li><strong>camelCase</strong> &mdash; joins words with first word lowercase and subsequent words capitalized</li>
            <li><strong>PascalCase</strong> &mdash; joins words with each word capitalized</li>
            <li><strong>snake_case</strong> &mdash; joins words with underscores, all lowercase</li>
            <li><strong>kebab-case</strong> &mdash; joins words with hyphens, all lowercase</li>
            <li><strong>CONSTANT_CASE</strong> &mdash; joins words with underscores, all uppercase</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Nine different case conversion options</li>
            <li>One-click copy to clipboard</li>
            <li>Works entirely in your browser &mdash; no data is sent to any server</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["word-counter", "slug-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
