import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { TrendingStrip } from "@/components/home/TrendingStrip";
import { getFeaturedArticles, getTrendingProperties } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredArticles, trendingProperties] = await Promise.all([
    getFeaturedArticles(6),
    getTrendingProperties(8)
  ]);

  return (
    <div>
      <HeroCarousel items={featuredArticles.slice(0, 3)} />
      <section className="container-edge py-10 sm:py-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">Featured stories</h2>
          <p className="hidden sm:block text-sm text-ink/70 max-w-sm">
            Calm, spacious editorial storytelling inspired by Japanese minimalism.
          </p>
        </div>
        <div className="mt-8">
          <FeaturedGrid articles={featuredArticles} />
        </div>
      </section>

      <section className="container-edge pb-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">Trending interiors</h2>
          <p className="hidden sm:block text-sm text-ink/70 max-w-sm">
            Subtle materials, light, and structure — a curated selection.
          </p>
        </div>
        <div className="mt-7">
          <TrendingStrip properties={trendingProperties} />
        </div>
      </section>
    </div>
  );
}
