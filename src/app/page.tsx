import { tools } from "@/lib/tools-registry";
import { categoryLabels, type ToolCategory } from "@/types/tool";
import ToolCard from "@/components/ui/ToolCard";
import JsonLd, { websiteJsonLd } from "@/components/layout/JsonLd";

// Mark specific tools with badges
const badges: Record<string, "new" | "popular"> = {
  "json-formatter": "popular",
  "password-generator": "popular",
  "qr-code-generator": "popular",
  "age-calculator": "new",
  "text-compare": "new",
};

export default function Home() {
  const grouped = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof tools>,
  );

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
            and privacy-focused utilities for developers and everyone.
          </p>
        </section>

        {Object.entries(grouped).map(([category, categoryTools]) => (
          <section key={category} className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-semibold text-zinc-800 sm:mb-4 sm:text-xl dark:text-zinc-200">
              {categoryLabels[category as ToolCategory]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  name={tool.name}
                  slug={tool.slug}
                  description={tool.description}
                  category={tool.category}
                  badge={badges[tool.slug]}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
