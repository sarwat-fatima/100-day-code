"use client";

import * as React from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Bookmark } from "lucide-react";
import type { SanityPropertyFull } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";
import { Button } from "@/components/ui/Button";
import { sanityImageUrl } from "@/lib/sanity/image";
import { AddToMoodboard } from "@/components/moodboard/AddToMoodboard";

export function PropertyShowcase({ property }: { property: SanityPropertyFull }) {
  const { isBookmarked, toggle, loading } = useBookmark(property.slug);
  const images = React.useMemo(() => {
    const galleryUrls = (property.gallery ?? []).map((g) => sanityImageUrl(g, 1800)).filter(Boolean);
    const all = [property.coverImageUrl, ...galleryUrls].filter(Boolean);
    return Array.from(new Set(all));
  }, [property.coverImageUrl, property.gallery]);

  const [active, setActive] = React.useState(0);
  const activeUrl = images[active] || property.coverImageUrl;

  React.useEffect(() => {
    if (active >= images.length) setActive(0);
  }, [active, images.length]);

  return (
    <div className="container-edge py-10 sm:py-14">
      <header className="max-w-3xl">
        <div className="text-xs tracking-editorial uppercase text-ink/55">
          {property.location?.city ?? "—"} {property.year ? `· ${property.year}` : ""}
        </div>
        <h1 className="mt-3 font-serif text-3xl sm:text-5xl tracking-tight">{property.title}</h1>
        <p className="mt-4 text-ink/70">{property.architect ?? "Architect"}</p>
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toggle({ contentType: "property", sanityId: property._id })}
            disabled={loading}
          >
            <Bookmark className="size-4" />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          <AddToMoodboard contentType="property" contentSlug={property.slug} imageUrl={property.coverImageUrl} />
        </div>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_260px] lg:items-start">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] border border-border/70 bg-white/40">
          {activeUrl ? (
            <Image
              key={activeUrl}
              src={activeUrl}
              alt={property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
          ) : null}
        </div>

        <div className="flex lg:flex-col gap-3 overflow-auto lg:overflow-visible">
          {images.slice(0, 10).map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(idx)}
              className="relative h-20 w-28 flex-none overflow-hidden rounded-[12px] border border-border/70 bg-white/40"
              aria-label={`Open image ${idx + 1}`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="112px" />
              {idx === active ? <div className="absolute inset-0 ring-2 ring-ring" /> : null}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="prose-editorial max-w-none">
          <PortableText value={property.description} />
        </div>
        <aside className="rounded-[var(--radius)] border border-border/70 bg-white p-5">
          <div className="text-xs tracking-editorial uppercase text-ink/55">Material palette</div>
          <div className="mt-3 space-y-4">
            {(property.materials ?? []).slice(0, 8).map((m, i) => (
              <div key={`${m.name ?? "material"}-${i}`}>
                <div className="font-serif text-lg">{m.name ?? "Material"}</div>
                {m.description ? <p className="mt-1 text-sm text-ink/70">{m.description}</p> : null}
              </div>
            ))}
            {!property.materials?.length ? <div className="text-sm text-ink/70">Add materials in Sanity.</div> : null}
          </div>
        </aside>
      </section>
    </div>
  );
}
