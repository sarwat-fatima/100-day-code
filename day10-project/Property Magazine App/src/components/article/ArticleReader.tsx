"use client";

import * as React from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Bookmark } from "lucide-react";
import type { SanityArticleFull } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { Button } from "@/components/ui/Button";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { useSession } from "next-auth/react";
import { AddToMoodboard } from "@/components/moodboard/AddToMoodboard";

export function ArticleReader({ article }: { article: SanityArticleFull }) {
  const { status } = useSession();
  const progress = useReadingProgress(article.slug, true);
  const { isBookmarked, toggle, loading } = useBookmark(article.slug);

  // Persist reading progress (throttled)
  React.useEffect(() => {
    if (status !== "authenticated") return;
    const t = window.setTimeout(() => {
      fetch("/api/reading-history", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ articleSlug: article.slug, progress, sanityId: article._id })
      }).catch(() => {});
    }, 900);
    return () => window.clearTimeout(t);
  }, [article._id, article.slug, progress, status]);

  return (
    <div>
      <ReadingProgressBar value={progress} />
      <article className="container-edge py-10 sm:py-14">
        <header className="max-w-3xl">
          <div className="text-xs tracking-editorial uppercase text-ink/55">{article.category ?? "Article"}</div>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl tracking-tight">{article.title}</h1>
          {article.excerpt ? <p className="mt-4 text-ink/70 max-w-prose">{article.excerpt}</p> : null}
          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => toggle({ contentType: "article", sanityId: article._id })}
              disabled={loading}
            >
              <Bookmark className="size-4" />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <AddToMoodboard contentType="article" contentSlug={article.slug} imageUrl={article.coverImageUrl} />
            {article.isPremium ? <span className="text-xs text-ink/60">Premium</span> : null}
          </div>
        </header>

        {article.coverImageUrl ? (
          <div className="mt-10 relative aspect-[16/9] overflow-hidden rounded-[var(--radius)] border border-border/70">
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        ) : null}

        <div className="mt-10 max-w-3xl prose-editorial">
          <PortableText
            value={article.body}
            components={{
              types: {
                image: ({ value }: any) => {
                  const url = value?.asset?.url;
                  if (!url) return null;
                  return (
                    <figure className="my-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={value?.alt || ""} className="w-full rounded-[var(--radius)] border border-border/70" />
                      {value?.caption ? <figcaption className="mt-2 text-xs text-ink/60">{value.caption}</figcaption> : null}
                    </figure>
                  );
                }
              }
            }}
          />
        </div>
      </article>
    </div>
  );
}
