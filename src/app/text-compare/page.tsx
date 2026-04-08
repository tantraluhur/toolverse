import type { Metadata } from "next";
import TextCompare from "./text-compare";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Text Compare - Diff Checker Online",
  description:
    "Compare two texts side by side and see the differences highlighted online for free. Line-by-line diff checker for code, documents, and more. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.web.id/text-compare",
  },
};

export default function TextComparePage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Text Compare (Diff Checker)",
          description:
            "Compare two texts side by side and see the differences highlighted online for free. Line-by-line diff checker for code, documents, and more. No sign-up required.",
          url: "https://toolverse.web.id/text-compare",
        })}
      />
      <TrackVisit slug="text-compare" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Text Compare (Diff Checker)
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Paste two texts to compare them side by side. Differences are
          highlighted line by line.
        </p>

        <div className="mt-4 sm:mt-6">
          <TextCompare />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What is a Diff Checker?
          </h2>
          <p>
            A diff checker compares two blocks of text and highlights the
            differences between them. It shows which lines were added, removed,
            or left unchanged. This is essential for reviewing code changes,
            comparing document versions, or verifying edits.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Paste the original text on the left and the modified text on the
              right.
            </li>
            <li>
              Differences are highlighted automatically as you type &mdash; green
              for added lines, red for removed lines.
            </li>
            <li>
              Use <strong>Swap</strong> to flip the original and modified texts.
            </li>
            <li>
              The stats bar shows counts of added, removed, and unchanged lines.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Use Cases
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Compare two versions of source code</li>
            <li>Review edits in documents or articles</li>
            <li>Verify configuration file changes</li>
            <li>Check translation differences</li>
            <li>Debug API response changes</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Line-by-line diff with color-coded output</li>
            <li>Live comparison as you type</li>
            <li>Stats showing added, removed, and unchanged line counts</li>
            <li>Swap button to quickly reverse the comparison</li>
            <li>
              Works entirely in your browser &mdash; no data is sent to any
              server
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["json-formatter", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
