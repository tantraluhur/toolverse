import type { Metadata } from "next";
import TypingTest from "./typing-test";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Typing Speed Test Online - Check Your WPM",
  description:
    "Test your typing speed online for free. See your words per minute (WPM), accuracy, and time. Practice and improve your typing skills with random paragraphs.",
  alternates: {
    canonical: "https://toolverse.app/typing-test",
  },
};

export default function TypingTestPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Typing Speed Test", description: "Test your typing speed online for free. See your words per minute (WPM), accuracy, and time. Practice and improve your typing skills with random paragraphs.", url: "https://toolverse.app/typing-test" })} />
      <TrackVisit slug="typing-test" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Typing Speed Test
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Test how fast and accurately you can type. Start typing to begin the
          timer.
        </p>

        <div className="mt-4 sm:mt-6">
          <TypingTest />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Read the paragraph shown on screen.</li>
            <li>Click the input area and start typing to begin the timer.</li>
            <li>
              Characters you type are highlighted in{" "}
              <strong className="text-green-600">green</strong> if correct and{" "}
              <strong className="text-red-500">red</strong> if incorrect.
            </li>
            <li>The test ends when you finish the paragraph or 60 seconds elapse.</li>
            <li>
              View your <strong>WPM</strong>, <strong>accuracy</strong>, and{" "}
              <strong>time</strong> on the results card.
            </li>
            <li>
              Click <strong>Try Again</strong> to reset with a new paragraph.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How WPM Is Calculated
          </h2>
          <p>
            Words per minute is calculated as the number of correctly typed
            characters divided by 5 (the average word length), then divided by
            the elapsed time in minutes. This is the standard &ldquo;net
            WPM&rdquo; formula used in most typing tests.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Tips to Improve Your Typing Speed
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Focus on accuracy first &mdash; speed follows naturally.</li>
            <li>Keep your eyes on the text, not the keyboard.</li>
            <li>Use all ten fingers and maintain proper hand position.</li>
            <li>Practice regularly with different types of text.</li>
            <li>Take breaks to avoid fatigue.</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["random-name-picker", "coin-flip"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
