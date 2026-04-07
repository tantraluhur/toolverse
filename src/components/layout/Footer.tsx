import Link from "next/link";
import { tools } from "@/lib/tools-registry";
import { categoryLabels, type ToolCategory } from "@/types/tool";

export default function Footer() {
  const grouped = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof tools>,
  );

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {/* Tool links grid */}
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {Object.entries(grouped).map(([category, categoryTools]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider brand-gradient-text">
                {categoryLabels[category as ToolCategory]}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {categoryTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${tool.slug}`}
                      className="text-sm text-zinc-600 hover:text-accent-purple dark:text-zinc-400 dark:hover:text-accent-cyan"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500 sm:flex-row sm:justify-between sm:text-left dark:border-zinc-800 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Toolverse. All rights reserved.</p>
          <p>Free online tools &mdash; fast, private, no sign-up required.</p>
        </div>
      </div>
    </footer>
  );
}
