import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import Bookmark from "@/models/Bookmark";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const bookmarks = await Bookmark.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { contentType, contentSlug, sanityId } = body ?? {};
  if (!contentType || !contentSlug) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await connectDB();
  const existing = await Bookmark.findOne({ userId: session.user.id, contentType, contentSlug });
  if (existing) {
    await existing.deleteOne();
    return NextResponse.json({ bookmarked: false });
  }
  await Bookmark.create({ userId: session.user.id, contentType, contentSlug, sanityId });
  return NextResponse.json({ bookmarked: true });
}

