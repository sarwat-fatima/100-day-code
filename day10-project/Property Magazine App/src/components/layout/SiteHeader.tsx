"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/useUIStore";
import { ProfileDrawer } from "@/components/layout/ProfileDrawer";

const nav = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/properties", label: "Properties" },
  { href: "/moodboard", label: "Moodboard" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-edge h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm">
            PM
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg tracking-tight">Property</span>
            <span className="text-xs tracking-editorial uppercase text-ink/55 group-hover:text-ink/80 transition-colors">
              Magazine App
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((i) => {
            const active = pathname === i.href || (i.href !== "/" && pathname?.startsWith(i.href));
            return (
              <Link
                key={i.href}
                href={i.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-full transition-colors",
                  active ? "bg-white text-ink" : "text-ink/70 hover:text-ink hover:bg-white/70"
                )}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Search">
            <Link href="/search">
              <Search className="size-4" />
            </Link>
          </Button>
          {session?.user ? (
            <ProfileDrawer />
          ) : (
            <Button asChild variant="ghost" size="icon" aria-label="Login">
              <Link href="/login">
                <UserRound className="size-4" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            Theme
          </Button>
        </div>
      </div>
    </header>
  );
}
