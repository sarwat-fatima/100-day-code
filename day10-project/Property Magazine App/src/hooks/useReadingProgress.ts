"use client";

import * as React from "react";
import { useUserStore } from "@/store/useUserStore";

export function useReadingProgress(articleSlug: string, enabled = true) {
  const upsertProgress = useUserStore((s) => s.upsertProgress);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrollTop = el.scrollTop || document.body.scrollTop;
        const height = el.scrollHeight - el.clientHeight;
        const p = height > 0 ? Math.round((scrollTop / height) * 100) : 0;
        setProgress(p);
        upsertProgress(articleSlug, p);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [articleSlug, enabled, upsertProgress]);

  return progress;
}

