import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import Collection from "@/models/Collection";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const collections = await Collection.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ collections });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, isPublic } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  await connectDB();
  const collection = await Collection.create({
    userId: session.user.id,
    title: title.trim(),
    description: description?.trim(),
    isPublic: Boolean(isPublic)
  });
  return NextResponse.json({ collection });
}

