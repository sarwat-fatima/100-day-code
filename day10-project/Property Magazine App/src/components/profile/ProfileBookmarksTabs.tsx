"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type BookmarkItem = {
  contentType: "article" | "property";
  contentSlug: string;
};

type ProfileBookmarksTabsProps = {
  bookmarks: BookmarkItem[];
};

export function ProfileBookmarksTabs({ bookmarks }: ProfileBookmarksTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"article" | "property">("article");
  const articleBookmarks = bookmarks.filter((bookmark) => bookmark.contentType === "article");
  const propertyBookmarks = bookmarks.filter((bookmark) => bookmark.contentType === "property");

  return (
    <div className="mt-8 rounded-[var(--radius)] border border-border/70 bg-white p-5">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === "article" ? "default" : "outline"}
          onClick={() => setActiveTab("article")}
        >
          Articles
        </Button>
        <Button
          variant={activeTab === "property" ? "default" : "outline"}
          onClick={() => setActiveTab("property")}
        >
          Properties
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {activeTab === "article" ? (
          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl tracking-tight">Bookmarked articles</h2>
                <p className="text-sm text-ink/70">Articles you have bookmarked for later reading.</p>
              </div>
              <div className="text-sm text-ink/60">{articleBookmarks.length} saved</div>
            </div>
            {articleBookmarks.length ? (
              <div className="mt-4 space-y-2">
                {articleBookmarks.map((item) => (
                  <Link
                    key={item.contentSlug}
                    href={`/articles/${item.contentSlug}`}
                    className="block rounded-[var(--radius)] border border-border/70 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                  >
                    <span className="font-medium">{item.contentSlug}</span>
                    <span className="ml-2 text-xs text-ink/60">Article</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--radius)] border border-dashed border-border/60 bg-slate-50 p-4 text-sm text-ink/70">
                No bookmarked articles yet. Use the Bookmark button while reading an article to save it here.
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl tracking-tight">Saved properties</h2>
                <p className="text-sm text-ink/70">Properties you have saved for later review.</p>
              </div>
              <div className="text-sm text-ink/60">{propertyBookmarks.length} saved</div>
            </div>
            {propertyBookmarks.length ? (
              <div className="mt-4 space-y-2">
                {propertyBookmarks.map((item) => (
                  <Link
                    key={item.contentSlug}
                    href={`/properties/${item.contentSlug}`}
                    className="block rounded-[var(--radius)] border border-border/70 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                  >
                    <span className="font-medium">{item.contentSlug}</span>
                    <span className="ml-2 text-xs text-ink/60">Property</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--radius)] border border-dashed border-border/60 bg-slate-50 p-4 text-sm text-ink/70">
                No saved properties yet. Use the Save button on a property to add it here.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
