import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SanityArticleCard } from "@/types";

export function ArticleCard({ article }: { article: SanityArticleCard }) {
  return (
    <Card className="group hover:shadow-lift transition-shadow">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-white/40">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : null}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs tracking-editorial uppercase text-ink/55">{article.category ?? "Article"}</div>
            {article.isPremium ? <Badge>Premium</Badge> : null}
          </div>
          <div className="mt-2 font-serif text-xl tracking-tight">{article.title}</div>
          {article.excerpt ? <p className="mt-2 text-sm text-ink/70 line-clamp-3">{article.excerpt}</p> : null}
        </div>
      </Link>
    </Card>
  );
}
