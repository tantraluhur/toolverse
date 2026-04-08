import type { Metadata } from "next";
import SlugGenerator from "./slug-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Slug Generator - Create URL-Friendly Slugs",
  description:
    "Convert any text into a clean, URL-friendly slug. Supports hyphens and underscores as separators. Live preview with character count. Free online slug generator.",
  alternates: {
    canonical: "https://toolverse.web.id/slug-generator",
  },
};

export default function SlugGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Slug Generator", description: "Convert any text into a clean, URL-friendly slug. Supports hyphens and underscores as separators. Live preview with character count. Free online slug generator.", url: "https://toolverse.web.id/slug-generator" })} />
      <TrackVisit slug="slug-generator" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Slug Generator
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Convert any text into a clean, URL-friendly slug with customizable separator.
        </p>

        <div className="mt-4 sm:mt-6">
          <SlugGenerator />
        </div>

        {/* SEO content section */}
        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            What Is a URL Slug?
          </h2>
          <p>
            A URL slug is the part of a web address that identifies a specific page in a
            human-readable form. For example, in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              example.com/my-blog-post
            </code>
            , the slug is &ldquo;my-blog-post.&rdquo; Good slugs are lowercase,
            use hyphens or underscores as separators, and contain only URL-safe characters.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Why Slugs Matter for SEO
          </h2>
          <p>
            Clean, descriptive slugs help search engines understand your page content and
            improve click-through rates. URLs with readable slugs are more trustworthy to
            users and easier to share on social media. Search engines also use keywords in
            URLs as a ranking signal.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type or paste your text into the input field.</li>
            <li>Choose a separator: hyphen (<code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">-</code>) or underscore (<code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">_</code>).</li>
            <li>The slug is generated instantly as you type.</li>
            <li>Click <strong>Copy</strong> to copy the slug to your clipboard.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Slug Generation Rules
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Converts all characters to lowercase</li>
            <li>Replaces spaces with the chosen separator</li>
            <li>Removes special characters and punctuation</li>
            <li>Collapses multiple consecutive separators into one</li>
            <li>Trims leading and trailing separators</li>
          </ul>
        </section>

        <RelatedTools
          slugs={["url-encoder", "case-converter"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
