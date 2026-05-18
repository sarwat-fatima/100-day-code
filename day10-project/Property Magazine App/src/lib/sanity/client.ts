import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion: "2026-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN
});

const builder = createImageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}
