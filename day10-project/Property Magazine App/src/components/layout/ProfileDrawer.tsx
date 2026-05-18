"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronRight, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ProfileDrawer() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <>
      {/* Drawer trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-white/90 px-3 py-2 transition-all hover:bg-white"
        aria-label="Open profile menu"
      >
        {session.user.image ? (
          <img 
            src={session.user.image} 
            alt={session.user.name ?? "Profile"} 
            className="h-8 w-8 rounded-full object-cover" 
          />
        ) : (
          <div className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper">
            <User className="h-4 w-4" />
          </div>
        )}
        <ChevronRight className="h-4 w-4 text-ink/50" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-80 bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-border/50 p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-ink/50 hover:text-ink"
              aria-label="Close drawer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name ?? "Profile"} 
                  className="h-12 w-12 rounded-full object-cover" 
                />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{session.user.name || session.user.email}</p>
                <p className="text-sm text-ink/60 truncate">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-ink hover:bg-paper transition-colors"
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-ink hover:bg-paper transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Bookmarks</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-border/50 p-4">
            <button
              onClick={async () => {
                setOpen(false);
                await signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
