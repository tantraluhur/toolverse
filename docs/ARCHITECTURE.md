# Toolverse Architecture

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Package Manager:** Yarn
- **Hosting:** Vercel

## Folder Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar + Footer)
│   ├── page.tsx                # Homepage (lists all tools)
│   ├── globals.css             # Global styles & Tailwind imports
│   └── [tool-slug]/            # Each tool gets its own route folder
│       ├── page.tsx            # Server component: SEO metadata + page shell
│       └── [tool-name].tsx     # Client component: interactive tool logic
│
├── components/
│   ├── layout/                 # Shared layout components
│   │   ├── Navbar.tsx          # Sticky header with tools dropdown (reads from registry)
│   │   ├── Footer.tsx
│   │   └── RelatedTools.tsx    # Reusable related tools section (takes slugs[])
│   └── ui/                     # Reusable UI primitives
│       ├── Alert.tsx           # Alert banner (error/success/warning/info)
│       ├── Button.tsx          # Button with variants (primary/secondary/outline/danger) and sizes (sm/md/lg)
│       ├── Card.tsx            # Card container + CardTitle + CardDescription
│       ├── CopyButton.tsx      # Copy-to-clipboard button (wraps Button)
│       ├── Dropdown.tsx        # Select dropdown with label + options
│       ├── Input.tsx           # Text input with optional label
│       ├── Label.tsx           # Form label
│       └── Textarea.tsx        # Textarea with optional label
│
├── lib/                        # Utilities & data
│   └── tools-registry.ts      # Central registry of all tools
│
└── types/                      # TypeScript type definitions
    └── tool.ts                 # Tool & ToolCategory types

docs/                           # Project documentation
├── CLAUDE.md                   # Product context & strategy
└── ARCHITECTURE.md             # This file
```

## Key Conventions

### Adding a New Tool

1. **Register** the tool in `src/lib/tools-registry.ts` — add an entry to the `tools` array.
2. **Create route** at `src/app/[tool-slug]/page.tsx` — this is a **server component** that exports `metadata` for SEO and renders the tool component.
3. **Create tool component** at `src/app/[tool-slug]/[tool-name].tsx` — this is a `"use client"` component with all interactive logic.
4. **Add `<RelatedTools>`** at the bottom of the page with slugs of related tools for internal linking.
5. The homepage auto-generates tool cards from the registry.

### SEO Pattern

Every tool page must:
- Export `metadata` with a keyword-focused `title` and `description`
- Export `metadata.alternates.canonical` pointing to `https://toolverse.app/{slug}`
- Have an `<h1>` with the primary keyword
- Include `<JsonLd data={toolJsonLd({...})} />` for structured data (WebApplication schema)
- Include a content section below the tool explaining what it does (for crawlers)
- Include a `<RelatedTools slugs={[...]} />` section at the bottom for internal linking
- Use a clean URL slug (e.g. `/json-formatter`, `/base64-encoder`)

### SEO Infrastructure

- **sitemap.xml** — `src/app/sitemap.ts` auto-generates from tools registry
- **robots.txt** — `src/app/robots.ts` allows all crawlers, references sitemap
- **JSON-LD** — `src/components/layout/JsonLd.tsx` provides `toolJsonLd()` and `websiteJsonLd()` helpers
- **Root metadata** — `metadataBase`, Open Graph, Twitter Card, googleBot directives in `layout.tsx`
- **Footer** — sitewide tool links grouped by category for internal linking
- **404 page** — `src/app/not-found.tsx` with links to popular tools

### Component Organization

- **Server components** (default): page shells, layouts, SEO metadata
- **Client components** (`"use client"`): interactive tool UIs, buttons with state
- Keep client boundaries as small as possible for performance

### UI Component Library

All reusable UI primitives live in `src/components/ui/`. When building tool UIs, always use these instead of raw HTML elements:

| Component | Props | Usage |
|-----------|-------|-------|
| `Button` | `variant` (`primary`/`secondary`/`outline`/`danger`), `size` (`sm`/`md`/`lg`) | All clickable actions |
| `Input` | `label?`, standard input props | Single-line text input |
| `Textarea` | `label?`, standard textarea props | Multi-line text input |
| `Dropdown` | `label?`, `options: {label, value}[]`, `placeholder?`, `value?`, `onChange?: (value: string) => void` | Custom select with popover, keyboard nav, check icon (shadcn-style) |
| `ToolCard` | `name`, `slug`, `description`, `category`, `badge?` (`"new"`/`"popular"`) | Tool grid cards (homepage + RelatedTools) — elevated, hover lift, category badge, arrow |
| `Card` | Children-based, composable | Generic content containers |
| `CardTitle` | — | Card heading |
| `CardDescription` | — | Card subtitle text |
| `Alert` | `variant` (`error`/`success`/`warning`/`info`) | Status/feedback messages |
| `CopyButton` | `text: string` | Copy text to clipboard |
| `Label` | Standard label props | Standalone form labels |

### Styling

- Tailwind CSS utility classes only — no custom CSS unless absolutely necessary
- Dark mode via `dark:` variants (system preference via `prefers-color-scheme`)
- Zinc color palette for neutrals
- **Brand colors** (from favicon): cyan `#00d4ff` → purple `#8b5cf6` gradient
  - CSS vars: `--accent-cyan`, `--accent-purple`
  - Tailwind: `accent-cyan`, `accent-purple` (registered via `@theme inline`)
  - Utilities: `.brand-gradient` (background), `.brand-gradient-text` (text)
  - Primary buttons use `brand-gradient`, focus rings use `accent-purple`, hover states use `accent-purple` or `accent-cyan` (dark mode)
- Always use UI components from `src/components/ui/` rather than inline styling for common elements

### Mobile-First / Responsive

All pages and components follow a mobile-first approach. Key conventions:

- **Viewport**: Exported via `viewport` in root layout (`width=device-width, initialScale=1, maximumScale=5`)
- **Text sizes**: Use smaller sizes as the base, scale up with `sm:` or `lg:` (e.g. `text-2xl sm:text-4xl`)
- **Spacing**: Tighter on mobile, expand with `sm:` (e.g. `py-6 sm:py-10`, `gap-3 sm:gap-4`)
- **iOS zoom prevention**: All form inputs (`Input`, `Textarea`, `Dropdown`) use `text-base` on mobile (>=16px) and `sm:text-sm` on desktop to prevent iOS auto-zoom on focus
- **Touch targets**: All `Button` sizes have `min-h-[44px]` (md) or larger to meet WCAG touch target guidelines
- **Layouts**: Stack vertically on mobile, go horizontal with `sm:` or `lg:` breakpoints (e.g. `flex-col sm:flex-row`, `grid lg:grid-cols-2`)
- **Card padding**: `p-4 sm:p-5` — compact on mobile, spacious on desktop
- **Footer**: Stacks centered on mobile (`flex-col items-center`), row on desktop (`sm:flex-row sm:justify-between`)

### Tools Registry

`src/lib/tools-registry.ts` is the single source of truth for all tools. The homepage reads from this to generate the tool grid. Each tool entry has:

```ts
{
  name: string;        // Display name
  slug: string;        // URL slug (must match route folder name)
  description: string; // Short description for cards & meta
  category: ToolCategory; // "dev" | "security" | "media" | "utility"
}
```
