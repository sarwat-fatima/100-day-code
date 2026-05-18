import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MagazineSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    issueNumber: { type: String, trim: true },
    publishedAt: { type: Date, index: true },
    coverImageUrl: { type: String }
  },
  { timestamps: true }
);

export type Magazine = InferSchemaType<typeof MagazineSchema>;
export default mongoose.models.Magazine || mongoose.model("Magazine", MagazineSchema);

