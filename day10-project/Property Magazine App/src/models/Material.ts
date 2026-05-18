import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MaterialSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export type Material = InferSchemaType<typeof MaterialSchema>;
export default mongoose.models.Material || mongoose.model("Material", MaterialSchema);

