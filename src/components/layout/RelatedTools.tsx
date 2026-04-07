import Link from "next/link";
import { tools } from "@/lib/tools-registry";
import type { Tool } from "@/types/tool";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";

interface RelatedToolsProps {
  slugs: string[];
  className?: string;
}

export default function RelatedTools({
  slugs,
  className = "",
}: RelatedToolsProps) {
  const related = slugs.reduce<Tool[]>((acc, slug) => {
    const tool = tools.find((t) => t.slug === slug);
    if (tool) acc.push(tool);
    return acc;
  }, []);

  if (related.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 sm:mb-4 sm:text-xl dark:text-zinc-50">
        Related Tools
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {related.map((tool) => (
          <Link key={tool.slug} href={`/${tool.slug}`}>
            <Card className="h-full hover:border-zinc-400 hover:bg-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900">
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
