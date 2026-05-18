"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";

export function useBookmark(contentSlug: string) {
  const { status } = useSession();
  const isBookmarked = useUserStore((s) => s.isBookmarked(contentSlug));
  const addBookmark = useUserStore((s) => s.addBookmark);
  const removeBookmark = useUserStore((s) => s.removeBookmark);
  const [loading, setLoading] = React.useState(false);

  const toggle = React.useCallback(
    async (payload: { contentType: "article" | "property"; sanityId?: string }) => {
      if (status !== "authenticated") {
        // still allow local-only bookmarking for preview UX
        if (isBookmarked) removeBookmark(contentSlug);
        else addBookmark(contentSlug);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contentSlug, ...payload })
        });
        const json = await res.json();
        if (json.bookmarked) addBookmark(contentSlug);
        else removeBookmark(contentSlug);
      } finally {
        setLoading(false);
      }
    },
    [addBookmark, contentSlug, isBookmarked, removeBookmark, status]
  );

  return { isBookmarked, toggle, loading };
}

