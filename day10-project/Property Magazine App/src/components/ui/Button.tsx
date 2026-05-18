import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type Variant = "default" | "ghost" | "outline";
type Size = "sm" | "md" | "icon";

const variantClass: Record<Variant, string> = {
  default: "bg-ink text-paper hover:bg-ink/90",
  ghost: "bg-transparent hover:bg-white text-ink",
  outline: "border border-border bg-transparent hover:bg-white"
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-full",
  md: "h-10 px-4 text-sm rounded-full",
  icon: "size-10 rounded-full"
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "md", asChild, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    />
  );
});

export function ButtonLink({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 px-4 text-sm rounded-full bg-ink text-paper hover:bg-ink/90",
        className
      )}
    >
      {children}
    </Link>
  );
}
