import { Tool } from "@/types/tool";

export const tools: Tool[] = [
  // Developer Tools
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    icon: "{ }",
    shortDescription: "Paste ugly JSON, get pretty JSON.",
    description:
      "Format, validate, and minify JSON data online for free. Instantly pretty-print or compress your JSON.",
    category: "dev",
  },
  {
    name: "Base64 Encoder & Decoder",
    slug: "base64-encoder",
    icon: "B64",
    shortDescription: "Encode or decode Base64 instantly.",
    description:
      "Encode text to Base64 or decode Base64 to plain text online for free. Fast, private, and works in your browser.",
    category: "dev",
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    icon: "#",
    shortDescription: "Generate unique IDs in one click.",
    description:
      "Generate random UUID v4 identifiers online for free. Create one or multiple UUIDs instantly in your browser.",
    category: "dev",
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    icon: "JWT",
    shortDescription: "Inspect JWT header, payload & signature.",
    description:
      "Decode and inspect JWT tokens online for free. View the header, payload, and signature instantly in your browser.",
    category: "dev",
  },
  {
    name: "Text Compare",
    slug: "text-compare",
    icon: "AB",
    shortDescription: "Side-by-side diff with highlights.",
    description:
      "Compare two texts side by side and see the differences highlighted. Free online diff checker for code, documents, and more.",
    category: "dev",
  },
  {
    name: "URL Encoder / Decoder",
    slug: "url-encoder",
    icon: "%",
    shortDescription: "Encode & decode URLs safely.",
    description:
      "Encode or decode URLs and query strings online for free. Handle special characters safely.",
    category: "dev",
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
    icon: "T",
    shortDescription: "Unix timestamp to human date & back.",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.",
    category: "dev",
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    icon: "...",
    shortDescription: "Generate placeholder text instantly.",
    description:
      "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Copy with one click.",
    category: "dev",
  },
  {
    name: "Hash Generator",
    slug: "hash-generator",
    icon: "#!",
    shortDescription: "SHA-1, SHA-256, SHA-512 in one place.",
    description:
      "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes online for free. Uses the Web Crypto API.",
    category: "dev",
  },
  {
    name: "Number Base Converter",
    slug: "number-base-converter",
    icon: "01",
    shortDescription: "Binary, octal, decimal, hex converter.",
    description:
      "Convert numbers between Binary, Octal, Decimal, and Hexadecimal. Instant and accurate.",
    category: "dev",
  },
  {
    name: "Slug Generator",
    slug: "slug-generator",
    icon: "/",
    shortDescription: "Turn any text into a clean URL slug.",
    description:
      "Convert any text into a clean, URL-friendly slug. Remove special characters and spaces instantly.",
    category: "dev",
  },

  // Text Tools
  {
    name: "Word Counter",
    slug: "word-counter",
    icon: "Wc",
    shortDescription: "Words, characters, sentences & reading time.",
    description:
      "Count words, characters, sentences, and paragraphs. Estimate reading time. Free and instant.",
    category: "text",
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    icon: "Aa",
    shortDescription: "UPPER, lower, camelCase & more.",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more.",
    category: "text",
  },

  // Security
  {
    name: "Password Generator",
    slug: "password-generator",
    icon: "***",
    shortDescription: "Generate passwords hackers will hate.",
    description:
      "Generate strong random passwords online for free. Customize length, uppercase, numbers, and symbols.",
    category: "security",
  },
  {
    name: "Password Checker",
    slug: "password-checker",
    icon: "Ok",
    shortDescription: "How strong is your password, really?",
    description:
      "Check your password strength online for free. Get a detailed breakdown of security criteria and tips.",
    category: "security",
  },

  // Media & Image
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    icon: "QR",
    shortDescription: "Text or URL to QR code in seconds.",
    description:
      "Generate QR codes from text or URLs online for free. Live preview and download as PNG instantly.",
    category: "media",
  },
  {
    name: "QR Code Scanner",
    slug: "qr-code-scanner",
    icon: "Sc",
    shortDescription: "Upload an image, read the QR code.",
    description:
      "Scan and decode QR codes from uploaded images online for free. Fast, private, and works in your browser.",
    category: "media",
  },
  {
    name: "Color Picker from Image",
    slug: "color-picker",
    icon: "Cp",
    shortDescription: "Pick any color from any image.",
    description:
      "Pick any color from an uploaded image. Get HEX, RGB, and HSL values instantly. Free and private.",
    category: "media",
  },
  {
    name: "Image Resizer",
    slug: "image-resizer",
    icon: "Rs",
    shortDescription: "Resize images with aspect ratio lock.",
    description:
      "Resize images online for free. Set custom width and height with aspect ratio lock. Download instantly.",
    category: "media",
  },
  {
    name: "Image Format Converter",
    slug: "image-converter",
    icon: "Cv",
    shortDescription: "Convert between PNG, JPG & WebP.",
    description:
      "Convert images between PNG, JPG, and WebP formats online for free. Fast, private, no upload to server.",
    category: "media",
  },
  {
    name: "Image Cropper",
    slug: "image-cropper",
    icon: "Cr",
    shortDescription: "Crop images with visual preview.",
    description:
      "Crop images online for free. Select any region, set aspect ratio, and download the cropped result.",
    category: "media",
  },
  {
    name: "PDF Merge",
    slug: "pdf-merge",
    icon: "Pdf",
    shortDescription: "Combine multiple PDFs into one file.",
    description:
      "Merge multiple PDF files into a single document online for free. Drag to reorder, preview page counts, download instantly. 100% client-side.",
    category: "media",
  },
  {
    name: "PDF Split",
    slug: "pdf-split",
    icon: "Sp",
    shortDescription: "Split a PDF into separate files.",
    description:
      "Split a PDF file by page ranges or extract specific pages. Download individually or as a ZIP. 100% client-side.",
    category: "media",
  },
  {
    name: "Image to PDF",
    slug: "image-to-pdf",
    icon: "Im",
    shortDescription: "Convert images to a PDF document.",
    description:
      "Convert multiple JPG or PNG images into a single PDF. Reorder, set page size and orientation. 100% client-side.",
    category: "media",
  },
  {
    name: "PDF to Image",
    slug: "pdf-to-image",
    icon: "Pi",
    shortDescription: "Convert PDF pages to PNG or JPG images.",
    description:
      "Convert PDF pages to high-quality PNG or JPG images online for free. Select pages, choose resolution. 100% client-side.",
    category: "media",
  },

  // Utilities
  {
    name: "Time Zone Converter",
    slug: "timezone-converter",
    icon: "Tz",
    shortDescription: "What time is it in Tokyo right now?",
    description:
      "Convert time between time zones online for free. Supports all major time zones worldwide.",
    category: "utility",
  },
  {
    name: "Random Name Picker",
    slug: "random-name-picker",
    icon: "?!",
    shortDescription: "Pick a random winner from a list.",
    description:
      "Pick a random name from a list online for free. Perfect for giveaways, team assignments, and decisions.",
    category: "fun",
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    icon: "Bd",
    shortDescription: "How many days have you been alive?",
    description:
      "Calculate your exact age in years, months, and days. See your next birthday countdown instantly.",
    category: "utility",
  },
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    icon: "%",
    shortDescription: "What is X% of Y? Solved instantly.",
    description:
      "Calculate percentages easily. What is X% of Y? X is what % of Y? Percentage change between two numbers.",
    category: "utility",
  },
  {
    name: "Random Number Generator",
    slug: "random-number-generator",
    icon: "Rn",
    shortDescription: "Random numbers with true randomness.",
    description:
      "Generate random numbers in any range. Supports integers and decimals with cryptographic randomness.",
    category: "utility",
  },

  // Fun & Games
  {
    name: "Typing Speed Test",
    slug: "typing-test",
    icon: "Kb",
    shortDescription: "How fast can you type? Find out now.",
    description:
      "Test your typing speed in WPM with accuracy tracking. Challenge yourself and share your score.",
    category: "fun",
  },
  {
    name: "Coin Flip",
    slug: "coin-flip",
    icon: "Hd",
    shortDescription: "Heads or tails? Let fate decide.",
    description:
      "Flip a virtual coin online for free. Fair 50/50 odds with satisfying animation. Perfect for quick decisions.",
    category: "fun",
  },
  {
    name: "Spin the Wheel",
    slug: "spin-the-wheel",
    icon: "Wh",
    shortDescription: "Add options, spin, let the wheel decide.",
    description:
      "Create a custom wheel with your options and spin to pick a random winner. Great for games, decisions, and giveaways.",
    category: "fun",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category);
}
