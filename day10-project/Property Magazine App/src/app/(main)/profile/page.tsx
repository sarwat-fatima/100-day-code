import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import Bookmark from "@/models/Bookmark";
import { ProfileBookmarksTabs } from "@/components/profile/ProfileBookmarksTabs";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="container-edge py-14">
        <h1 className="font-serif text-3xl tracking-tight">Profile</h1>
        <p className="mt-3 text-ink/70">Sign in to view your profile.</p>
      </div>
    );
  }

  await connectDB();
  const bookmarkDocs = await Bookmark.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  const bookmarks = bookmarkDocs.map((bookmark) => ({
    contentType: bookmark.contentType as "article" | "property",
    contentSlug: bookmark.contentSlug
  }));

  return (
    <div className="container-edge py-14">
      <h1 className="font-serif text-3xl tracking-tight">Profile</h1>
      <div className="mt-6 rounded-[var(--radius)] border border-border/70 bg-white p-5">
        <div className="text-xs tracking-editorial uppercase text-ink/55">Signed in as</div>
        <div className="mt-2 font-serif text-xl">{session.user.name ?? session.user.email ?? "User"}</div>
        {session.user.email ? <div className="mt-1 text-sm text-ink/70">{session.user.email}</div> : null}
      </div>
      <ProfileBookmarksTabs bookmarks={bookmarks} />
    </div>
  );
}
