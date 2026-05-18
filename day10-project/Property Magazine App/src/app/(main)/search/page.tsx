import { SearchShell } from "@/components/search/SearchShell";

export default function SearchPage() {
  return (
    <div className="container-edge py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">Search</h1>
        <p className="mt-3 text-ink/70">Fast lightweight search across articles and properties.</p>
      </header>
      <div className="mt-8">
        <SearchShell />
      </div>
    </div>
  );
}

