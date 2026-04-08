import type { Metadata } from "next";
import SpinTheWheel from "./spin-the-wheel";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Spin the Wheel Online - Random Picker",
  description:
    "Spin a customizable wheel to pick a random option online for free. Add your own entries, spin, and let the wheel decide. Perfect for games, giveaways, and decisions.",
  alternates: {
    canonical: "https://toolverse.web.id/spin-the-wheel",
  },
};

export default function SpinTheWheelPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Spin the Wheel", description: "Spin a customizable wheel to pick a random option online for free. Add your own entries, spin, and let the wheel decide. Perfect for games, giveaways, and decisions.", url: "https://toolverse.web.id/spin-the-wheel" })} />
      <TrackVisit slug="spin-the-wheel" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Spin the Wheel
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Add your options, spin the wheel, and let it pick a random winner.
        </p>

        <div className="mt-4 sm:mt-6">
          <SpinTheWheel />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Enter your options in the text area, one per line.</li>
            <li>
              Click <strong>Spin!</strong> to spin the wheel.
            </li>
            <li>The wheel spins with a realistic deceleration effect.</li>
            <li>The winning option is displayed after the wheel stops.</li>
            <li>You can add between 2 and 20 options.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Use Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Picking a restaurant for dinner</li>
            <li>Choosing a random winner for giveaways</li>
            <li>Deciding what game to play</li>
            <li>Classroom activities and icebreakers</li>
            <li>Any decision where you want a fun, random outcome</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Cryptographically random selection for fairness</li>
            <li>Smooth spin animation with realistic deceleration</li>
            <li>Color-coded wheel segments for visual clarity</li>
            <li>Works entirely in your browser &mdash; no data is sent to any server</li>
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
