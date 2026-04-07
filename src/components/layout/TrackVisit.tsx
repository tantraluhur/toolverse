"use client";

import { useEffect } from "react";

const RECENT_KEY = "toolverse_recent";
const MAX_RECENT = 5;

export default function TrackVisit({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const recent: string[] = raw ? JSON.parse(raw) : [];
      const updated = [slug, ...recent.filter((s) => s !== slug)].slice(
        0,
        MAX_RECENT,
      );
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available
    }
  }, [slug]);

  return null;
}
