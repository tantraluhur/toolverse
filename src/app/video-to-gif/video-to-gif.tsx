"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Alert from "@/components/ui/Alert";

// ---------- Types ----------

type Quality = "low" | "medium" | "high";
type Resolution = "original" | "720" | "480" | "360";

interface VideoMeta {
  duration: number;
  width: number;
  height: number;
  name: string;
}

// ---------- Constants ----------

const QUALITY_COLORS: Record<Quality, number> = {
  low: 64,
  medium: 128,
  high: 256,
};

const FPS_OPTIONS = [
  { label: "5 FPS (smallest)", value: "5" },
  { label: "10 FPS", value: "10" },
  { label: "15 FPS", value: "15" },
  { label: "20 FPS", value: "20" },
  { label: "24 FPS", value: "24" },
];

const RESOLUTION_OPTIONS: { label: string; value: Resolution }[] = [
  { label: "Original", value: "original" },
  { label: "720p", value: "720" },
  { label: "480p", value: "480" },
  { label: "360p", value: "360" },
];

const QUALITY_OPTIONS: { label: string; value: Quality }[] = [
  { label: "Low (64 colors)", value: "low" },
  { label: "Medium (128 colors)", value: "medium" },
  { label: "High (256 colors)", value: "high" },
];

const SPEED_OPTIONS = [
  { label: "0.5×", value: "0.5" },
  { label: "1×", value: "1" },
  { label: "1.5×", value: "1.5" },
  { label: "2×", value: "2" },
];

const MAX_DURATION_SECONDS = 30; // Soft cap to protect memory

