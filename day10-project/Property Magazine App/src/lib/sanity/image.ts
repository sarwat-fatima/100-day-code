import type { SanityImageLike } from "@/types";
import { urlFor } from "@/lib/sanity/client";

export function sanityImageUrl(source: SanityImageLike | undefined, width = 1600) {
  if (!source) return "";
  if (typeof source === "string") return source;
  if (typeof source === "object" && source.url) return source.url;
  try {
    return urlFor(source).width(width).quality(80).auto("format").url();
  } catch {
    return "";
  }
}

