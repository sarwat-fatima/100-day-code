"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Collection = {
  _id: string;
  title: string;
  description?: string;
  isPublic?: boolean;
  items?: { contentType: string; contentSlug: string; imageUrl?: string }[];
};

export function MoodboardShell({ isAuthed }: { isAuthed: boolean }) {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [openCollectionId, setOpenCollectionId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/collections");
      const json = await res.json();
      setCollections(json.collections ?? []);
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function createCollection() {
    const t = title.trim();
    if (!t) return;
    setLoading(true);
    try {
      await fetch("/api/collections", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: t })
      });
      setTitle("");
      await load();
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthed) {
    return (
      <Card className="p-5">
        <div className="font-serif text-lg">Sign in required</div>
        <p className="mt-2 text-sm text-ink/70">
          Moodboards sync to your account. Go to the Sign in page to continue.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <div className="text-xs tracking-editorial uppercase text-ink/55">New collection</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full h-11 rounded-full border border-border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="e.g. Concrete & light"
            />
          </div>
          <Button onClick={createCollection} disabled={loading}>
            Create
          </Button>
        </div>
      </Card>

      {loading ? <div className="text-sm text-ink/70">Loading…</div> : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const open = openCollectionId === c._id;
          return (
            <Card key={c._id} className="p-5">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setOpenCollectionId(open ? null : c._id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs tracking-editorial uppercase text-ink/55">
                      {c.items?.length ?? 0} items
                    </div>
                    <div className="mt-2 font-serif text-xl tracking-tight">{c.title}</div>
                    {c.description ? <p className="mt-2 text-sm text-ink/70 line-clamp-3">{c.description}</p> : null}
                  </div>
                  <div className="text-xs text-primary">{open ? "Hide" : "View"}</div>
                </div>
              </button>
              {open && c.items?.length ? (
                <div className="mt-4 space-y-2 border-t border-border/70 pt-4">
                  {c.items.map((item) => {
                    const href = item.contentType === "property" ? `/properties/${item.contentSlug}` : `/articles/${item.contentSlug}`;
                    return (
                      <Link
                        key={`${item.contentType}-${item.contentSlug}`}
                        href={href}
                        className="block rounded-[var(--radius)] border border-border/70 bg-slate-50 px-4 py-3 text-sm text-ink transition-colors hover:bg-slate-100"
                      >
                        <div className="font-medium">{item.contentSlug}</div>
                        <div className="text-xs text-ink/60">{item.contentType}</div>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </Card>
          );
        })}
        {!collections.length && !loading ? <div className="text-sm text-ink/70">No collections yet.</div> : null}
      </div>
    </div>
  );
}
