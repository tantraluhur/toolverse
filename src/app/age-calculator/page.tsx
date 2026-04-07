import type { Metadata } from "next";
import AgeCalculator from "./age-calculator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Age Calculator - Calculate Your Age Online",
  description:
    "Free online age calculator. Calculate your exact age in years, months, and days instantly. See your next birthday countdown.",
  alternates: {
    canonical: "https://toolverse.app/age-calculator",
  },
};

export default function AgeCalculatorPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Age Calculator",
          description:
            "Free online age calculator. Calculate your exact age in years, months, and days instantly. See your next birthday countdown.",
          url: "https://toolverse.app/age-calculator",
        })}
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Age Calculator
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Enter your date of birth to calculate your exact age in years, months,
          and days.
        </p>

        <div className="mt-4 sm:mt-6">
          <AgeCalculator />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is an Age Calculator?
          </h2>
          <p>
            An age calculator determines your exact age based on your date of
            birth and the current date. It breaks down your age into years,
            months, and days for a precise result. This is useful for filling out
            forms, planning milestones, or simply satisfying your curiosity about
            how many days you have been alive.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How Does It Work?
          </h2>
          <p>
            The calculator uses the difference between your date of birth and
            today&apos;s date. It accounts for varying month lengths and leap
            years to produce an accurate result. The total months and total days
            are also computed so you can see your age expressed in different
            units.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Select your date of birth using the date picker.</li>
            <li>Your age is calculated instantly in real time.</li>
            <li>
              View your age in years, months, and days, plus total months and
              total days.
            </li>
            <li>See how many days remain until your next birthday.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Why Use This Tool?
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Quickly determine your exact age for official documents</li>
            <li>Find out how many days old you are</li>
            <li>Count down to your next birthday</li>
            <li>No sign-up required &mdash; works instantly in your browser</li>
            <li>Accurate calculation including leap year handling</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Exact age in years, months, and days</li>
            <li>Total months and total days alive</li>
            <li>Next birthday countdown</li>
            <li>Handles leap years and varying month lengths</li>
            <li>Prevents future dates from being selected</li>
            <li>
              Works entirely in your browser &mdash; no data is sent to any
              server
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["timezone-converter", "random-name-picker"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
