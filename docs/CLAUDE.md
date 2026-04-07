# Toolverse

Toolverse is an all-in-one web platform that provides a collection of free, fast, and useful tools for developers and everyday users — ranging from developer utilities, text tools, to localized Indonesian calculators.

---

## Objective

Build a scalable website with:

* SEO-first approach (1 page = 1 keyword)
* Frontend-only tools (fast, low-cost deployment)
* High page volume (programmatic SEO) for organic growth
* Monetization via ad networks (CPM-based)

---

## Core Strategy

### 1. SEO as the Primary Growth Channel

* Each tool has its own dedicated page
* Clean, keyword-focused URLs
* Target:

  * high search volume tools
  * long-tail keywords
  * Indonesia-specific niches (low competition)

---

### 2. Scalable Website Structure

```
/json-formatter
/base64-encoder
/uuid-generator
/word-counter

/calculator/gaji-bersih
/calculator/thr

/data/kode-pos-bandung
/data/kode-bank-bca
```

---

### 3. Core Principles

* Fast (deployed on Vercel)
* Mobile-first design
* Simple UX (solve problems instantly)
* Strong internal linking
* Scalable by continuously adding pages

---

## Initial Tools (Phase 1)

### Developer Tools

* JSON Formatter & Validator
* Base64 Encode / Decode
* UUID Generator

### Text Tools

* Word Counter

### Indonesia-Specific Tools

* Net Salary Calculator (Indonesia)

---

## Phase 2 (Expansion)

### Developer Tools

* URL Encoder / Decoder
* JWT Decoder
* Timestamp Converter

### Text Tools

* Case Converter
* Remove Duplicate Lines

### Calculators

* THR Calculator
* Discount Calculator
* Percentage Calculator

### Image Tools

* Image Compressor
* Resize Image
* JPG to PNG Converter

---

## Phase 3 (Programmatic SEO)

### Data Pages

* Indonesian Postal Codes (by city/district)
* Indonesian Bank Codes
* Province & City Listings

### Dynamic Pages

* Currency Converters (USD to IDR, etc.)
* Date-based calculators

---

## Tech Stack

* Framework: Next.js 16 (App Router)
* Hosting: Vercel
* Language: TypeScript
* Styling: Tailwind CSS v4
* Package Manager: Yarn
* Architecture: Fully frontend (no backend required)

---

## SEO Strategy

### URL Structure

* /json-formatter
* /base64-encoder
* /kalkulator-gaji-bersih

### On-page SEO

* Title = exact keyword
* Optimized meta description
* H1 = primary keyword
* Lightweight explanatory content

### Internal Linking

* Related tools section on every page
* Cross-link between categories

---

## Monetization

* Ad placements:

  * Above the fold
  * Below tool output
* Focus on:

  * High pageviews
  * Longer session duration

---

## Long-Term Vision

* 50–100 tools
* 100+ SEO pages
* Hybrid audience:

  * Developers
  * General users
  * Indonesia-focused traffic

---

## Philosophy

Solve simple problems, at scale.

---

## MVP Goal

* Launch 5 tools
* Fully SEO-ready pages
* Clean and fast UI
* Deploy within 7 days

---

## Future Potential

* Add lightweight AI-powered tools
* User favorites / history
* Progressive Web App (PWA)
* Multi-language support

---

## Architecture Reference

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder structure, conventions, and how to add new tools.

---

## Current Status

### Implemented Tools

**Developer Tools**
- JSON Formatter & Validator (`/json-formatter`)
- Base64 Encoder & Decoder (`/base64-encoder`)
- UUID Generator v4 (`/uuid-generator`)
- JWT Decoder (`/jwt-decoder`)
- Text Compare / Diff Checker (`/text-compare`)

**Security**
- Password Generator (`/password-generator`)
- Password Strength Checker (`/password-checker`)

**Media & Image**
- QR Code Generator (`/qr-code-generator`)
- QR Code Scanner (`/qr-code-scanner`)
- Color Picker from Image (`/color-picker`)

**Utilities**
- Time Zone Converter (`/timezone-converter`)
- Random Name Picker (`/random-name-picker`)
- Age Calculator (`/age-calculator`)

### Project Structure
- Shared layout (Navbar + Footer) in root layout
- Tools registry at `src/lib/tools-registry.ts`
- Reusable UI component library in `src/components/ui/` (Button, Input, Textarea, Dropdown, Card, Alert, CopyButton, Label)
- SEO metadata pattern established per tool page
- Mobile-first responsive design throughout (iOS zoom prevention, 44px touch targets, stacking layouts)
- RelatedTools component for internal cross-linking between tool pages
- Navbar with tools navigation dropdown (grouped by category, auto-reads from registry, mobile hamburger menu)

### SEO Infrastructure
- Dynamic `sitemap.xml` auto-generated from tools registry
- `robots.txt` allowing all crawlers with sitemap reference
- JSON-LD structured data on every page (`WebSite` on homepage, `WebApplication` on tool pages)
- Canonical URLs on every page via `alternates.canonical`
- Open Graph + Twitter Card meta tags
- GoogleBot-specific `robots` directives (max-image-preview: large, max-snippet: -1)
- Footer with sitewide tool link grid (grouped by category) for internal linking
- Custom 404 page with links to popular tools
- JsonLd reusable component with `toolJsonLd()` and `websiteJsonLd()` helpers
