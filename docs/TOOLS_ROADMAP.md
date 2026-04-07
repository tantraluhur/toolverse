# Toolverse — Tools Roadmap

Based on analysis of top competitor sites (10015.io, IT-Tools, SmallDev.tools, CyberChef, transform.tools, miniwebtool.com, Dan's Tools, CodeBeautify, devtools.best, smallseotools.com, textfixer.com, emn178.github.io, seoptimer.com).

**Criteria:**
- Frontend-only (no backend required)
- High search volume / high demand (appears on 3+ competitor sites)
- Genuinely useful for developers AND general users
- Simple to build (one page, one purpose)
- Can be made better than competitors with better UI/UX

## Competitor Breakdown

| Site | Focus | Key Tools |
|------|-------|-----------|
| **10015.io** | All-in-one (broadest) | 100+ tools — text, CSS visual builders, color, coding, converters, generators, math, social media, timers |
| **devtools.best** | Curated dev tools | JSON, Base64, URL encode, JWT, Hash, Regex, Timestamp, Color, CSS min/beautify, Markdown, Cron, Lorem Ipsum, Diff |
| **SmallDev.tools** | Dev micro-tools | JSON, Base64, URL, HTML, JWT, Hash, UUID, Lorem Ipsum, Regex, Timestamp, Number Base, Case Converter, CSS Unit, Color, Diff |
| **transform.tools** | Data format transforms | JSON↔YAML, JSON↔CSV, JSON→TypeScript, JSON→Go, HTML→JSX, SVG→JSX, Markdown→HTML, TOML↔JSON |
| **CyberChef** | Encoding/crypto | Every encoding, hash, XOR, regex, text manipulation, number base |
| **textfixer.com** | Text cleaning | Remove line breaks, remove duplicates, sort, reverse, word count, case convert, find/replace, slug |
| **miniwebtool.com** | Calculators + generators | Random generators, word/char counter, GPA calc, percentage calc, age calc, hash, timestamp |
| **smallseotools.com** | SEO + content | Word counter, lorem ipsum, case converter, meta tag generator, OG generator, robots.txt, UTM builder |

### Tools Found on 6+ Sites (Universal Staples — WE MUST HAVE)
Word Counter, URL Encode/Decode, Hash Generator, Lorem Ipsum, Case Converter, Color Converter, Unix Timestamp Converter

### Tools Found on 4-5 Sites (Strong Demand)
Regex Tester, HTML Encode/Decode, Markdown Preview, Number Base Converter, CSS Gradient Generator, Box Shadow Generator, Random Number Generator, Percentage Calculator, Meta Tag Generator

---

## Current Tools (13 implemented)

| # | Tool | Category | Status |
|---|------|----------|--------|
| 1 | JSON Formatter & Validator | dev | Done |
| 2 | Base64 Encoder & Decoder | dev | Done |
| 3 | UUID Generator (v4) | dev | Done |
| 4 | JWT Decoder | dev | Done |
| 5 | Text Compare (Diff Checker) | dev | Done |
| 6 | Password Generator | security | Done |
| 7 | Password Strength Checker | security | Done |
| 8 | QR Code Generator | media | Done |
| 9 | QR Code Scanner | media | Done |
| 10 | Color Picker from Image | media | Done |
| 11 | Time Zone Converter | utility | Done |
| 12 | Random Name Picker | utility | Done |
| 13 | Age Calculator | utility | Done |

---

## Phase 1 — High Impact (Most searched, easiest to build)

These tools appear on nearly every competitor site and have very high search volume. They are also simple to implement frontend-only.

| # | Tool | Slug | Category | Why |
|---|------|------|----------|-----|
| 14 | URL Encoder / Decoder | `url-encoder` | dev | Top 5 most searched dev tool. Every competitor has it. Simple encodeURIComponent/decodeURIComponent. |
| 15 | Hash Generator (MD5, SHA-1, SHA-256) | `hash-generator` | dev | Extremely popular. Use Web Crypto API `crypto.subtle.digest`. Support multiple algorithms in one page. |
| 16 | Word Counter | `word-counter` | text | Top searched text tool. Count words, characters, sentences, paragraphs, reading time. Writers use it daily. |
| 17 | Case Converter | `case-converter` | text | uppercase, lowercase, Title Case, camelCase, snake_case, kebab-case, CONSTANT_CASE. Very popular with devs AND writers. |
| 18 | Lorem Ipsum Generator | `lorem-ipsum-generator` | dev | High search volume. Generate placeholder text by paragraphs, sentences, or words. |
| 19 | Markdown Preview | `markdown-preview` | dev | Live markdown editor with preview. Use a lightweight parser like marked. Very popular. |
| 20 | HTML Encoder / Decoder | `html-encoder` | dev | Escape/unescape HTML entities. Every dev tools site has this. |
| 21 | Timestamp Converter | `timestamp-converter` | dev | Convert Unix timestamps to human-readable dates and vice versa. Very high demand among devs. |
| 22 | Number Base Converter | `number-base-converter` | dev | Convert between Binary, Octal, Decimal, Hex. Simple but very popular. |
| 23 | Percentage Calculator | `percentage-calculator` | utility | "What is X% of Y?", "X is what % of Y?", "% change from X to Y". Extremely high general search volume. |

---

## Phase 2 — Developer Favorites

Tools that developers specifically search for. Lower general traffic but very sticky users (they bookmark and return).

| # | Tool | Slug | Category | Why |
|---|------|------|----------|-----|
| 24 | JSON to CSV Converter | `json-to-csv` | dev | Very popular data conversion. Parse JSON array → CSV download. |
| 25 | CSV to JSON Converter | `csv-to-json` | dev | Reverse of above. Both are high demand. |
| 26 | Regex Tester | `regex-tester` | dev | Input regex + test string, highlight matches, show groups. Every dev tools site has one. |
| 27 | Cron Expression Parser | `cron-parser` | dev | Input cron expression, show human-readable schedule + next 5 run times. Devops essential. |
| 28 | Color Converter | `color-converter` | dev | Convert between HEX, RGB, HSL, HSV. Live preview swatch. Complements our Color Picker. |
| 29 | CSS Gradient Generator | `css-gradient-generator` | dev | Visual gradient builder with CSS output. Very popular among frontend devs. |
| 30 | Box Shadow Generator | `box-shadow-generator` | dev | Visual CSS box-shadow builder. High search volume. |
| 31 | Meta Tag Generator | `meta-tag-generator` | dev | Generate HTML meta tags for SEO, Open Graph, Twitter. Very useful for web devs. |
| 32 | Slug Generator | `slug-generator` | dev | Convert any text to a URL-friendly slug. Simple but highly searched. |
| 33 | JSON Minifier | `json-minifier` | dev | Dedicated minify page (our formatter already does this but separate page = separate keyword). |

---

## Phase 3 — Text & Writing Tools

High volume general-purpose tools. Writers, students, marketers search for these daily.

| # | Tool | Slug | Category | Why |
|---|------|------|----------|-----|
| 34 | Remove Duplicate Lines | `remove-duplicate-lines` | text | We had this before. Very popular for data cleaning. |
| 35 | Text Reverser | `text-reverser` | text | Reverse text, reverse words, reverse lines. Simple but searched. |
| 36 | Find and Replace | `find-and-replace` | text | Bulk find & replace in text with regex support. |
| 37 | Sort Lines | `sort-lines` | text | Sort lines alphabetically, numerically, reverse, random. |
| 38 | Text to Binary / Binary to Text | `text-to-binary` | dev | Convert text ↔ binary representation. Popular curiosity tool. |
| 39 | ROT13 Encoder/Decoder | `rot13` | dev | Simple cipher. Popular for fun/puzzles. |
| 40 | Whitespace Remover | `whitespace-remover` | text | Remove extra spaces, tabs, line breaks. Data cleaning essential. |
| 41 | Line Counter | `line-counter` | text | Count lines in text. Often searched separately from word counter. |

---

## Phase 4 — Calculators & Converters

Extremely high search volume from general audience. Low competition, easy to rank.

| # | Tool | Slug | Category | Why |
|---|------|------|----------|-----|
| 42 | BMI Calculator | `bmi-calculator` | utility | One of the highest search volume calculator keywords globally. |
| 43 | Discount Calculator | `discount-calculator` | utility | Calculate sale price from discount %. Very high general search volume. |
| 44 | Tip Calculator | `tip-calculator` | utility | Calculate tip amount and split between people. |
| 45 | Unit Converter | `unit-converter` | utility | Length, weight, temperature, speed, data storage. Mega tool. |
| 46 | Days Between Dates | `days-between-dates` | utility | How many days between two dates. Complements our Age Calculator. |
| 47 | Loan Calculator | `loan-calculator` | utility | Monthly payment, total interest, amortization. High finance traffic. |
| 48 | Roman Numeral Converter | `roman-numeral-converter` | utility | Convert numbers ↔ roman numerals. Surprisingly high search volume. |
| 49 | Random Number Generator | `random-number-generator` | utility | Generate random numbers in a range. Very high search volume. |
| 50 | Coin Flip / Dice Roller | `coin-flip` | utility | Fun tool but extremely high traffic. With animation. |

---

## Phase 5 — Differentiators (Make Us Better)

Tools that most competitors do poorly or don't have. These can set Toolverse apart.

| # | Tool | Slug | Category | Why |
|---|------|------|----------|-----|
| 51 | API Request Builder | `api-tester` | dev | Simple GET/POST/PUT/DELETE with headers, body, response preview. Like a mini Postman in the browser. Most tools sites don't have this. |
| 52 | Favicon Generator | `favicon-generator` | dev | Upload image → generate favicon.ico + various sizes. Very useful, rarely done well. |
| 53 | Open Graph Preview | `og-preview` | dev | Paste a URL, preview how it looks on Facebook/Twitter/LinkedIn. Unique differentiator. |
| 54 | Pomodoro Timer | `pomodoro-timer` | utility | 25/5 minute timer with notifications. Very sticky — users come back daily. |
| 55 | Kanban Board (Local) | `kanban-board` | utility | Simple drag-and-drop kanban saved to localStorage. Unique — no competitor has this. |
| 56 | JSON Visualizer / Tree | `json-tree` | dev | Visualize JSON as a collapsible tree. Better than flat formatted text. |
| 57 | Aspect Ratio Calculator | `aspect-ratio-calculator` | media | Calculate aspect ratio, resize dimensions. Video/photo editors search for this. |
| 58 | Placeholder Image Generator | `placeholder-image` | dev | Generate placeholder images (solid color / gradient) with custom size. Download PNG. |
| 59 | Emoji Picker & Search | `emoji-picker` | utility | Search, browse, copy emojis. Surprisingly high traffic tool. |
| 60 | Typing Speed Test | `typing-test` | utility | Test typing speed (WPM). Very high traffic, very sticky. |

---

## Priority Matrix

### Do First (High impact, Low effort)
1. Word Counter
2. URL Encoder/Decoder
3. Case Converter
4. Percentage Calculator
5. Timestamp Converter
6. Lorem Ipsum Generator
7. Hash Generator
8. Number Base Converter
9. Random Number Generator
10. Slug Generator

### Do Next (High impact, Medium effort)
11. Markdown Preview
12. HTML Encoder/Decoder
13. Regex Tester
14. Remove Duplicate Lines
15. Sort Lines
16. Color Converter
17. Days Between Dates
18. BMI Calculator
19. Discount Calculator
20. Find and Replace

### Do Later (Medium impact, Higher effort)
21. JSON to CSV / CSV to JSON
22. Cron Expression Parser
23. CSS Gradient Generator
24. Box Shadow Generator
25. Meta Tag Generator
26. Coin Flip / Dice Roller
27. Typing Speed Test
28. Emoji Picker
29. Unit Converter
30. Pomodoro Timer

### Differentiators (Do when ready to compete)
31. JSON Visualizer / Tree View
32. API Request Builder
33. Open Graph Preview
34. Favicon Generator
35. Kanban Board

---

## How to Be Better Than Competitors

Most competitor sites have:
- Ugly, outdated UI (looks like 2015)
- Too many ads cluttering the page
- Slow load times
- No dark mode
- Bad mobile experience
- No live preview (need to click "Submit" button)
- No copy-to-clipboard

**Our advantages to maintain:**
1. **Modern UI** — Clean, gradient accents, dark mode, mobile-first
2. **Instant results** — Live preview as user types (no submit button needed)
3. **Zero ads** (initially) — Faster, cleaner experience
4. **Copy with one click** — Every output has a copy button
5. **Privacy-first** — "Works in your browser" messaging on every page
6. **Fast** — Static generation, no server round-trips
7. **Consistent** — Same design language across all tools
8. **SEO-first** — Every page has structured data, canonical URLs, content sections

**UI features to add across ALL tools:**
- Input character/line count where relevant
- "Paste from clipboard" button on inputs
- Sample/example data button ("Try an example")
- Keyboard shortcuts (Ctrl+Enter to submit)
- Toast notifications for copy success
- Share result via URL (encode state in URL hash)

---

## Category Restructure (after Phase 2)

When we reach 30+ tools, restructure categories:

| Category | Slug prefix | Tools |
|----------|-------------|-------|
| Developer | `/` | JSON, Base64, UUID, JWT, Hash, URL encode, HTML encode, Regex, Cron, Markdown, Timestamp, Lorem Ipsum, Slug, Meta Tags |
| Text | `/` | Word Counter, Case Converter, Diff Checker, Remove Duplicates, Sort Lines, Find Replace, Text Reverse, Whitespace Remove |
| Security | `/` | Password Generator, Password Checker |
| Media & Design | `/` | QR Generate, QR Scan, Color Picker, Color Converter, CSS Gradient, Box Shadow, Placeholder Image, Favicon |
| Calculators | `/` | Age, Percentage, BMI, Discount, Tip, Loan, Days Between, Aspect Ratio |
| Converters | `/` | Timezone, Number Base, Unit, Roman Numeral, Text to Binary |
| Fun & Random | `/` | Random Name, Random Number, Coin Flip, Dice, Typing Test, Emoji Picker |
| Productivity | `/` | Pomodoro Timer, Kanban Board |
