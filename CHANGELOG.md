# Changelog

All notable changes to Toolverse are documented here.

## [Unreleased]

### Added (Tools)
- **Age Calculator** (`/age-calculator`) — calculate exact age in years, months, and days from date of birth. Shows total months, total days, and next birthday countdown. Handles leap years and edge cases. Real-time calculation with brand-gradient styled output.
- **Text Compare / Diff Checker** (`/text-compare`) — compare two texts side by side with line-by-line diff (LCS algorithm), color-coded added/removed/unchanged lines, live stats, swap button, no dependencies

### Added (Image Tools)
- **Image Resizer** (`/image-resizer`) — resize images with custom width/height, aspect ratio lock, Canvas API, download result. Zero dependencies.
- **Image Format Converter** (`/image-converter`) — convert between PNG, JPG, and WebP. JPEG quality slider. Shows file size before/after. Canvas API only.
- **Image Cropper** (`/image-cropper`) — crop images with visual overlay, preset aspect ratios (Free, 1:1, 4:3, 16:9, 3:2), pixel-precise inputs, download cropped result. Canvas API only.

### Added (Phase 1 — 10 High-Impact Tools)
- **Word Counter** (`/word-counter`) — count words, characters (with/without spaces), sentences, paragraphs, and reading time. Live stats as you type.
- **Case Converter** (`/case-converter`) — convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE.
- **URL Encoder / Decoder** (`/url-encoder`) — encode/decode URLs and query strings using encodeURIComponent/decodeURIComponent. Side-by-side input/output.
- **Timestamp Converter** (`/timestamp-converter`) — convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. "Now" button.
- **Lorem Ipsum Generator** (`/lorem-ipsum-generator`) — generate placeholder text by paragraphs, sentences, or words. Classic Lorem Ipsum with copy button.
- **Hash Generator** (`/hash-generator`) — generate SHA-1, SHA-256, SHA-512 hashes using the Web Crypto API. Live calculation with copy per hash.
- **Number Base Converter** (`/number-base-converter`) — convert between Binary, Octal, Decimal, and Hexadecimal. Live conversion with validation.
- **Percentage Calculator** (`/percentage-calculator`) — three calculators: "X% of Y", "X is what % of Y", "% change from X to Y".
- **Random Number Generator** (`/random-number-generator`) — generate random numbers in any range with crypto.getRandomValues. Integer toggle, bulk generation.
- **Slug Generator** (`/slug-generator`) — convert text to URL-friendly slugs with separator options. Live conversion with character count.
- Added "text" category back to ToolCategory for Word Counter and Case Converter.

### Added (Fun & Games + WOW Features)
- **"Fun & Games" category** — new orange-themed category for engaging/emotional tools
- **Typing Speed Test** (`/typing-test`) — type a paragraph, see WPM, accuracy, time. Competitive, shareable score.
- **Coin Flip** (`/coin-flip`) — heads or tails with flip animation, history tracker, stats
- **Spin the Wheel** (`/spin-the-wheel`) — custom wheel with options, spin animation, random winner
- **Smart Paste Auto-Detect** — paste anything on homepage, auto-detects format (JSON, JWT, Base64, URL, UUID, timestamp, binary, hex, hash, text) and suggests the right tool. The WOW factor.

### Changed (V1 Product Strategy Implementation)
- **Tool type extended** — added `icon` (text icon) and `shortDescription` (5-8 word tagline) to all 26 tools
- **ToolCard redesigned** — icon badge with category color, short tagline instead of SEO paragraph, icon scales on hover
- **Homepage rebuilt** — new hero section ("The fastest utility belt on the internet"), trust bar (4 signals), quick-access pill buttons for top 5 tools
- **Recently Used** — localStorage-based tracking, horizontal scroll row on homepage showing last 5 tools visited
- **Category filter tabs** — pill buttons to filter by All/Developer/Text/Security/Media/Utilities, toggle behavior
- **Category section backgrounds** — each category section has a subtle tinted background (blue/violet/amber/pink/emerald)
- **TrackVisit component** — added to all 26 tool pages to track usage in localStorage
- **Brand voice taglines** — every tool now has a personality-driven short description for cards

### Added (Docs)
- **Tools Roadmap** (`docs/TOOLS_ROADMAP.md`) — comprehensive 60-tool roadmap in 5 phases, competitor analysis, priority matrix, UI strategy, and category restructure plan

### Changed (UI)
- **Input component rebuilt** — now handles all input types: text, date, time, file, checkbox, range. Auto-detects variant from `type` prop. Consistent brand styling (accent-purple focus rings, accent slider/checkbox). Checkbox renders inline with label. All raw `<input>` elements across the codebase replaced: password-checker, password-generator (range + 3 checkboxes), color-picker (file), qr-code-scanner (file), timezone-converter (date + time).
- **Age Calculator calendar** — replaced year/month arrow buttons with dropdown selectors. Year dropdown shows 120 years (scrollable, auto-scrolls to selected). Month dropdown with future months greyed out. One click to jump to any year/month.
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