// ---------- Utils ----------

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function formatTime(t: number): string {
  if (!isFinite(t)) return "0:00.0";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.floor((t - Math.floor(t)) * 10);
  return `${m}:${s.toString().padStart(2, "0")}.${ms}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function computeOutputSize(
  meta: VideoMeta,
  resolution: Resolution,
): { w: number; h: number } {
  if (resolution === "original") {
    return { w: meta.width, h: meta.height };
  }
  const targetShort = Number(resolution); // 720 / 480 / 360
  const isPortrait = meta.height > meta.width;
  const shortSide = isPortrait ? meta.width : meta.height;
  if (shortSide <= targetShort) return { w: meta.width, h: meta.height };
  const ratio = targetShort / shortSide;
  return {
    w: Math.round(meta.width * ratio / 2) * 2,
    h: Math.round(meta.height * ratio / 2) * 2,
  };
}

function estimateGifBytes(
  frames: number,
  w: number,
  h: number,
  quality: Quality,
): number {
  // Very rough heuristic. LZW compression ratio varies wildly.
  const colorFactor = quality === "low" ? 0.25 : quality === "medium" ? 0.45 : 0.7;
  return Math.round(frames * w * h * colorFactor);
}

// Seek a video element to a target time and resolve when frame is rendered.
function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {
      video.removeEventListener("seeked", handler);
      // Wait one rAF so the frame is actually painted to the video element
      requestAnimationFrame(() => resolve());
    };
    video.addEventListener("seeked", handler);
    video.currentTime = time;
  });
}

// Yield to the event loop so the UI stays responsive
function yieldToMain(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

// ---------- Component ----------

export default function VideoToGif() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  const [fps, setFps] = useState(10);
  const [resolution, setResolution] = useState<Resolution>("480");
  const [quality, setQuality] = useState<Quality>("medium");
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [reverse, setReverse] = useState(false);

  const [encoding, setEncoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelRef = useRef(false);

  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ----- Derived -----

  const clipDuration = Math.max(0, trimEnd - trimStart);
  const outSize = useMemo(
    () => (meta ? computeOutputSize(meta, resolution) : { w: 0, h: 0 }),
    [meta, resolution],
  );
  const frameCount = Math.max(1, Math.round(clipDuration * fps));
  const estimatedBytes = useMemo(
    () => estimateGifBytes(frameCount, outSize.w, outSize.h, quality),
    [frameCount, outSize.w, outSize.h, quality],
  );

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
    // We only want to revoke when the component unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- File handling -----

  const acceptVideo = useCallback((file: File) => {
    setError(null);
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      setGifUrl(null);
    }
    if (fileUrl) URL.revokeObjectURL(fileUrl);

    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file (MP4, MOV, or WebM).");
      return;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setMeta(null);
    setTrimStart(0);
    setTrimEnd(0);

    // Load metadata via a temporary off-DOM video element
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.muted = true;
    probe.src = url;
    probe.onloadedmetadata = () => {
      const duration = isFinite(probe.duration) ? probe.duration : 0;
      setMeta({
        duration,
        width: probe.videoWidth,
        height: probe.videoHeight,
        name: file.name,
      });
      setTrimStart(0);
      setTrimEnd(Math.min(duration, MAX_DURATION_SECONDS));
    };
    probe.onerror = () => {
      setError(
        "Could not read this video. Try a different file (MP4 or WebM work best).",
      );
    };
  }, [fileUrl, gifUrl]);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) acceptVideo(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptVideo(file);
  }

  function handleReplace() {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setGifUrl(null);
    setFileUrl(null);
    setMeta(null);
    setError(null);
    setProgress(0);
  }

  // ----- Trim handlers -----

  function updateTrimStart(v: number) {
    if (!meta) return;
    const newStart = clamp(v, 0, meta.duration);
    setTrimStart(newStart);
    if (newStart >= trimEnd) {
      setTrimEnd(Math.min(meta.duration, newStart + 0.1));
    }
    if (videoRef.current) {
      videoRef.current.currentTime = newStart;
    }
  }

  function updateTrimEnd(v: number) {
    if (!meta) return;
    const newEnd = clamp(v, 0, meta.duration);
    setTrimEnd(newEnd);
    if (newEnd <= trimStart) {
      setTrimStart(Math.max(0, newEnd - 0.1));
    }
    if (videoRef.current) {
      videoRef.current.currentTime = newEnd;
    }
  }

  // ----- Encoding -----

  const handleGenerate = useCallback(async () => {
    if (!meta || !fileUrl) return;
    if (clipDuration <= 0) {
      setError("Select a clip with a duration greater than 0.");
      return;
    }
    if (clipDuration > MAX_DURATION_SECONDS) {
      setError(
        `Clip is too long. Maximum is ${MAX_DURATION_SECONDS} seconds to keep things snappy.`,
      );
      return;
    }
    setError(null);
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      setGifUrl(null);
    }
    setEncoding(true);
    setProgress(0);
    cancelRef.current = false;

    // Dynamic import keeps gifenc out of the initial bundle
    const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

    // Off-DOM video for frame extraction so we don't interrupt the preview
    const video = document.createElement("video");
    video.src = fileUrl;
    video.muted = true;
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.preload = "auto";

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Failed to load video"));
    });

    const { w, h } = computeOutputSize(meta, resolution);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setEncoding(false);
      setError("Your browser does not support canvas 2D context.");
      return;
    }

    const gif = GIFEncoder();
    const totalFrames = Math.max(1, Math.round(clipDuration * fps));
    const effectiveDuration = clipDuration / speed;
    const delayMs = Math.max(20, Math.round((effectiveDuration * 1000) / totalFrames));

    try {
      for (let i = 0; i < totalFrames; i++) {
        if (cancelRef.current) {
          setEncoding(false);
          setProgress(0);
          return;
        }
        const sourceIndex = reverse ? totalFrames - 1 - i : i;
        const t = trimStart + (sourceIndex / Math.max(1, totalFrames - 1)) * clipDuration;
        await seekTo(video, clamp(t, trimStart, trimEnd));

        ctx.drawImage(video, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        const palette = quantize(data, QUALITY_COLORS[quality]);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, w, h, { palette, delay: delayMs });

        setProgress(Math.round(((i + 1) / totalFrames) * 100));
        await yieldToMain();
      }

      gif.finish();
      const buffer = gif.bytes();
      const blob = new Blob([buffer.buffer as ArrayBuffer], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      setGifSize(blob.size);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Encoding failed: ${err.message}`
          : "Encoding failed.",
      );
    } finally {
      setEncoding(false);
    }
  }, [
    meta,
    fileUrl,
    gifUrl,
    clipDuration,
    fps,
    resolution,
    quality,
    speed,
    reverse,
    trimStart,
    trimEnd,
  ]);

  function handleCancel() {
    cancelRef.current = true;
  }

  function handleDownload() {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = `toolverse_video_${outSize.w}x${outSize.h}_${fps}fps.gif`;
    a.click();
  }

  // ----- Render: empty state -----

  if (!fileUrl || !meta) {
    return (
      <div className="space-y-3">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragOver
              ? "border-accent-purple bg-accent-purple/5"
              : "border-zinc-300 bg-zinc-50 hover:border-accent-purple/60 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-accent-purple/40 dark:hover:bg-zinc-800"
          }`}
        >
          <UploadIcon />
          <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Drop a video here, or click to choose a file
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            MP4, MOV, or WebM &middot; up to {MAX_DURATION_SECONDS}s recommended
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/*"
          className="hidden"
          onChange={handleFileInput}
        />
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    );
  }

  // ----- Render: workspace -----

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Preview + trim */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-black dark:border-zinc-700">
          <video
            ref={videoRef}
            src={fileUrl}
            controls
            playsInline
            muted
            className="block max-h-[60vh] w-full"
          />
        </div>

        <TrimSlider
          duration={meta.duration}
          start={trimStart}
          end={trimEnd}
          onChangeStart={updateTrimStart}
          onChangeEnd={updateTrimEnd}
        />

        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {meta.width} × {meta.height} px
          </span>
          <span>&middot;</span>
          <span>
            Source duration: {formatTime(meta.duration)}
          </span>
          <span>&middot;</span>
          <span>
            Clip: {formatTime(clipDuration)} ({frameCount} frames)
          </span>
          <span>&middot;</span>
          <span>Output: {outSize.w} × {outSize.h}</span>
        </div>

        {clipDuration > MAX_DURATION_SECONDS && (
          <Alert variant="warning">
            Clip is longer than {MAX_DURATION_SECONDS}s. Long GIFs can crash the
            browser &mdash; please trim it down.
          </Alert>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {!encoding && (
            <>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={clipDuration <= 0 || clipDuration > MAX_DURATION_SECONDS}
              >
                Generate GIF
              </Button>
              <Button variant="outline" onClick={handleReplace}>
                Replace Video
              </Button>
            </>
          )}
          {encoding && (
            <Button variant="danger" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>

        {encoding && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Encoding frames…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="brand-gradient h-full transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Result */}
        {gifUrl && !encoding && (
          <div className="space-y-3 rounded-md border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              GIF ready &middot; {formatBytes(gifSize)}
            </p>
            <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gifUrl}
                alt="Generated GIF preview"
                className="block max-h-[400px] w-full object-contain"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <Button variant="primary" onClick={handleDownload}>
              Download GIF
            </Button>
          </div>
        )}
      </div>

      {/* Controls panel */}
      <div className="space-y-5 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <Dropdown
          label="Resolution"
          options={RESOLUTION_OPTIONS}
          value={resolution}
          onChange={(v) => setResolution(v as Resolution)}
        />
        <Dropdown
          label="FPS"
          options={FPS_OPTIONS}
          value={String(fps)}
          onChange={(v) => setFps(Number(v))}
        />
        <Dropdown
          label="Quality"
          options={QUALITY_OPTIONS}
          value={quality}
          onChange={(v) => setQuality(v as Quality)}
        />
        <Dropdown
          label="Speed"
          options={SPEED_OPTIONS}
          value={String(speed)}
          onChange={(v) => setSpeed(Number(v))}
        />

        <div className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <Input
            id="v2g-loop"
            type="checkbox"
            label="Loop infinitely"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          <Input
            id="v2g-reverse"
            type="checkbox"
            label="Reverse playback"
            checked={reverse}
            onChange={(e) => setReverse(e.target.checked)}
          />
        </div>

        <div className="rounded-md bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50">
          <div className="font-medium text-zinc-700 dark:text-zinc-300">
            Estimated GIF size
          </div>
          <div className="mt-0.5 text-zinc-500 dark:text-zinc-400">
            ~{formatBytes(estimatedBytes)} &middot; {frameCount} frames
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Estimate only. Real size depends on the content &mdash; flat colors
            compress much better than detailed footage.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function TrimSlider({
  duration,
  start,
  end,
  onChangeStart,
  onChangeEnd,
}: {
  duration: number;
  start: number;
  end: number;
  onChangeStart: (v: number) => void;
  onChangeEnd: (v: number) => void;
}) {
  const startPct = duration > 0 ? (start / duration) * 100 : 0;
  const endPct = duration > 0 ? (end / duration) * 100 : 100;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <span>Trim</span>
        <span className="font-mono">
          {formatTime(start)} &rarr; {formatTime(end)}
        </span>
      </div>
      <div className="relative h-9">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        {/* Selected range */}
        <div
          className="brand-gradient absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{ left: `${startPct}%`, right: `${100 - endPct}%` }}
        />
        {/* Two range inputs overlapping the track */}
        <input
          type="range"
          min={0}
          max={duration}
          step={0.05}
          value={start}
          onChange={(e) => onChangeStart(Number(e.target.value))}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-accent-purple [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent-purple"
        />
        <input
          type="range"
          min={0}
          max={duration}
          step={0.05}
          value={end}
          onChange={(e) => onChangeEnd(Number(e.target.value))}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent-cyan"
        />
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5m0 0L7.5 12M12 7.5v9"
      />
    </svg>
  );
}
