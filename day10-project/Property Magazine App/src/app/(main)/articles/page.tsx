import { ArticleCard } from "@/components/article/ArticleCard";
import { getArticles } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles(24, 0);

  return (
    <div className="container-edge py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">Articles</h1>
        <p className="mt-3 text-ink/70">
          Magazine-grade architecture storytelling with a calm editorial rhythm.
        </p>
      </header>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </div>
  );
}

