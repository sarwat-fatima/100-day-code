import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { dataUrl, folder } = await req.json();
  if (!dataUrl) return NextResponse.json({ error: "Missing dataUrl" }, { status: 400 });
  const result = await uploadToCloudinary(dataUrl, folder);
  return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
}

