import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import ReadingHistory from "@/models/ReadingHistory";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const history = await ReadingHistory.find({ userId: session.user.id }).sort({ readAt: -1 }).limit(100).lean();
  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { articleSlug, progress, sanityId } = await req.json();
  if (!articleSlug) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await connectDB();
  const nextProgress = Math.max(0, Math.min(100, Number(progress ?? 0)));
  const update: any = { progress: nextProgress, sanityId, readAt: new Date() };
  if (nextProgress >= 98) update.completedAt = new Date();

  await ReadingHistory.findOneAndUpdate({ userId: session.user.id, articleSlug }, { $set: update }, { upsert: true });
  return NextResponse.json({ ok: true });
}

