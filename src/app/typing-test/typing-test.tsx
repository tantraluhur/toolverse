"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog near the riverbank. It was a beautiful morning with clear skies and a gentle breeze flowing through the tall grass. Birds chirped softly in the distance as the sun rose above the horizon.",
  "Programming is the art of telling a computer what to do through a sequence of instructions. Every great software application begins as an idea that someone transforms into working code. The best programmers write code that humans can understand.",
  "The ocean waves crashed against the rocky shore as seagulls circled overhead. A lone sailboat drifted across the calm waters beyond the breakers. The salty air carried the scent of adventure and the promise of distant shores waiting to be explored.",
  "Technology continues to reshape how we live, work, and communicate with each other. From smartphones to artificial intelligence, the pace of innovation shows no signs of slowing down. Adapting to these changes requires curiosity and a willingness to learn.",
  "Music has the power to transport us to different times and places in our memories. A single melody can evoke emotions we thought were long forgotten. Whether classical or modern, the universal language of music connects people across all cultures and generations.",
  "The ancient library contained thousands of manuscripts collected over centuries by scholars from around the world. Each book held knowledge that had survived wars, fires, and the passage of time. Visitors walked quietly through the towering shelves in silent reverence.",
  "Cooking is both a science and an art that brings people together around the table. The right combination of ingredients, temperature, and timing can transform simple elements into extraordinary meals. Great chefs understand that food nourishes both the body and the soul.",
  "Space exploration represents one of humanity's greatest achievements and ongoing ambitions. From the first moon landing to modern missions to Mars, we continue pushing the boundaries of what is possible. The universe holds countless mysteries still waiting to be discovered.",
];

type Status = "idle" | "running" | "finished";

export default function TypingTest() {
  const [paragraphIndex, setParagraphIndex] = useState(() => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % paragraphs.length;
  });
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const text = paragraphs[paragraphIndex];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Compute results
  const correctChars = typed
    .split("")
    .filter((ch, i) => i < text.length && ch === text[i]).length;
  const totalTyped = typed.length;
  const elapsed =
    startTime && endTime
      ? (endTime - startTime) / 1000
      : startTime
        ? (Date.now() - startTime) / 1000
        : 0;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
  const accuracy =
    totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  // Finish the test
  const finishTest = useCallback(() => {
    setStatus("finished");
    setEndTime(Date.now());
    clearTimer();
  }, [clearTimer]);

  // Countdown timer
  useEffect(() => {
    if (status === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [status, finishTest, clearTimer]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (status === "finished") return;

    const value = e.target.value;

    // Start timer on first keystroke
    if (status === "idle" && value.length > 0) {
      setStatus("running");
      setStartTime(Date.now());
    }

    setTyped(value);

    // Check if paragraph is complete
    if (value.length >= text.length) {
      setEndTime(Date.now());
      setStatus("finished");
      clearTimer();
    }
  }

  function handleTryAgain() {
    clearTimer();
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    setParagraphIndex(arr[0] % paragraphs.length);
    setTyped("");
    setStatus("idle");
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(60);
    inputRef.current?.focus();
  }

  // Prevent pasting
  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Timer bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {status === "idle" && "Start typing to begin..."}
          {status === "running" && `Time remaining: ${timeLeft}s`}
          {status === "finished" && "Test complete!"}
        </div>
        {status !== "idle" && (
          <div className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
            {correctChars}/{text.length} chars
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="brand-gradient h-full rounded-full transition-all duration-200"
          style={{ width: `${Math.min((typed.length / text.length) * 100, 100)}%` }}
        />
      </div>

      {/* Paragraph display */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-base leading-relaxed sm:p-6 sm:text-lg sm:leading-loose dark:border-zinc-700 dark:bg-zinc-900">
        {text.split("").map((char, i) => {
          let className = "text-zinc-400 dark:text-zinc-500";
          if (i < typed.length) {
            className =
              typed[i] === char
                ? "text-green-600 dark:text-green-400"
                : "rounded-sm bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";
          } else if (i === typed.length) {
            className =
              "border-b-2 border-accent-purple text-zinc-700 dark:text-zinc-300";
          }
          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input area */}
      {status !== "finished" && (
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          onPaste={handlePaste}
          placeholder="Start typing here..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="w-full resize-none rounded-md border border-zinc-300 bg-white p-3 font-mono text-base leading-relaxed text-zinc-900 placeholder-zinc-400 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm sm:leading-normal dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600"
          rows={4}
        />
      )}

      {/* Results card */}
      {status === "finished" && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-6 text-center text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            Your Results
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="brand-gradient-text text-4xl font-extrabold sm:text-5xl">
                {wpm}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                WPM
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-zinc-900 sm:text-5xl dark:text-zinc-50">
                {accuracy}%
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Accuracy
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-zinc-900 sm:text-5xl dark:text-zinc-50">
                {Math.round(elapsed)}s
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Time
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {correctChars} correct characters out of {totalTyped} typed
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" onClick={handleTryAgain}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
