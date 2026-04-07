"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";

interface Criterion {
  label: string;
  met: boolean;
}

function analyzePassword(password: string): {
  score: number;
  label: string;
  criteria: Criterion[];
} {
  const criteria: Criterion[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least 12 characters", met: password.length >= 12 },
    { label: "Contains lowercase (a-z)", met: /[a-z]/.test(password) },
    { label: "Contains uppercase (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Contains numbers (0-9)", met: /\d/.test(password) },
    {
      label: "Contains symbols (!@#...)",
      met: /[^a-zA-Z0-9]/.test(password),
    },
    { label: "No common patterns (123, abc)", met: !/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|password|qwerty)/i.test(password) },
  ];

  const metCount = criteria.filter((c) => c.met).length;
  const score = Math.round((metCount / criteria.length) * 100);

  let label = "Very Weak";
  if (score >= 85) label = "Very Strong";
  else if (score >= 70) label = "Strong";
  else if (score >= 50) label = "Moderate";
  else if (score >= 30) label = "Weak";

  return { score, label, criteria };
}

const strengthColors: Record<string, string> = {
  "Very Weak": "bg-red-500",
  Weak: "bg-orange-500",
  Moderate: "bg-yellow-500",
  Strong: "bg-green-500",
  "Very Strong": "bg-emerald-500",
};

const strengthTextColors: Record<string, string> = {
  "Very Weak": "text-red-600 dark:text-red-400",
  Weak: "text-orange-600 dark:text-orange-400",
  Moderate: "text-yellow-600 dark:text-yellow-400",
  Strong: "text-green-600 dark:text-green-400",
  "Very Strong": "text-emerald-600 dark:text-emerald-400",
};

export default function PasswordChecker() {
  const [password, setPassword] = useState("");

  const result = password ? analyzePassword(password) : null;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Input */}
      <Input
        id="pw-check-input"
        label="Enter Password"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Type a password to check its strength..."
        autoComplete="off"
        className="font-mono"
      />

      {result && (
        <>
          {/* Strength bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span
                className={`text-sm font-semibold ${strengthTextColors[result.label]}`}
              >
                {result.label}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {result.score}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strengthColors[result.label]}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Criteria checklist */}
          <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
            <ul className="space-y-2">
              {result.criteria.map((criterion) => (
                <li
                  key={criterion.label}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span
                    className={
                      criterion.met
                        ? "text-green-600 dark:text-green-400"
                        : "text-zinc-300 dark:text-zinc-600"
                    }
                  >
                    {criterion.met ? (
                      <CheckIcon />
                    ) : (
                      <CrossIcon />
                    )}
                  </span>
                  <span
                    className={
                      criterion.met
                        ? "text-zinc-800 dark:text-zinc-200"
                        : "text-zinc-400 dark:text-zinc-500"
                    }
                  >
                    {criterion.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  );
}
