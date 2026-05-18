import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { sanityClient } from "@/lib/sanity/client";
import { sanityImageUrl } from "@/lib/sanity/image";
import Article from "@/models/Article";
import Property from "@/models/Property";
import { revalidatePath } from "next/cache";

// Sanity Webhook -> Vercel -> this route.
// Use a shared secret to prevent unauthorized sync calls.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-propertymagazine-secret");
  if (!process.env.SANITY_WEBHOOK_SECRET || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const type = body?._type;
  const slug = body?.slug?.current;
  const id = body?._id;
  if (!type || !id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await connectDB();

  if (type === "article") {
    const doc = await sanityClient.fetch(
      `*[_type=="article" && _id==$id][0]{_id,title,"slug":slug.current,excerpt,coverImage,category,tags,isPremium,publishedAt,featuredOrder}`,
      { id }
    );
    if (doc?.slug) {
      await Article.findOneAndUpdate(
        { slug: doc.slug },
        {
          $set: {
            sanityId: doc._id,
            title: doc.title,
            slug: doc.slug,
            excerpt: doc.excerpt,
            coverImageUrl: sanityImageUrl(doc.coverImage),
            category: doc.category,
            tags: doc.tags ?? [],
            isPremium: Boolean(doc.isPremium),
            isPublished: Boolean(doc.publishedAt),
            publishedAt: doc.publishedAt ? new Date(doc.publishedAt) : undefined,
            featuredOrder: doc.featuredOrder
          }
        },
        { upsert: true }
      );
      revalidatePath("/");
      revalidatePath("/articles");
      revalidatePath(`/articles/${doc.slug}`);
    }
  }

  if (type === "property") {
    const doc = await sanityClient.fetch(
      `*[_type=="property" && _id==$id][0]{_id,title,"slug":slug.current,architect,year,location,style,coverImage,isPremium,publishedAt,tags}`,
      { id }
    );
    if (doc?.slug) {
      await Property.findOneAndUpdate(
        { slug: doc.slug },
        {
          $set: {
            sanityId: doc._id,
            title: doc.title,
            slug: doc.slug,
            architect: doc.architect,
            year: doc.year,
            location: doc.location,
            style: doc.style ?? [],
            coverImageUrl: sanityImageUrl(doc.coverImage),
            isPremium: Boolean(doc.isPremium),
            isPublished: Boolean(doc.publishedAt),
            publishedAt: doc.publishedAt ? new Date(doc.publishedAt) : undefined,
            tags: doc.tags ?? []
          }
        },
        { upsert: true }
      );
      revalidatePath("/");
      revalidatePath("/properties");
      revalidatePath(`/properties/${doc.slug}`);
    }
  }

  // Still revalidate when slug missing (e.g. drafts) so lists refresh
  revalidatePath("/");
  return NextResponse.json({ ok: true, type, slug });
}

