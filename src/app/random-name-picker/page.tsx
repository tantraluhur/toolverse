import type { Metadata } from "next";
import RandomNamePicker from "./random-name-picker";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Random Name Picker Online",
  description:
    "Pick a random name from a list online for free. Perfect for giveaways, raffles, team assignments, and random decisions. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/random-name-picker",
  },
};

export default function RandomNamePickerPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Random Name Picker", description: "Pick a random name from a list online for free. Perfect for giveaways, raffles, team assignments, and random decisions. No sign-up required.", url: "https://toolverse.app/random-name-picker" })} />
      <TrackVisit slug="random-name-picker" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Random Name Picker
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Enter a list of names and pick one at random. Perfect for giveaways,
        raffles, and team assignments.
      </p>

      <div className="mt-4 sm:mt-6">
        <RandomNamePicker />
      </div>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Enter names into the text area, one name per line.</li>
          <li>
            Click <strong>Pick Random Name</strong> to select a winner.
          </li>
          <li>The randomly selected name is displayed prominently.</li>
          <li>
            Click <strong>Copy</strong> to copy the winner&apos;s name.
          </li>
          <li>Click the button again to pick a different name.</li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Use Cases
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Giveaways and contest winners</li>
          <li>Classroom or team random selection</li>
          <li>Raffle draws</li>
          <li>Deciding who goes first</li>
          <li>Any fair random selection from a list</li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Cryptographically secure random selection</li>
          <li>Handles any number of entries</li>
          <li>Shows entry count in real time</li>
          <li>Copy winner to clipboard</li>
          <li>Works entirely in your browser &mdash; no data is sent to any server</li>
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
