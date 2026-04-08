import type { Metadata } from "next";
import PasswordChecker from "./password-checker";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Password Strength Checker Online",
  description:
    "Check your password strength online for free. Get a detailed breakdown of security criteria including length, complexity, and common patterns. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.web.id/password-checker",
  },
};

export default function PasswordCheckerPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "Password Strength Checker", description: "Check your password strength online for free. Get a detailed breakdown of security criteria including length, complexity, and common patterns. No sign-up required.", url: "https://toolverse.web.id/password-checker" })} />
      <TrackVisit slug="password-checker" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Password Strength Checker
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Type a password to check how strong it is. See a detailed breakdown of
        security criteria.
      </p>

      <div className="mt-4 sm:mt-6">
        <PasswordChecker />
      </div>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          What Makes a Strong Password?
        </h2>
        <p>
          A strong password is long, complex, and unpredictable. It should
          combine uppercase and lowercase letters, numbers, and special symbols.
          Avoid common patterns like &quot;123&quot;, &quot;abc&quot;,
          &quot;password&quot;, or &quot;qwerty&quot; which are easily guessed by
          attackers.
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How This Tool Works
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Type or paste a password into the input field.</li>
          <li>The strength meter updates in real time.</li>
          <li>Each criterion shows a check or cross indicating whether it is met.</li>
          <li>Aim for &quot;Strong&quot; or &quot;Very Strong&quot; ratings.</li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Real-time strength analysis as you type</li>
          <li>Visual strength bar with percentage</li>
          <li>Detailed criteria checklist</li>
          <li>Detects common weak patterns</li>
          <li>Works entirely in your browser &mdash; your password is never sent anywhere</li>
        </ul>
      </section>

        <RelatedTools
          slugs={["password-generator", "uuid-generator"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
