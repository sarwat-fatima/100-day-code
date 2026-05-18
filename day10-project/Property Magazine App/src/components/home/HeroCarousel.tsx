"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { SanityArticleCard } from "@/types";
import { cn } from "@/lib/utils/cn";

export function HeroCarousel({ items }: { items: SanityArticleCard[] }) {
  const [index, setIndex] = React.useState(0);
  const current = items[index];

  React.useEffect(() => {
    if (!items.length) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 6500);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (!current) {
    return (
      <section className="border-b border-border/70">
        <div className="container-edge py-14">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">Property Magazine App</h1>
          <p className="mt-4 max-w-xl text-ink/70">
            Connect Sanity and publish your first story to see the hero carousel.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-border/70">
      <div className="container-edge py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[var(--radius)] border border-border/70 bg-white/40">
            <AnimatePresence mode="wait">
              <motion.div
                key={current._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
                className="relative aspect-[16/10] sm:aspect-[16/9]"
              >
                <Image
                  src={current.coverImageUrl}
                  alt={current.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 p-5 sm:p-6">
                  <div className="text-xs tracking-editorial uppercase text-white/80">{current.category ?? "Story"}</div>
                  <div className="mt-1 font-serif text-2xl sm:text-3xl tracking-tight text-white">{current.title}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <div className="text-xs tracking-editorial uppercase text-ink/55">Editorial</div>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight">Slow luxury storytelling</h1>
            <p className="mt-4 text-ink/70 max-w-prose">
              Calm layouts, airy typography, and subtle motion — inspired by Casa BRUTUS, Apple editorial pages, and Muji
              restraint.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <Link
                href={`/articles/${current.slug}`}
                className="inline-flex h-10 items-center justify-center rounded-full bg-ink px-4 text-sm text-paper hover:bg-ink/90"
              >
                Read story
              </Link>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm hover:bg-white"
                onClick={() => setIndex((i) => (i + 1) % items.length)}
              >
                Next
              </button>
            </div>

            <div className="mt-8 flex gap-2">
              {items.map((it, i) => (
                <button
                  key={it._id}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i === index ? "bg-ink/70" : "bg-border hover:bg-ink/30"
                  )}
                  onClick={() => setIndex(i)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
