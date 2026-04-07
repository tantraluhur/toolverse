"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

// --- Diff algorithm ---

type LineType = "equal" | "added" | "removed";

interface DiffOp {
  type: LineType;
  text: string;
}

function lcs(a: string[], b: string[]): DiffOp[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: DiffOp[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({ type: "equal", text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "added", text: b[j - 1] });
      j--;
    } else {
      result.push({ type: "removed", text: a[i - 1] });
      i--;
    }
  }
  return result.reverse();
}

// Character-level diff for inline highlighting
interface CharSpan {
  text: string;
  highlight: boolean;
}

function charDiff(a: string, b: string): { left: CharSpan[]; right: CharSpan[] } {
  const charsA = a.split("");
  const charsB = b.split("");
  const m = charsA.length;
  const n = charsB.length;

  // For very long lines, skip char diff to avoid performance issues
  if (m * n > 50000) {
    return {
      left: [{ text: a, highlight: true }],
      right: [{ text: b, highlight: true }],
    };
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        charsA[i - 1] === charsB[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack to find which chars are common
  const commonA = new Set<number>();
  const commonB = new Set<number>();
  let ci = m;
  let cj = n;
  while (ci > 0 && cj > 0) {
    if (charsA[ci - 1] === charsB[cj - 1]) {
      commonA.add(ci - 1);
      commonB.add(cj - 1);
      ci--;
      cj--;
    } else if (dp[ci - 1][cj] >= dp[ci][cj - 1]) {
      ci--;
    } else {
      cj--;
    }
  }

  function buildSpans(chars: string[], common: Set<number>): CharSpan[] {
    const spans: CharSpan[] = [];
    for (let k = 0; k < chars.length; k++) {
      const highlight = !common.has(k);
      if (spans.length > 0 && spans[spans.length - 1].highlight === highlight) {
        spans[spans.length - 1].text += chars[k];
      } else {
        spans.push({ text: chars[k], highlight });
      }
    }
    return spans;
  }

  return {
    left: buildSpans(charsA, commonA),
    right: buildSpans(charsB, commonB),
  };
}

// --- Build side-by-side rows ---

interface DiffRow {
  leftNum: number | null;
  leftText: string | null;
  leftType: "equal" | "removed" | "empty";
  rightNum: number | null;
  rightText: string | null;
  rightType: "equal" | "added" | "empty";
  charLeft?: CharSpan[];
  charRight?: CharSpan[];
}

function buildRows(ops: DiffOp[]): DiffRow[] {
  const rows: DiffRow[] = [];
  let leftNum = 0;
  let rightNum = 0;
  let i = 0;

  while (i < ops.length) {
    const op = ops[i];

    if (op.type === "equal") {
      leftNum++;
      rightNum++;
      rows.push({
        leftNum,
        leftText: op.text,
        leftType: "equal",
        rightNum,
        rightText: op.text,
        rightType: "equal",
      });
      i++;
    } else {
      // Collect consecutive removed + added as a paired block
      const removed: string[] = [];
      const added: string[] = [];
      while (i < ops.length && ops[i].type === "removed") {
        removed.push(ops[i].text);
        i++;
      }
      while (i < ops.length && ops[i].type === "added") {
        added.push(ops[i].text);
        i++;
      }

      const maxLen = Math.max(removed.length, added.length);
      for (let k = 0; k < maxLen; k++) {
        const hasLeft = k < removed.length;
        const hasRight = k < added.length;

        if (hasLeft) leftNum++;
        if (hasRight) rightNum++;

        const row: DiffRow = {
          leftNum: hasLeft ? leftNum : null,
          leftText: hasLeft ? removed[k] : null,
          leftType: hasLeft ? "removed" : "empty",
          rightNum: hasRight ? rightNum : null,
          rightText: hasRight ? added[k] : null,
          rightType: hasRight ? "added" : "empty",
        };

        // Add character-level diff when both sides have content
        if (hasLeft && hasRight) {
          const cd = charDiff(removed[k], added[k]);
          row.charLeft = cd.left;
          row.charRight = cd.right;
        }

        rows.push(row);
      }
    }
  }

  return rows;
}

// --- Styles ---

const sideBg: Record<string, string> = {
  equal: "",
  removed: "bg-red-50 dark:bg-red-950/30",
  added: "bg-green-50 dark:bg-green-950/30",
  empty: "bg-zinc-50 dark:bg-zinc-900/50",
};

const sideText: Record<string, string> = {
  equal: "text-zinc-800 dark:text-zinc-200",
  removed: "text-red-900 dark:text-red-200",
  added: "text-green-900 dark:text-green-200",
  empty: "",
};

const numText: Record<string, string> = {
  equal: "text-zinc-400 dark:text-zinc-600",
  removed: "text-red-400 dark:text-red-500",
  added: "text-green-400 dark:text-green-500",
  empty: "",
};

// --- Component ---

export default function TextCompare() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const rows = useMemo(() => {
    if (!original && !modified) return null;
    const ops = lcs(original.split("\n"), modified.split("\n"));
    return buildRows(ops);
  }, [original, modified]);

  const stats = useMemo(() => {
    if (!rows) return null;
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (const r of rows) {
      if (r.leftType === "removed") removed++;
      if (r.rightType === "added") added++;
      if (r.leftType === "equal") unchanged++;
    }
    return { added, removed, unchanged };
  }, [rows]);

  function handleClear() {
    setOriginal("");
    setModified("");
  }

  function handleSwap() {
    setOriginal(modified);
    setModified(original);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Inputs */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Textarea
          id="text-original"
          label="Original"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          placeholder="Paste original text here..."
          className="h-40 sm:h-56"
        />
        <Textarea
          id="text-modified"
          label="Modified"
          value={modified}
          onChange={(e) => setModified(e.target.value)}
          placeholder="Paste modified text here..."
          className="h-40 sm:h-56"
        />
      </div>

      {/* Actions + Stats */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={() => {}}>
          Compare
        </Button>
        <Button variant="outline" onClick={handleSwap}>
          Swap
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>

        {stats && (
          <div className="ml-auto flex gap-3 text-sm">
            <span className="text-green-600 dark:text-green-400">
              +{stats.added}
            </span>
            <span className="text-red-600 dark:text-red-400">
              -{stats.removed}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {stats.unchanged} same
            </span>
          </div>
        )}
      </div>

      {/* Side-by-side diff */}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-700">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <th className="w-10 bg-zinc-50 px-2 py-1.5 text-right font-medium dark:bg-zinc-900">
                  #
                </th>
                <th className="bg-zinc-50 px-3 py-1.5 text-left font-medium dark:bg-zinc-900">
                  Original
                </th>
                <th className="w-10 border-l border-zinc-200 bg-zinc-50 px-2 py-1.5 text-right font-medium dark:border-zinc-700 dark:bg-zinc-900">
                  #
                </th>
                <th className="bg-zinc-50 px-3 py-1.5 text-left font-medium dark:bg-zinc-900">
                  Modified
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800">
                  {/* Left line number */}
                  <td
                    className={`w-10 select-none border-r border-zinc-200 px-2 py-0.5 text-right dark:border-zinc-700 ${numText[row.leftType]} ${sideBg[row.leftType]}`}
                  >
                    {row.leftNum ?? ""}
                  </td>
                  {/* Left content */}
                  <td
                    className={`whitespace-pre-wrap break-all px-3 py-0.5 ${sideBg[row.leftType]} ${sideText[row.leftType]}`}
                  >
                    {row.leftText !== null ? (
                      row.charLeft ? (
                        <InlineHighlight spans={row.charLeft} side="left" />
                      ) : (
                        row.leftText || "\u00A0"
                      )
                    ) : (
                      ""
                    )}
                  </td>
                  {/* Right line number */}
                  <td
                    className={`w-10 select-none border-l border-r border-zinc-200 px-2 py-0.5 text-right dark:border-zinc-700 ${numText[row.rightType]} ${sideBg[row.rightType]}`}
                  >
                    {row.rightNum ?? ""}
                  </td>
                  {/* Right content */}
                  <td
                    className={`whitespace-pre-wrap break-all px-3 py-0.5 ${sideBg[row.rightType]} ${sideText[row.rightType]}`}
                  >
                    {row.rightText !== null ? (
                      row.charRight ? (
                        <InlineHighlight spans={row.charRight} side="right" />
                      ) : (
                        row.rightText || "\u00A0"
                      )
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InlineHighlight({
  spans,
  side,
}: {
  spans: CharSpan[];
  side: "left" | "right";
}) {
  const hlClass =
    side === "left"
      ? "bg-red-200 dark:bg-red-800/60 rounded-sm"
      : "bg-green-200 dark:bg-green-800/60 rounded-sm";

  return (
    <>
      {spans.map((span, i) =>
        span.highlight ? (
          <mark key={i} className={hlClass}>
            {span.text}
          </mark>
        ) : (
          <span key={i}>{span.text}</span>
        ),
      )}
    </>
  );
}
