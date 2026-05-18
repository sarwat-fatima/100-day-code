import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BookmarkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contentType: { type: String, enum: ["article", "property"], required: true },
    contentSlug: { type: String, required: true, index: true },
    sanityId: { type: String, index: true }
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, contentType: 1, contentSlug: 1 }, { unique: true });

export type Bookmark = InferSchemaType<typeof BookmarkSchema>;
export default mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);

