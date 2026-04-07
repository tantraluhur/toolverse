import type { Metadata } from "next";
import LoremIpsumGenerator from "./lorem-ipsum-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text Online",
  description:
    "Free online Lorem Ipsum generator. Generate placeholder paragraphs, sentences, or words for your designs and mockups instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/lorem-ipsum-generator",
  },
};

export default function LoremIpsumGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Lorem Ipsum Generator", description: "Free online Lorem Ipsum generator. Generate placeholder paragraphs, sentences, or words for your designs and mockups instantly. No sign-up required.", url: "https://toolverse.app/lorem-ipsum-generator" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Lorem Ipsum Generator
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Generate placeholder text for your designs, mockups, and layouts.
        </p>

        <div className="mt-4 sm:mt-6">
          <LoremIpsumGenerator />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is Lorem Ipsum?
          </h2>
          <p>
            Lorem Ipsum is dummy text that has been used by the printing and
            typesetting industry since the 1500s. It is derived from a section of
            &ldquo;De Finibus Bonorum et Malorum&rdquo; by Cicero, written in 45 BC.
            Designers and developers use it as placeholder text to demonstrate the
            visual layout of a document or website without relying on meaningful content.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Choose the type of output: paragraphs, sentences, or words.</li>
            <li>Set the number you want to generate (1&ndash;20).</li>
            <li>Click <strong>Generate</strong> to create the placeholder text.</li>
            <li>Click <strong>Copy</strong> to copy the result to your clipboard.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Generate paragraphs, sentences, or words</li>
            <li>Adjustable count from 1 to 20</li>
            <li>Classic Lorem Ipsum text with randomized sentences</li>
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
