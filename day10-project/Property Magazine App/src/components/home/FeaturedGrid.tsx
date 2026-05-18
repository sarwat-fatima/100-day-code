import type { SanityArticleCard } from "@/types";
import { ArticleCard } from "@/components/article/ArticleCard";

export function FeaturedGrid({ articles }: { articles: SanityArticleCard[] }) {
  if (!articles.length) return <div className="text-sm text-ink/70">No published articles yet.</div>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a._id} article={a} />
      ))}
    </div>
  );
}

