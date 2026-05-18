import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/70 bg-white/60 px-2.5 py-1 text-xs text-ink/80",
        className
      )}
      {...props}
    />
  );
}
