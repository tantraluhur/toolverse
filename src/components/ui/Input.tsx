"use client";

import { type InputHTMLAttributes, useRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** visual variant — default is "text" style */
  variant?: "default" | "file" | "checkbox" | "range";
}

const baseStyles =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder-zinc-400 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600";

const checkboxStyles =
  "h-4 w-4 cursor-pointer rounded border-zinc-300 accent-accent-purple";

const rangeStyles = "w-full cursor-pointer accent-accent-purple";

function resolveVariant(
  variant: InputProps["variant"],
  type: string | undefined,
): "default" | "file" | "checkbox" | "range" {
  if (variant) return variant;
  if (type === "file") return "file";
  if (type === "checkbox") return "checkbox";
  if (type === "range") return "range";
  return "default";
}

export default function Input({
  label,
  id,
  className = "",
  variant,
  type,
  ...props
}: InputProps) {
  const resolved = resolveVariant(variant, type);

  // Checkbox — inline label
  if (resolved === "checkbox") {
    return (
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
      >
        <input
          id={id}
          type="checkbox"
          className={`${checkboxStyles} ${className}`}
          {...props}
        />
        {label}
      </label>
    );
  }

  // File — custom gradient button
  if (resolved === "file") {
    return <FileInput id={id} label={label} className={className} {...props} />;
  }

  // Range
  if (resolved === "range") {
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
        <input
          id={id}
          type="range"
          className={`${rangeStyles} ${className}`}
          {...props}
        />
      </div>
    );
  }

  // Default (text, date, time, email, etc.)
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
      <input
        id={id}
        type={type}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    </div>
  );
}

// --- File input with gradient button ---

function FileInput({
  id,
  label,
  className = "",
  ...props
}: Omit<InputProps, "variant" | "type">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileNameId = id ? `${id}-name` : undefined;

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Force re-render to show file name
    const nameEl = fileNameId
      ? document.getElementById(fileNameId)
      : null;
    if (nameEl) {
      const file = e.target.files?.[0];
      nameEl.textContent = file ? file.name : "No file chosen";
    }
    // Forward original onChange
    if (props.onChange) {
      (props.onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          className="brand-gradient cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Choose File
        </button>
        <span
          id={fileNameId}
          className="truncate text-sm text-zinc-500 dark:text-zinc-400"
        >
          No file chosen
        </span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="hidden"
          {...props}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
