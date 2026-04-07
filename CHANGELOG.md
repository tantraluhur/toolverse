# Changelog

All notable changes to Toolverse are documented here.

## [Unreleased]

### Added (Tools)
- **Age Calculator** (`/age-calculator`) — calculate exact age in years, months, and days from date of birth. Shows total months, total days, and next birthday countdown. Handles leap years and edge cases. Real-time calculation with brand-gradient styled output.
- **Text Compare / Diff Checker** (`/text-compare`) — compare two texts side by side with line-by-line diff (LCS algorithm), color-coded added/removed/unchanged lines, live stats, swap button, no dependencies

### Changed (UI)
- **ToolCard component** (`src/components/ui/ToolCard.tsx`) — new purpose-built card for tool grids, replacing the generic Card usage. Features: elevated white card with shadow, rounded-xl corners, hover lift animation (-translate-y-0.5 + shadow-md), brand-colored hover states on title and border, color-coded category badge (blue/amber/pink/emerald per category), optional "New"/"Popular" badge, "Open tool →" arrow indicator, full card clickable via Link wrapper with group hover. Applied to homepage and all RelatedTools sections.

### Changed (Brand)
- **Brand color theme** — introduced cyan-to-purple gradient from favicon (`#00d4ff` → `#8b5cf6`) across the site. Logo text, primary buttons, homepage H1, card hover borders, footer category headings, dropdown highlights, focus rings, file upload buttons, and 404 page all use the brand gradient/accent. CSS custom properties `--accent-cyan` and `--accent-purple` with `.brand-gradient` and `.brand-gradient-text` utility classes.

### Added (SEO)
- **Dynamic sitemap.xml** (`src/app/sitemap.ts`) — auto-generated from tools registry, includes all tool pages with priority and changeFrequency
- **robots.txt** (`src/app/robots.ts`) — allows all crawlers, references sitemap URL
- **JSON-LD structured data** — `WebSite` schema on homepage, `WebApplication` schema on every tool page (name, description, free pricing, category)
- **Canonical URLs** — `alternates.canonical` on every page to prevent duplicate content
- **Enhanced root metadata** — `metadataBase`, `openGraph`, `twitter` card, `robots` directives with googleBot config, `keywords`, `authors`
- **SEO-optimized Footer** — rebuilt with full tool link grid grouped by category (sitewide internal linking for crawlers)
- **Custom 404 page** — links back to homepage and popular tools (prevents dead-end crawling)
- **JsonLd component** (`src/components/layout/JsonLd.tsx`) — reusable structured data renderer with `toolJsonLd()` and `websiteJsonLd()` helpers

### Added
- **Color Picker from Image** (`/color-picker`) — upload image, click to pick color, get HEX/RGB/HSL values with copy buttons, canvas-based pixel sampling
- **Time Zone Converter** (`/timezone-converter`) — convert time between 20+ major time zones with live results using the Intl API, custom Dropdown selectors
- **Random Name Picker** (`/random-name-picker`) — enter names one per line, pick a random winner using secure crypto.getRandomValues, live entry count, copy result
- **Password Strength Checker** (`/password-checker`) — real-time password analysis with visual strength bar, percentage score, 7-criteria checklist including common pattern detection
- **QR Code Scanner** (`/qr-code-scanner`) — upload image to decode QR codes using jsQR library, auto-detect URLs with clickable links, image preview, copy result
- **QR Code Generator** (`/qr-code-generator`) — generate QR codes from text or URLs with live preview, download as PNG, powered by the `qrcode` library rendering to canvas
- **Password Generator** (`/password-generator`) — generate strong random passwords with customizable length (8–32), toggles for uppercase/numbers/symbols, secure `crypto.getRandomValues`, copy and clear
- **JWT Decoder** (`/jwt-decoder`) — decode JWT tokens into header, payload, and signature with pretty-printed JSON, per-section copy, error handling, and related tools
- **UUID Generator** (`/uuid-generator`) — generate 1–10 UUID v4 identifiers using the native Web Crypto API, with per-item and bulk copy, clear, and related tools
- **Base64 Encoder & Decoder** (`/base64-encoder`) — encode text to Base64 or decode Base64 to plain text, with error handling, copy, and clear
- **RelatedTools component** (`src/components/layout/RelatedTools.tsx`) — reusable section that renders related tool cards from the registry by slug; added to all tool pages for internal cross-linking
- Related tools sections on all tool pages for SEO internal linking

### Removed
- **Remove Duplicate Lines** (`/remove-duplicate-lines`) — replaced by Password Generator

### Changed
- **Category system overhaul** — reorganized categories from (`dev`, `text`, `calculator`, `image`, `reference`) to (`dev`, `security`, `media`, `utility`) for better grouping. Moved Password Generator to `security`, QR Code Generator to `media`. Removed unused categories.
- **ToolCategory refactor** — renamed `"developer"` → `"dev"` and `"data"` → `"reference"` for clarity and scalability. Updated type definition, category labels, tools registry, and documentation.
- **Navbar** — rebuilt with tools navigation dropdown (desktop: popover grouped by category, mobile: hamburger menu with full tool list). Reads from tools registry for automatic updates. Sticky header with backdrop blur. Improves SEO via internal linking from every page.
- **Dropdown component** — replaced native `<select>` with a custom shadcn-style popover dropdown: chevron icon, check mark on selected item, keyboard navigation (arrow keys, Enter, Escape), click-outside-to-close, proper ARIA roles

## [0.1.0] - 2026-04-07

### Added
- Project scaffolding with Next.js 16, TypeScript, Tailwind CSS v4, Yarn
- Shared layout: Navbar, Footer, root layout with viewport meta
- Tools registry (`src/lib/tools-registry.ts`) — single source of truth for all tools
- Homepage with auto-generated tool grid from registry
- **JSON Formatter & Validator** (`/json-formatter`) — format, minify, validate JSON with copy and clear
- Reusable UI component library: Button, Input, Textarea, Dropdown, Card, Alert, CopyButton, Label
- Mobile-first responsive design: iOS zoom prevention, 44px touch targets, stacking layouts
- Project documentation: `docs/CLAUDE.md`, `docs/ARCHITECTURE.md`
