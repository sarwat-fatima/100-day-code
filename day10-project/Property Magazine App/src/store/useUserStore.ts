"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type HistoryItem = { slug: string; progress: number; updatedAt: number };

export const useUserStore = create<{
  bookmarks: string[];
  readingHistory: HistoryItem[];
  addBookmark: (slug: string) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  upsertProgress: (slug: string, progress: number) => void;
}>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      readingHistory: [],
      addBookmark: (slug) => set((s) => ({ bookmarks: s.bookmarks.includes(slug) ? s.bookmarks : [...s.bookmarks, slug] })),
      removeBookmark: (slug) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b !== slug) })),
      isBookmarked: (slug) => get().bookmarks.includes(slug),
      upsertProgress: (slug, progress) =>
        set((s) => {
          const now = Date.now();
          const existing = s.readingHistory.find((h) => h.slug === slug);
          const next = existing
            ? s.readingHistory.map((h) => (h.slug === slug ? { ...h, progress, updatedAt: now } : h))
            : [{ slug, progress, updatedAt: now }, ...s.readingHistory];
          return { readingHistory: next.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 50) };
        })
    }),
    { name: "property-magazine-user" }
  )
);

