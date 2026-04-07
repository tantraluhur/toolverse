import Link from "next/link";
import { categoryLabels, type ToolCategory } from "@/types/tool";

interface ToolCardProps {
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  badge?: "new" | "popular";
}

const badgeStyles = {
  new: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  popular: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
};

const badgeLabels = {
  new: "New",
  popular: "Popular",
};

const categoryBadgeColors: Record<ToolCategory, string> = {
  dev: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  security:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  media:
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  utility:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export default function ToolCard({
  name,
  slug,
  description,
  category,
  badge,
}: ToolCardProps) {
  return (
    <Link href={`/${slug}`} className="group block h-full">
      {/* Outer wrapper for gradient top border */}
      <div className="h-full overflow-hidden rounded-xl bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-purple/20 p-px transition-all duration-200 group-hover:-translate-y-0.5 group-hover:from-accent-cyan group-hover:via-accent-purple group-hover:to-accent-purple group-hover:shadow-md group-hover:shadow-accent-purple/10 dark:from-accent-cyan/10 dark:via-accent-purple/10 dark:to-accent-purple/10 dark:group-hover:from-accent-cyan/70 dark:group-hover:via-accent-purple/70 dark:group-hover:to-accent-purple/70 dark:group-hover:shadow-lg dark:group-hover:shadow-accent-purple/5">
      <div className="relative flex h-full flex-col rounded-[11px] bg-white p-5 sm:p-6 dark:bg-zinc-900">
        {/* Badge */}
        {badge && (
          <span
            className={`absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyles[badge]}`}
          >
            {badgeLabels[badge]}
          </span>
        )}

        {/* Category label */}
        <span
          className={`mb-3 inline-block w-fit rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${categoryBadgeColors[category]}`}
        >
          {categoryLabels[category]}
        </span>

        {/* Tool name */}
        <h3 className="text-base font-semibold text-zinc-900 group-hover:text-accent-purple dark:text-zinc-50 dark:group-hover:text-accent-cyan">
          {name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="mt-3 flex items-center text-xs font-medium text-zinc-400 transition-colors group-hover:text-accent-purple dark:text-zinc-600 dark:group-hover:text-accent-cyan">
          Open tool
          <svg
            className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L11.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l3.158-2.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      </div>
    </Link>
  );
}
