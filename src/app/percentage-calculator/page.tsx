import type { Metadata } from "next";
import PercentageCalculator from "./percentage-calculator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Percentage Calculator - Find Percentages Instantly",
  description:
    "Calculate percentages quickly: find X% of Y, what percent X is of Y, or the percentage change between two numbers. Free online percentage calculator.",
  alternates: {
    canonical: "https://toolverse.app/percentage-calculator",
  },
};

export default function PercentageCalculatorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Percentage Calculator", description: "Calculate percentages quickly: find X% of Y, what percent X is of Y, or the percentage change between two numbers. Free online percentage calculator.", url: "https://toolverse.app/percentage-calculator" })} />
      <TrackVisit slug="percentage-calculator" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Percentage Calculator
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Three handy calculators for common percentage operations: find a percentage of
          a number, determine what percent one number is of another, or calculate percentage change.
        </p>

        <div className="mt-4 sm:mt-6">
          <PercentageCalculator />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What Are Percentages?
          </h2>
          <p>
            A percentage is a way of expressing a number as a fraction of 100. The word
            comes from the Latin &ldquo;per centum,&rdquo; meaning &ldquo;by the
            hundred.&rdquo; Percentages are used everywhere &mdash; from discounts and
            taxes to statistics and scientific data.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Three Calculators in One
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>What is X% of Y?</strong> &mdash; Multiply a number by a percentage
              to find a portion. Useful for tips, discounts, and tax calculations.
            </li>
            <li>
              <strong>X is what % of Y?</strong> &mdash; Determine what fraction one
              number is of another. Great for test scores, budgets, and comparisons.
            </li>
            <li>
              <strong>Percentage change from X to Y</strong> &mdash; Calculate the
              increase or decrease between two values. Essential for financial analysis
              and growth tracking.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Enter numbers into the fields of the calculator you need.</li>
            <li>Results appear instantly as you type.</li>
            <li>All calculations are performed locally in your browser.</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["age-calculator", "random-number-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
