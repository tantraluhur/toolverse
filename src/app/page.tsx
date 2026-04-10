import JsonLd, { websiteJsonLd } from "@/components/layout/JsonLd";
import HeroCarousel from "./hero-carousel";
import ToolGrid from "./tool-grid";
import { tools } from "@/lib/tools-registry";

export default function Home() {
  const toolCount = tools.length;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* Hero section */}
      <section className="border-b border-zinc-100 bg-gradient-to-b from-white to-zinc-50/80 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            <span className="brand-gradient-text">{toolCount}+ Free Tools</span>
            <br />
            <span className="text-zinc-900 dark:text-zinc-50">
              Right in Your Browser
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600 sm:mt-4 sm:text-lg dark:text-zinc-400">
            PDF tools, image editors, developer utilities, calculators, and
            more. Fast and simple utilities for daily use.
          </p>

          {/* New tools carousel */}
          <HeroCarousel />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-xs font-medium text-zinc-500 sm:text-sm dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <TrustIcon />
            100% client-side
          </span>
          <span className="flex items-center gap-1.5">
            <TrustIcon />
            No data stored
          </span>
          <span className="flex items-center gap-1.5">
            <TrustIcon />
            No sign-up required
          </span>
          <span className="flex items-center gap-1.5">
            <TrustIcon />
            Free forever
          </span>
        </div>
      </section>

      {/* Tool grid */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <ToolGrid />
      </div>
    </>
  );
}

function TrustIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-emerald-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}
