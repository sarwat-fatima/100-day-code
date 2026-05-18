import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { publishedAtPublishAction } from "./publishedAtPublishAction";

export default defineConfig({
  name: "property-magazine",
  title: "Property Magazine App",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  document: {
    actions: (prev) =>
      prev.map((action) => {
        // Replace the default Publish action to ensure `publishedAt` gets set when publishing.
        return (action as any)?.action === "publish" ? publishedAtPublishAction : action;
      })
  },
  schema: { types: schemaTypes }
});
