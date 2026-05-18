"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Collection = {
  _id: string;
  title: string;
};

export function AddToMoodboard({
  contentType,
  contentSlug,
  imageUrl
}: {
  contentType: "article" | "property";
  contentSlug: string;
  imageUrl?: string;
}) {
  const { status } = useSession();
  const [open, setOpen] = React.useState(false);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [collectionId, setCollectionId] = React.useState("");
  const [newTitle, setNewTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const loadCollections = React.useCallback(async () => {
    if (status !== "authenticated") return;
    const res = await fetch("/api/collections");
    const json = await res.json();
    const list = (json.collections ?? []) as Collection[];
    setCollections(list);
    if (!collectionId && list[0]?._id) setCollectionId(list[0]._id);
  }, [collectionId, status]);

  React.useEffect(() => {
    if (!open) return;
    setMessage(null);
    loadCollections().catch(() => {});
  }, [loadCollections, open]);

  async function createCollection() {
    const title = newTitle.trim();
    if (!title) return;
    setLoading(true);
    setMessage(null);
    try {
      await fetch("/api/collections", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title })
      });
      setNewTitle("");
      await loadCollections();
      setMessage("Collection created.");
    } finally {
      setLoading(false);
    }
  }

  async function addItem() {
    if (!collectionId) return;
    setLoading(true);
    setMessage(null);
    try {
      await fetch("/api/collections/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collectionId,
          item: { contentType, contentSlug, imageUrl }
        })
      });
      setMessage("Added to moodboard.");
    } finally {
      setLoading(false);
    }
  }

  if (status !== "authenticated") {
    return (
      <div className="text-xs text-ink/60">
        <Link className="underline" href="/login">
          Sign in
        </Link>{" "}
        to add to moodboard.
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen((v) => !v)}>
        Add to moodboard
      </Button>
      {open ? (
        <Card className="mt-3 p-4 space-y-3">
          <div className="text-xs tracking-editorial uppercase text-ink/55">Choose collection</div>
          <select
            className="w-full h-11 rounded-full border border-border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              Select a collection
            </option>
            {collections.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Button onClick={addItem} disabled={loading || !collectionId}>
              Add
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Close
            </Button>
          </div>

          <div className="pt-2 border-t border-border/70">
            <div className="text-xs tracking-editorial uppercase text-ink/55">New collection</div>
            <div className="mt-2 flex items-center gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 h-11 rounded-full border border-border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="e.g. Warm woods"
                disabled={loading}
              />
              <Button onClick={createCollection} disabled={loading || !newTitle.trim()}>
                Create
              </Button>
            </div>
          </div>

          {message ? <div className="text-xs text-ink/70">{message}</div> : null}
          {!collections.length ? <div className="text-xs text-ink/60">No collections yet. Create one above.</div> : null}
        </Card>
      ) : null}
    </div>
  );
}

