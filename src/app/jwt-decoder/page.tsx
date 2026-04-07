import type { Metadata } from "next";
import JwtDecoder from "./jwt-decoder";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";

export const metadata: Metadata = {
  title: "JWT Decoder Online",
  description:
    "Decode and inspect JWT (JSON Web Token) tokens online for free. View the header, payload, and signature with pretty-printed JSON. No sign-up required.",
  alternates: {
    canonical: "https://toolverse.app/jwt-decoder",
  },
};

export default function JwtDecoderPage() {
  return (
    <>
      <JsonLd data={toolJsonLd({ name: "JWT Decoder", description: "Decode and inspect JWT (JSON Web Token) tokens online for free. View the header, payload, and signature with pretty-printed JSON. No sign-up required.", url: "https://toolverse.app/jwt-decoder" })} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          JWT Decoder
        </h1>
      <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
        Paste a JWT token to decode and inspect its header, payload, and
        signature.
      </p>

      <div className="mt-4 sm:mt-6">
        <JwtDecoder />
      </div>

      {/* SEO content section */}
      <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          What is a JWT?
        </h2>
        <p>
          A JSON Web Token (JWT) is a compact, URL-safe token format used for
          securely transmitting information between parties. It consists of three
          Base64url-encoded parts separated by dots: a <strong>header</strong>{" "}
          (algorithm and token type), a <strong>payload</strong> (claims such as
          user ID, expiration, and roles), and a <strong>signature</strong> (used
          to verify the token has not been tampered with).
        </p>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          How to Use This Tool
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Paste your JWT token into the input field.</li>
          <li>
            Click <strong>Decode</strong> to view the header, payload, and
            signature.
          </li>
          <li>Each section is pretty-printed as formatted JSON.</li>
          <li>
            Click <strong>Copy</strong> on any section to copy it to your
            clipboard.
          </li>
          <li>
            If the token is invalid, an error message will explain what went
            wrong.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Features
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Decode JWT header and payload to pretty-printed JSON</li>
          <li>Display the raw signature string</li>
          <li>Copy individual sections to clipboard</li>
          <li>Clear error messages for malformed tokens</li>
          <li>
            Works entirely in your browser &mdash; no data is sent to any server
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
          Important Note
        </h2>
        <p>
          This tool <strong>decodes</strong> JWTs but does not{" "}
          <strong>verify</strong> signatures. Never paste production tokens
          containing sensitive data into any online tool. This decoder runs
          entirely client-side and never transmits your token.
        </p>
      </section>

        <RelatedTools
          slugs={["base64-encoder", "json-formatter"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
