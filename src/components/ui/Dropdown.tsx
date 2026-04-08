"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  id?: string;
  label?: string;
  options: DropdownOption[];
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

export default function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  searchable = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => String(o.value) === String(value));
  const selectedIndex = selected
    ? options.findIndex((o) => o.value === selected.value)
    : -1;

  // Filter options when searchable
  const filteredOptions = searchable && search.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Reset highlight when opening, focus search
  useEffect(() => {
    if (open) {
      const idx = filteredOptions.findIndex(
        (o) => String(o.value) === String(value),
      );
      setHighlightedIndex(idx >= 0 ? idx : 0);
      if (searchable) {
        setTimeout(() => searchRef.current?.focus(), 0);
      }
    } else {
      setSearch("");
    }
  }, [open, searchable, filteredOptions, value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const listbox = listboxRef.current;
    if (!listbox) return;
    const item = listbox.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [open, highlightedIndex]);

  const handleSelect = useCallback(
    (opt: DropdownOption) => {
      onChange?.(opt.value);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case " ":
        if (!searchable) {
          e.preventDefault();
          if (!open) setOpen(true);
          else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSearch("");
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : undefined}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={!searchable ? handleKeyDown : undefined}
        className="flex w-full cursor-pointer items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-left text-sm text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
      >
        <span
          className={`truncate ${selected ? "" : "text-zinc-400 dark:text-zinc-500"}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {/* Search input */}
          {searchable && (
            <div className="border-b border-zinc-100 p-2 dark:border-zinc-800">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="px-3 py-3 text-center text-sm text-zinc-400 dark:text-zinc-500">
              No results found
            </div>
          ) : (
            <ul
              id={id ? `${id}-listbox` : undefined}
              ref={listboxRef}
              role="listbox"
              className="max-h-60 overflow-auto py-1"
            >
              {filteredOptions.map((opt, i) => {
                const isSelected = String(opt.value) === String(value);
                const isHighlighted = i === highlightedIndex;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    onClick={() => handleSelect(opt)}
                    className={`flex cursor-pointer items-center px-3 py-2 text-sm transition-colors ${
                      isHighlighted
                        ? "bg-accent-purple/10 text-accent-purple dark:bg-accent-purple/15 dark:text-accent-cyan"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && <CheckIcon />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`ml-2 h-4 w-4 shrink-0 text-zinc-500 transition-transform dark:text-zinc-400 ${open ? "rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent-purple dark:text-accent-cyan"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}
