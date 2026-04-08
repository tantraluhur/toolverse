import type { Metadata } from "next";
import NumberBaseConverter from "./number-base-converter";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Number Base Converter - Binary, Octal, Decimal, Hex",
  description:
    "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Live conversion with validation. Free online base converter tool.",
  alternates: {
    canonical: "https://toolverse.web.id/number-base-converter",
  },
};

export default function NumberBaseConverterPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Live conversion with validation. Free online base converter tool.", url: "https://toolverse.web.id/number-base-converter" })} />
      <TrackVisit slug="number-base-converter" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Number Base Converter
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Convert numbers between binary, octal, decimal, and hexadecimal bases in real time.
        </p>

        <div className="mt-4 sm:mt-6">
          <NumberBaseConverter />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Understanding Number Bases
          </h2>
          <p>
            A number base (or radix) determines how many unique digits are used to
            represent numbers. The most common bases in computing are binary (base 2),
            octal (base 8), decimal (base 10), and hexadecimal (base 16). Each base has
            its own use cases in programming, networking, and digital electronics.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Common Number Bases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Binary (Base 2)</strong> &mdash; Uses digits 0 and 1. The
              fundamental language of computers.
            </li>
            <li>
              <strong>Octal (Base 8)</strong> &mdash; Uses digits 0-7. Often used in
              Unix file permissions.
            </li>
            <li>
              <strong>Decimal (Base 10)</strong> &mdash; Uses digits 0-9. The standard
              number system for everyday use.
            </li>
            <li>
              <strong>Hexadecimal (Base 16)</strong> &mdash; Uses digits 0-9 and A-F.
              Widely used for colors, memory addresses, and byte values.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Select the input base from the dropdown.</li>
            <li>Enter a number valid for that base.</li>
            <li>See the converted values in all four bases instantly.</li>
            <li>Click <strong>Copy</strong> next to any result to copy it.</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["hash-generator", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
