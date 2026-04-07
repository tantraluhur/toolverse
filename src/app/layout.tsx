import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://toolverse.app"),
  title: {
    default: "Toolverse - Free Online Tools for Developers & Everyone",
    template: "%s | Toolverse",
  },
  description:
    "Free online tools for daily use. JSON formatter, Base64 encoder, UUID generator, password generator, QR code tools, and more. Fast, private, and works in your browser.",
  keywords: [
    "online tools",
    "free tools",
    "developer tools",
    "JSON formatter",
    "Base64 encoder",
    "UUID generator",
    "password generator",
    "QR code generator",
  ],
  authors: [{ name: "Toolverse" }],
  creator: "Toolverse",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://toolverse.app",
    siteName: "Toolverse",
    title: "Toolverse - Free Online Tools for Developers & Everyone",
    description:
      "Free online tools for daily use. JSON formatter, Base64 encoder, UUID generator, password generator, QR code tools, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolverse - Free Online Tools",
    description:
      "Free online tools for daily use. Fast, private, and works in your browser.",
  },
  alternates: {
    canonical: "https://toolverse.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
