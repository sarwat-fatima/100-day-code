import { notFound } from "next/navigation";
import { PropertyShowcase } from "@/components/property/PropertyShowcase";
import { getPropertyBySlug } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property?._id) return notFound();
  return <PropertyShowcase property={property} />;
}
