"use client";

import { useState, useMemo } from "react";
import Textarea from "@/components/ui/Textarea";

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
}

function computeStats(text: string): Stats {
  if (!text.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: "0 sec",
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  const minutes = words / 200;
  let readingTime: string;
  if (minutes < 1) {
    const seconds = Math.ceil(minutes * 60);
    readingTime = `${seconds} sec`;
  } else {
    readingTime = `${Math.ceil(minutes)} min`;
  }

  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <div className="brand-gradient-text text-2xl font-bold sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-medium text-zinc-500 sm:text-sm dark:text-zinc-400">
        {label}
      </div>
    </div>
  );
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => computeStats(text), [text]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="No Spaces" value={stats.charactersNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Reading Time" value={stats.readingTime} />
      </div>

      <Textarea
        id="word-counter-input"
        label="Your Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="h-48 sm:h-80"
      />
    </div>
  );
}
