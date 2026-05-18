import { PropertyCard } from "@/components/property/PropertyCard";
import { getProperties } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getProperties(24, 0);

  return (
    <div className="container-edge py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">Properties</h1>
        <p className="mt-3 text-ink/70">Minimalist showcases with material palettes and spatial narrative.</p>
      </header>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p._id} property={p} />
        ))}
      </div>
    </div>
  );
}

