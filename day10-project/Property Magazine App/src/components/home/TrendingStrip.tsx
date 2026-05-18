"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import type { SanityPropertyCard } from "@/types";

export function TrendingStrip({ properties }: { properties: SanityPropertyCard[] }) {
  if (!properties.length) return <div className="text-sm text-ink/70">No published properties yet.</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {properties.map((p) => (
        <FadeIn key={p._id} className="group">
          <Link
            href={`/properties/${p.slug}`}
            className="block rounded-[var(--radius)] border border-border/70 overflow-hidden bg-white hover:shadow-lift transition-shadow"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={p.coverImageUrl}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="p-4">
              <div className="text-xs tracking-editorial uppercase text-ink/55">
                {p.location?.city ?? "—"} {p.year ? `· ${p.year}` : ""}
              </div>
              <div className="mt-1 font-serif text-lg tracking-tight">{p.title}</div>
              <div className="mt-2 text-sm text-ink/70 line-clamp-2">{p.architect ?? "Architectural story"}</div>
            </div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
