import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border/70 bg-white shadow-sm overflow-hidden",
        className
      )}
      {...props}
    />
  );
}
