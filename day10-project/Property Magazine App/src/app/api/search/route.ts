import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { sanityImageUrl } from "@/lib/sanity/image";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const query = q.trim();
  if (!query) return NextResponse.json({ results: [] });

  const articles = await sanityClient.fetch(
    `*[_type == "article" && defined(publishedAt) && (title match $q || excerpt match $q || $q in tags)] | order(publishedAt desc) [0...6]{
      _id, title, "slug": slug.current, coverImage, category
    }`,
    { q: `*${query}*` }
  );

  const properties = await sanityClient.fetch(
    `*[_type == "property" && defined(publishedAt) && (title match $q || architect match $q || location.city match $q || $q in style)] | order(publishedAt desc) [0...6]{
      _id, title, "slug": slug.current, coverImage, architect, location
    }`,
    { q: `*${query}*` }
  );

  const results = [
    ...articles.map((a: any) => ({
      resultType: "article",
      _id: a._id,
      title: a.title,
      slug: a.slug,
      subtitle: a.category,
      imageUrl: sanityImageUrl(a.coverImage, 900)
    })),
    ...properties.map((p: any) => ({
      resultType: "property",
      _id: p._id,
      title: p.title,
      slug: p.slug,
      subtitle: p.architect || p.location?.city,
      imageUrl: sanityImageUrl(p.coverImage, 900)
    }))
  ];

  return NextResponse.json({ results });
}

