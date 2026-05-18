import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PropertySchema = new Schema(
  {
    sanityId: { type: String, unique: true, sparse: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    architect: { type: String, index: true },
    year: { type: Number },
    location: {
      city: { type: String, index: true },
      region: { type: String },
      country: { type: String }
    },
    style: [{ type: String, index: true }],
    coverImageUrl: { type: String },
    isPremium: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
    tags: [{ type: String, index: true }]
  },
  { timestamps: true }
);

PropertySchema.index({ isPublished: 1, publishedAt: -1 });
PropertySchema.index({ title: "text", architect: "text", "location.city": "text", style: "text" });

export type Property = InferSchemaType<typeof PropertySchema>;
export default mongoose.models.Property || mongoose.model("Property", PropertySchema);

