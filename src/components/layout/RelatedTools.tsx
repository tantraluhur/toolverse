import { tools } from "@/lib/tools-registry";
import type { Tool } from "@/types/tool";
import ToolCard from "@/components/ui/ToolCard";

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <ToolCard
            key={tool.slug}
            name={tool.name}
            slug={tool.slug}
            description={tool.description}
            category={tool.category}
          />
        ))}
      </div>
    </section>
  );
}
