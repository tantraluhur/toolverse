"use client";

import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({
  label,
  id,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        spellCheck={false}
        className={`w-full resize-y rounded-md border border-zinc-300 bg-white p-3 font-mono text-base leading-relaxed text-zinc-900 placeholder-zinc-400 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm sm:leading-normal dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 ${className}`}
        {...props}
      />
    </div>
  );
}
