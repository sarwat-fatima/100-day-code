import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const type = body?._type;
  const slug = body?.slug?.current;
  if (type === "article") {
    revalidatePath("/articles");
    if (slug) revalidatePath(`/articles/${slug}`);
    revalidatePath("/");
  }
  if (type === "property") {
    revalidatePath("/properties");
    if (slug) revalidatePath(`/properties/${slug}`);
    revalidatePath("/");
  }
  return NextResponse.json({ revalidated: true });
}

