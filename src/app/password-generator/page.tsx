import type { Metadata } from "next";
import PasswordGenerator from "./password-generator";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "Random Password Generator",
  description:
    "Generate strong random passwords online for free. Customize length, uppercase letters, numbers, and symbols. Uses secure cryptographic randomness. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/password-generator",
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Password Generator", description: "Generate strong random passwords online for free. Customize length, uppercase letters, numbers, and symbols. Uses secure cryptographic randomness. No sign-up required.", url: "https://toolverse.app/password-generator" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Password Generator
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Generate strong, random passwords with customizable length and character
        options.
      </p>

      <div className="mt-4 sm:mt-6">
        <PasswordGenerator />
      </div>

      {/* SEO content section */}
      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Why Use a Password Generator?
        </h2>
        <p>
          Weak and reused passwords are the leading cause of account breaches. A
          random password generator creates passwords that are virtually
          impossible to guess, using cryptographically secure randomness. Each
          password is unique and unpredictable, significantly improving your
          online security.
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Use the <strong>slider</strong> to choose a password length between 8
            and 32 characters.
          </li>
          <li>
            Toggle <strong>uppercase</strong>, <strong>numbers</strong>, and{" "}
            <strong>symbols</strong> on or off to match your requirements.
          </li>
          <li>
            Click <strong>Generate</strong> to create a new password.
          </li>
          <li>
            Click <strong>Copy</strong> to copy it to your clipboard.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Adjustable length from 8 to 32 characters</li>
          <li>Include or exclude uppercase, numbers, and symbols</li>
          <li>
            Uses the Web Crypto API (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              crypto.getRandomValues
            </code>
            ) for secure randomness
          </li>
          <li>Copy to clipboard with one click</li>
          <li>
            Works entirely in your browser &mdash; no passwords are stored or
            transmitted
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Tips for Strong Passwords
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Use at least 12 characters for important accounts</li>
          <li>Enable all character types for maximum strength</li>
          <li>Never reuse passwords across different sites</li>
          <li>Store passwords in a password manager</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["uuid-generator", "base64-encoder"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
