"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Braces,
  QrCode,
  KeyRound,
  Cake,
  Merge,
  Scissors,
  ImageUp,
  FileImage,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Slide {
  slug: string;
  Icon: LucideIcon;
  name: string;
  tagline: string;
  gradient: string;
  section: "popular" | "new";
}

const slides: Slide[] = [
  // New — show first on load
  {
    slug: "pdf-merge",
    Icon: Merge,
    name: "PDF Merge",
    tagline: "Combine multiple PDFs into one",
    gradient: "from-red-500 to-rose-600",
    section: "new",
  },
  {
    slug: "pdf-split",
    Icon: Scissors,
    name: "PDF Split",
    tagline: "Extract the pages you need",
    gradient: "from-orange-500 to-orange-600",
    section: "new",
  },
  {
    slug: "image-to-pdf",
    Icon: ImageUp,
    name: "Image to PDF",
    tagline: "Photos to PDF instantly",
    gradient: "from-indigo-500 to-indigo-600",
    section: "new",
  },
  {
    slug: "pdf-to-image",
    Icon: FileImage,
    name: "PDF to Image",
    tagline: "Pages to PNG or JPG",
    gradient: "from-violet-500 to-purple-600",
    section: "new",
  },
  // Popular
  {
    slug: "json-formatter",
    Icon: Braces,
    name: "JSON Formatter",
    tagline: "Paste ugly JSON, get pretty JSON",
    gradient: "from-blue-500 to-blue-600",
    section: "popular",
  },
  {
    slug: "qr-code-generator",
    Icon: QrCode,
    name: "QR Generator",
    tagline: "Text or URL to QR in seconds",
    gradient: "from-emerald-500 to-emerald-600",
    section: "popular",
  },
  {
    slug: "password-generator",
    Icon: KeyRound,
    name: "Password Gen",
    tagline: "Passwords hackers will hate",
    gradient: "from-amber-500 to-amber-600",
    section: "popular",
  },
  {
    slug: "age-calculator",
    Icon: Cake,
    name: "Age Calculator",
    tagline: "How many days have you lived?",
    gradient: "from-pink-500 to-pink-600",
    section: "popular",
  },
];

const CARD_WIDTH = 260;
const CARD_GAP = 180;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [paused, next]);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    setPaused(false);
  }

  // Circular offset
  function getOffset(index: number): number {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }

  // Current section label
  const currentSlide = slides[active];

  return (
    <div
      className="mx-auto mt-8 w-full max-w-4xl select-none sm:mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section indicator */}
      <div className="mb-4 flex items-center justify-center gap-6">
        <SectionLabel
          icon={<Star className="h-3 w-3" />}
          label="Popular"
          active={currentSlide.section === "popular"}
          color="text-accent-purple"
          bg="bg-accent-purple/15"
        />
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
        <SectionLabel
          icon={<Sparkles className="h-3 w-3" />}
          label="New"
          active={currentSlide.section === "new"}
          color="text-accent-cyan"
          bg="bg-accent-cyan/15"
          pulse
        />
      </div>

      {/* Carousel viewport */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="mx-auto h-[190px] sm:h-[210px]">
          {slides.map((slide, i) => {
            const offset = getOffset(i);
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            if (absOffset > 3) return null;

            const tx = offset * CARD_GAP;
            const scale = isActive ? 1 : Math.max(0.72, 1 - absOffset * 0.14);
            const opacity = isActive ? 1 : Math.max(0.25, 1 - absOffset * 0.35);
            const zIndex = 20 - absOffset;
            const rotateY = offset * -2;

            return (
              <div
                key={slide.slug}
                className="absolute left-1/2 top-1/2 will-change-transform"
                style={{
                  width: `${CARD_WIDTH}px`,
                  transform: `translate(-50%, -50%) translateX(${tx}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex,
                  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                  pointerEvents: absOffset <= 1 ? "auto" : "none",
                }}
              >
                {isActive ? (
                  <Link href={`/${slide.slug}`}>
                    <SlideCard slide={slide} focused />
                  </Link>
                ) : (
                  <button
                    onClick={() => goTo(i)}
                    className="w-full cursor-pointer text-left"
                  >
                    <SlideCard slide={slide} focused={false} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all hover:border-accent-purple/40 hover:text-accent-purple active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-accent-purple/30 dark:hover:text-accent-cyan"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dots grouped by section */}
        <div className="flex items-center gap-1">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`cursor-pointer rounded-full transition-all duration-300 ${
                i === active
                  ? slide.section === "popular"
                    ? "h-2.5 w-6 bg-accent-purple"
                    : "h-2.5 w-6 bg-accent-cyan"
                  : "h-2 w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600"
              }`}
              aria-label={`${slide.name}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all hover:border-accent-purple/40 hover:text-accent-purple active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-accent-purple/30 dark:hover:text-accent-cyan"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// --- Section label ---

function SectionLabel({
  icon,
  label,
  active,
  color,
  bg,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  color: string;
  bg: string;
  pulse?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 transition-all duration-300 ${
        active ? "opacity-100" : "opacity-40"
      }`}
    >
      <span
        className={`relative flex h-5 w-5 items-center justify-center rounded-full ${
          active ? bg : "bg-zinc-100 dark:bg-zinc-800"
        } ${active ? color : "text-zinc-400 dark:text-zinc-500"}`}
      >
        {active && (
          <span className={`absolute inset-0 animate-ping rounded-full ${pulse ? "bg-accent-cyan/30" : "bg-accent-purple/30"}`} />
        )}
        {icon}
      </span>
      <span
        className={`text-sm font-bold tracking-wide ${
          active
            ? `${color}`
            : "text-zinc-400 dark:text-zinc-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// --- Slide card ---

function SlideCard({ slide, focused }: { slide: Slide; focused: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-gradient-to-br ${slide.gradient} transition-shadow duration-300 ${
        focused
          ? "p-5 shadow-2xl ring-2 ring-white/20 sm:p-6"
          : "p-4 shadow-lg sm:p-5"
      }`}
    >
      {/* Badge */}
      <span
        className={`mb-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
          focused ? "bg-white/25 text-white" : "bg-white/15 text-white/70"
        }`}
      >
        {slide.section === "popular" ? (
          <Star className="h-2.5 w-2.5" fill="currentColor" />
        ) : (
          <Sparkles className="h-2.5 w-2.5" />
        )}
        {slide.section === "popular" ? "Popular" : "New"}
      </span>

      {/* Icon + Content */}
      <div className="flex items-start gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 ${
            focused ? "h-12 w-12" : "h-10 w-10"
          }`}
        >
          <slide.Icon
            className={`text-white transition-all ${focused ? "h-6 w-6" : "h-5 w-5"}`}
            strokeWidth={1.8}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3
            className={`font-bold text-white transition-all ${
              focused ? "text-base sm:text-lg" : "text-sm"
            }`}
          >
            {slide.name}
          </h3>
          <p
            className={`leading-relaxed text-white/70 transition-all ${
              focused ? "mt-0.5 text-sm" : "mt-0 text-xs"
            }`}
          >
            {slide.tagline}
          </p>
        </div>
      </div>

      {/* CTA — only on focused */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          focused ? "mt-3 max-h-10 opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Try it now
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
