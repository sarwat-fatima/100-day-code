import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import Collection from "@/models/Collection";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { collectionId, item } = await req.json();
  if (!collectionId || !item?.contentType || !item?.contentSlug)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await connectDB();
  const updated = await Collection.findOneAndUpdate(
    { _id: collectionId, userId: session.user.id },
    { $push: { items: { ...item, addedAt: new Date() } } },
    { new: true }
  ).lean();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ collection: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get("collectionId");
  const contentSlug = searchParams.get("contentSlug");
  if (!collectionId || !contentSlug) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  await connectDB();
  const updated = await Collection.findOneAndUpdate(
    { _id: collectionId, userId: session.user.id },
    { $pull: { items: { contentSlug } } },
    { new: true }
  ).lean();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ collection: updated });
}

