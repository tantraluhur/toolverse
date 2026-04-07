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
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category);
}
