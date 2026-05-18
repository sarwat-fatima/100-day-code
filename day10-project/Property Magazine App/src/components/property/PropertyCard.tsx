import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { SanityPropertyCard } from "@/types";

export function PropertyCard({ property }: { property: SanityPropertyCard }) {
  return (
    <Card className="group hover:shadow-lift transition-shadow">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-white/40">
          {property.coverImageUrl ? (
            <Image
              src={property.coverImageUrl}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : null}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs tracking-editorial uppercase text-ink/55">
              {property.location?.city ?? "—"} {property.year ? `· ${property.year}` : ""}
            </div>
            {property.isPremium ? <Badge>Premium</Badge> : null}
          </div>
          <div className="mt-2 font-serif text-xl tracking-tight">{property.title}</div>
          <p className="mt-2 text-sm text-ink/70 line-clamp-2">{property.architect ?? "Architect"}</p>
        </div>
      </Link>
    </Card>
  );
}
