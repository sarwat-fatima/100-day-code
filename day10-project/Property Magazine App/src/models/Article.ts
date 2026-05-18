import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ArticleSchema = new Schema(
  {
    sanityId: { type: String, unique: true, sparse: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, maxlength: 400 },
    coverImageUrl: { type: String },
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    isPremium: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    featuredOrder: { type: Number }
  },
  { timestamps: true }
);

ArticleSchema.index({ isPublished: 1, publishedAt: -1 });
ArticleSchema.index({ title: "text", excerpt: "text", tags: "text" });

export type Article = InferSchemaType<typeof ArticleSchema>;
export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);

