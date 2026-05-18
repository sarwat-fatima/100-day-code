"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Result = {
  resultType: "article" | "property";
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  imageUrl?: string;
};

export function SearchShell() {
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<Result[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults([]);
      return;
    }
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        setResults(json.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [q]);

  return (
    <div className="max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search architects, styles, rooms…"
          className={cn(
            "w-full h-11 rounded-full border border-border bg-white px-11 text-sm outline-none",
            "focus:ring-2 focus:ring-ring/40"
          )}
          aria-label="Search"
        />
      </div>

      <div className="mt-6">
        {loading ? <div className="text-sm text-ink/70">Searching…</div> : null}
        {!loading && q.trim() && !results.length ? <div className="text-sm text-ink/70">No results.</div> : null}
        <div className="space-y-3">
          {results.map((r) => (
            <Link
              key={`${r.resultType}:${r._id}`}
              href={r.resultType === "article" ? `/articles/${r.slug}` : `/properties/${r.slug}`}
              className="flex items-center gap-4 rounded-[var(--radius)] border border-border/70 bg-white p-3 hover:bg-white/60 transition-colors"
            >
              <div className="relative size-14 overflow-hidden rounded-[12px] border border-border/70 bg-white/40">
                {r.imageUrl ? <Image src={r.imageUrl} alt="" fill className="object-cover" sizes="56px" /> : null}
              </div>
              <div className="min-w-0">
                <div className="text-xs tracking-editorial uppercase text-ink/55">{r.resultType}</div>
                <div className="font-serif text-lg truncate">{r.title}</div>
                {r.subtitle ? <div className="text-sm text-ink/70 truncate">{r.subtitle}</div> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
