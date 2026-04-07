import JsonLd, { websiteJsonLd } from "@/components/layout/JsonLd";
import ToolGrid from "./tool-grid";

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <section className="mb-8 text-center sm:mb-12">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            <span className="brand-gradient-text">Free Online Tools</span>
          </h1>
          <p className="mt-2 text-base text-zinc-600 sm:mt-3 sm:text-lg dark:text-zinc-400">
            A collection of free online tools including JSON formatter, Base64
            encoder, password generator, QR code tools, and more. Fast, simple,
            and privacy-focused utilities for daily use.
          </p>
        </section>

        <ToolGrid />
      </div>
    </>
  );
}
