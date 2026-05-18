import { auth } from "@/lib/auth/auth";
import { MoodboardShell } from "@/components/moodboard/MoodboardShell";

export const dynamic = "force-dynamic";

export default async function MoodboardPage() {
  const session = await auth();
  return (
    <div className="container-edge py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">Moodboards</h1>
        <p className="mt-3 text-ink/70">
          Save inspirations into calm boards. Sign in to create and sync collections.
        </p>
      </header>
      <div className="mt-8">
        <MoodboardShell isAuthed={Boolean(session?.user?.id)} />
      </div>
    </div>
  );
}

