import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article/ArticleReader";
import { getArticleBySlug } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article?._id) return notFound();
  return <ArticleReader article={article} />;
}
