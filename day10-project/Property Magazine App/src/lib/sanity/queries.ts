import { sanityClient } from "@/lib/sanity/client";
import { sanityImageUrl } from "@/lib/sanity/image";
import type { SanityArticleCard, SanityArticleFull, SanityPropertyCard, SanityPropertyFull } from "@/types";

const articleCardFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  category,
  isPremium,
  publishedAt,
  tags
`;

const propertyCardFields = `
  _id,
  title,
  "slug": slug.current,
  architect,
  year,
  location,
  coverImage,
  style,
  area,
  isPremium
`;

function withCoverUrl<T extends { coverImage?: any }>(items: T[]): (T & { coverImageUrl: string })[] {
  return items.map((i) => ({ ...i, coverImageUrl: sanityImageUrl(i.coverImage) }));
}

export async function getArticles(limit = 12, offset = 0): Promise<SanityArticleCard[]> {
  const items = await sanityClient.fetch(
    `*[_type == "article" && defined(publishedAt)] | order(publishedAt desc) [$offset...$end] {${articleCardFields}}`,
    { offset, end: offset + limit }
  );
  return withCoverUrl(items);
}

export async function getFeaturedArticles(limit = 6): Promise<SanityArticleCard[]> {
  const items = await sanityClient.fetch(
    `*[_type == "article" && defined(publishedAt)] | order(coalesce(featuredOrder, 9999) asc, publishedAt desc) [0...$limit] {${articleCardFields}}`,
    { limit }
  );
  return withCoverUrl(items);
}

export async function getArticleBySlug(slug: string): Promise<SanityArticleFull | null> {
  const item = await sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0]{
      ${articleCardFields},
      body,
      seo
    }`,
    { slug }
  );
  if (!item?._id) return null;
  return { ...item, coverImageUrl: sanityImageUrl(item.coverImage) };
}

export async function getProperties(limit = 12, offset = 0): Promise<SanityPropertyCard[]> {
  const items = await sanityClient.fetch(
    `*[_type == "property" && defined(publishedAt)] | order(publishedAt desc) [$offset...$end] {${propertyCardFields}}`,
    { offset, end: offset + limit }
  );
  return withCoverUrl(items);
}

export async function getTrendingProperties(limit = 8): Promise<SanityPropertyCard[]> {
  const items = await sanityClient.fetch(
    `*[_type == "property" && defined(publishedAt)] | order(publishedAt desc) [0...$limit] {${propertyCardFields}}`,
    { limit }
  );
  return withCoverUrl(items);
}

export async function getPropertyBySlug(slug: string): Promise<SanityPropertyFull | null> {
  const item = await sanityClient.fetch(
    `*[_type == "property" && slug.current == $slug][0]{
      ${propertyCardFields},
      publishedAt,
      description,
      gallery,
      materials
    }`,
    { slug }
  );
  if (!item?._id) return null;
  return { ...item, coverImageUrl: sanityImageUrl(item.coverImage) };
}
