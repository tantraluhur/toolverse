import Link from "next/link";
import { tools } from "@/lib/tools-registry";

export default function NotFound() {
  const popularTools = tools.slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
      <h1 className="text-6xl font-bold">
        <span className="brand-gradient-text">404</span>
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        Page not found. The page you&apos;re looking for doesn&apos;t exist or
        has been moved.
      </p>
      <Link
        href="/"
        className="brand-gradient mt-6 inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Popular Tools
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
