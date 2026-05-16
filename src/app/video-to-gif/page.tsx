import type { Metadata } from "next";
import VideoToGif from "./video-to-gif";
import RelatedTools from "@/components/layout/RelatedTools";
import JsonLd, { toolJsonLd } from "@/components/layout/JsonLd";
import TrackVisit from "@/components/layout/TrackVisit";

export const metadata: Metadata = {
  title: "Video to GIF Converter Online - Free MP4 to GIF",
  description:
    "Convert MP4, MOV, or WebM videos to animated GIFs online for free. Trim the clip, choose FPS, resolution, and quality. Fast, private, and works entirely in your browser.",
  alternates: {
    canonical: "https://toolverse.web.id/video-to-gif",
  },
};

export default function VideoToGifPage() {
  return (
    <>
      <JsonLd
        data={toolJsonLd({
          name: "Video to GIF Converter Online",
          description:
            "Convert MP4, MOV, or WebM videos to animated GIFs online for free. Trim the clip, choose FPS, resolution, and quality. 100% client-side.",
          url: "https://toolverse.web.id/video-to-gif",
        })}
      />
      <TrackVisit slug="video-to-gif" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Video to GIF Converter
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 sm:mt-2 sm:text-base dark:text-zinc-400">
          Upload a video, trim the section you want, pick quality, and export an
          animated GIF. Everything runs in your browser &mdash; your video never
          leaves your device.
        </p>

        <div className="mt-4 sm:mt-6">
          <VideoToGif />
        </div>

        <section className="mt-8 space-y-5 text-sm leading-relaxed text-zinc-700 sm:mt-12 sm:space-y-6 sm:text-base dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Why Convert Video to GIF?
          </h2>
          <p>
            GIFs are universally supported, autoplay everywhere, and don&apos;t
            need a player. Perfect for chat reactions, bug-report recordings,
            tutorials embedded in docs, and quick product demos that don&apos;t
            warrant a full video player.
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            How to Use This Tool
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Upload an MP4, MOV, or WebM file.</li>
            <li>
              Set the start and end time of the clip you want to convert.
            </li>
            <li>
              Pick FPS, resolution, and quality. Lower values make smaller files.
            </li>
            <li>
              Click <strong>Generate GIF</strong> and watch the progress bar.
            </li>
            <li>Preview the result and download.</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Tips for Smaller GIFs
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Keep clips under 5 seconds when possible</li>
            <li>Use 360p or 480p &mdash; full-resolution GIFs are huge</li>
            <li>10&ndash;15 FPS is plenty for most screen recordings</li>
            <li>Low or Medium quality is usually fine for chat-sized GIFs</li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Features
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Supports MP4, MOV, and WebM input</li>
            <li>Visual trim with start / end sliders</li>
            <li>FPS, resolution, and quality controls</li>
            <li>Speed adjustment and reverse playback</li>
            <li>Loop toggle (infinite or play once)</li>
            <li>Live progress bar during encoding</li>
            <li>
              100% client-side &mdash; no upload to a server, no account needed
            </li>
          </ul>
        </section>

        <RelatedTools
          slugs={["image-converter", "image-resizer", "image-watermarker"]}
          className="mt-8 sm:mt-12"
        />
      </div>
    </>
  );
}
