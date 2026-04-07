import type { Metadata } from "next";
import CoinFlip from "./coin-flip";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Coin Flip Online - Heads or Tails",
  description:
    "Flip a coin online for free. Get a fair, random heads or tails result instantly. Track your flip history and stats. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/coin-flip",
  },
};

export default function CoinFlipPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Coin Flip", description: "Flip a coin online for free. Get a fair, random heads or tails result instantly. Track your flip history and stats. No sign-up required.", url: "https://toolverse.app/coin-flip" })} />
      <TrackVisit slug="coin-flip" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Coin Flip
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Flip a virtual coin to get a fair heads or tails result. Track your
          history and stats.
        </p>

        <div className="mt-4 sm:mt-6">
          <CoinFlip />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Click the <strong>Flip</strong> button to toss the coin.
            </li>
            <li>The coin spins and lands on either Heads or Tails.</li>
            <li>Your last 10 flips are shown as a history strip.</li>
            <li>View running stats: total flips, heads count, tails count, and heads percentage.</li>
            <li>
              Click <strong>Reset</strong> to clear all history and stats.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Is It Fair?
          </h2>
          <p>
            Yes. This tool uses <code>crypto.getRandomValues</code>, the same
            cryptographic random number generator used in security applications.
            Each flip has an exactly equal 50/50 chance of landing on heads or
            tails.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Use Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Settling debates and making quick decisions</li>
            <li>Choosing who goes first in a game</li>
            <li>Teaching probability and statistics</li>
            <li>Any situation that calls for a 50/50 random outcome</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["spin-the-wheel", "random-name-picker"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
