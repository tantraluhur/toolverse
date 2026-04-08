import type { Metadata } from "next";
import WordCounter from "./word-counter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Word Counter - Count Words, Characters & Sentences Online",
  description:
    "Free online word counter tool. Count words, characters, sentences, paragraphs, and estimate reading time instantly. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.web.id/word-counter",
  },
};

export default function WordCounterPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Word Counter", description: "Free online word counter tool. Count words, characters, sentences, paragraphs, and estimate reading time instantly. No sign-up required.", url: "https://toolverse.web.id/word-counter" })} />
      <TrackVisit slug="word-counter" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Word Counter
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Paste or type your text below to count words, characters, sentences, and more in real time.
        </p>

        <div className="mt-4 sm:mt-6">
          <WordCounter />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is a Word Counter?
          </h2>
          <p>
            A word counter is a tool that analyzes your text and provides statistics
            such as the total number of words, characters, sentences, and paragraphs.
            It is useful for writers, students, and professionals who need to meet
            specific word count requirements for essays, articles, or social media posts.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type or paste your text into the text area.</li>
            <li>Statistics update instantly as you type.</li>
            <li>View word count, character count (with and without spaces), sentences, paragraphs, and estimated reading time.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Real-time word and character counting</li>
            <li>Character count with and without spaces</li>
            <li>Sentence and paragraph detection</li>
            <li>Estimated reading time based on 200 words per minute</li>
            <li>Works entirely in your browser &mdash; no data is sent to any server</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["case-converter", "text-compare"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
