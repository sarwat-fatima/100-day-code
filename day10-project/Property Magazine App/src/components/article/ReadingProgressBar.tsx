"use client";

import { cn } from "@/lib/utils/cn";

export function ReadingProgressBar({ value }: { value: number }) {
  return (
    <div className="sticky top-16 z-30 h-1 w-full bg-border/50">
      <div
        className={cn("h-full bg-ink/70 transition-[width] duration-150")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

