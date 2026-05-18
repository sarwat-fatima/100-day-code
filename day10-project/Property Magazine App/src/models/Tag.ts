import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TagSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export type Tag = InferSchemaType<typeof TagSchema>;
export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);

