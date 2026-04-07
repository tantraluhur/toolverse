import JsonLd, { websiteJsonLd } from "@/components/layout/JsonLd";
import SmartPaste from "@/components/layout/SmartPaste";
import ToolGrid from "./tool-grid";
import { tools } from "@/lib/tools-registry";

export default function Home() {
  const toolCount = tools.length;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* Hero section */}
      <section className="border-b border-zinc-100 bg-gradient-to-b from-white to-zinc-50/80 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            <span className="brand-gradient-text">
              The fastest utility belt
            </span>
            <br />
            <span className="text-zinc-900 dark:text-zinc-50">
              on the internet
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600 sm:mt-4 sm:text-lg dark:text-zinc-400">
            A collection of free online tools including JSON formatter, Base64
            encoder, password generator, QR code tools, and more. Fast, simple,
            and privacy-focused utilities for daily use.
          </p>

          {/* Smart paste */}
          <SmartPaste />

          {/* Quick-access buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8">
            {[
              { name: "JSON Formatter", slug: "json-formatter", icon: "{ }" },
              { name: "QR Generator", slug: "qr-code-generator", icon: "QR" },
              { name: "Password Gen", slug: "password-generator", icon: "***" },
              { name: "Image Resizer", slug: "image-resizer", icon: "Rs" },
              { name: "Word Counter", slug: "word-counter", icon: "Wc" },
            ].map((tool) => (
              <a
                key={tool.slug}
                href={`/${tool.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-purple/40 hover:shadow-md hover:shadow-accent-purple/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-accent-purple/30"
              >
                <span className="text-xs font-bold text-accent-purple dark:text-accent-cyan">
                  {tool.icon}
                </span>
                {tool.name}
              </a>
            ))}
          </div>
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

      {/* Tool grid with search + filters + recently used */}
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
