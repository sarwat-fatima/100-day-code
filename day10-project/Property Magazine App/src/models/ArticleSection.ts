import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ArticleSectionSchema = new Schema(
  {
    articleSlug: { type: String, required: true, index: true },
    order: { type: Number, required: true },
    kind: { type: String, enum: ["text", "image", "gallery", "quote"], required: true },
    payload: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

ArticleSectionSchema.index({ articleSlug: 1, order: 1 }, { unique: true });

export type ArticleSection = InferSchemaType<typeof ArticleSectionSchema>;
export default mongoose.models.ArticleSection || mongoose.model("ArticleSection", ArticleSectionSchema);

