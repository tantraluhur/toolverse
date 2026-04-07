import { Tool } from "@/types/tool";

export const tools: Tool[] = [
  // Developer Tools
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description:
      "Format, validate, and minify JSON data online for free. Instantly pretty-print or compress your JSON.",
    category: "dev",
  },
  {
    name: "Base64 Encoder & Decoder",
    slug: "base64-encoder",
    description:
      "Encode text to Base64 or decode Base64 to plain text online for free. Fast, private, and works in your browser.",
    category: "dev",
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    description:
      "Generate random UUID v4 identifiers online for free. Create one or multiple UUIDs instantly in your browser.",
    category: "dev",
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description:
      "Decode and inspect JWT tokens online for free. View the header, payload, and signature instantly in your browser.",
    category: "dev",
  },

  // Security
  {
    name: "Password Generator",
    slug: "password-generator",
    description:
      "Generate strong random passwords online for free. Customize length, uppercase, numbers, and symbols.",
    category: "security",
  },
  {
    name: "Password Checker",
    slug: "password-checker",
    description:
      "Check your password strength online for free. Get a detailed breakdown of security criteria and tips.",
    category: "security",
  },

  // Media & Image
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description:
      "Generate QR codes from text or URLs online for free. Live preview and download as PNG instantly.",
    category: "media",
  },
  {
    name: "QR Code Scanner",
    slug: "qr-code-scanner",
    description:
      "Scan and decode QR codes from uploaded images online for free. Fast, private, and works in your browser.",
    category: "media",
  },
  {
    name: "Color Picker from Image",
    slug: "color-picker",
    description:
      "Pick any color from an uploaded image. Get HEX, RGB, and HSL values instantly. Free and private.",
    category: "media",
  },
  {
    name: "Image Resizer",
    slug: "image-resizer",
    description:
      "Resize images online for free. Set custom width and height with aspect ratio lock. Download instantly.",
    category: "media",
  },
  {
    name: "Image Format Converter",
    slug: "image-converter",
    description:
      "Convert images between PNG, JPG, and WebP formats online for free. Fast, private, no upload to server.",
    category: "media",
  },
  {
    name: "Image Cropper",
    slug: "image-cropper",
    description:
      "Crop images online for free. Select any region, set aspect ratio, and download the cropped result.",
    category: "media",
  },

  // Utilities
  {
    name: "Time Zone Converter",
    slug: "timezone-converter",
    description:
      "Convert time between time zones online for free. Supports all major time zones worldwide.",
    category: "utility",
  },
  {
    name: "Random Name Picker",
    slug: "random-name-picker",
    description:
      "Pick a random name from a list online for free. Perfect for giveaways, team assignments, and decisions.",
    category: "utility",
  },
  {
    name: "Text Compare (Diff Checker)",
    slug: "text-compare",
    description:
      "Compare two texts side by side and see the differences highlighted. Free online diff checker for code, documents, and more.",
    category: "dev",
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    description:
      "Calculate your exact age in years, months, and days. See your next birthday countdown instantly.",
    category: "utility",
  },

  // Text Tools
  {
    name: "Word Counter",
    slug: "word-counter",
    description:
      "Count words, characters, sentences, and paragraphs. Estimate reading time. Free and instant.",
    category: "text",
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more.",
    category: "text",
  },

  // More Developer Tools
  {
    name: "URL Encoder / Decoder",
    slug: "url-encoder",
    description:
      "Encode or decode URLs and query strings online for free. Handle special characters safely.",
    category: "dev",
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.",
    category: "dev",
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    description:
      "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Copy with one click.",
    category: "dev",
  },
  {
    name: "Hash Generator",
    slug: "hash-generator",
    description:
      "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes online for free. Uses the Web Crypto API.",
    category: "dev",
  },
  {
    name: "Number Base Converter",
    slug: "number-base-converter",
    description:
      "Convert numbers between Binary, Octal, Decimal, and Hexadecimal. Instant and accurate.",
    category: "dev",
  },
  {
    name: "Slug Generator",
    slug: "slug-generator",
    description:
      "Convert any text into a clean, URL-friendly slug. Remove special characters and spaces instantly.",
    category: "dev",
  },

  // More Utilities
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    description:
      "Calculate percentages easily. What is X% of Y? X is what % of Y? Percentage change between two numbers.",
    category: "utility",
  },
  {
    name: "Random Number Generator",
    slug: "random-number-generator",
    description:
      "Generate random numbers in any range. Supports integers and decimals with cryptographic randomness.",
    category: "utility",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category);
}
