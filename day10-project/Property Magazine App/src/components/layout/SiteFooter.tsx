import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="container-edge py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <div className="font-serif text-lg">Property Magazine App</div>
          <p className="mt-2 text-sm text-ink/65 max-w-md">
            Premium minimalist Japanese-style architecture magazine experience — optimized for performance and calm
            reading.
          </p>
        </div>
        <div className="flex gap-5 text-sm text-ink/70">
          <Link className="hover:text-ink" href="/articles">
            Articles
          </Link>
          <Link className="hover:text-ink" href="/properties">
            Properties
          </Link>
          <Link className="hover:text-ink" href="/moodboard">
            Moodboard
          </Link>
        </div>
      </div>
    </footer>
  );
}

