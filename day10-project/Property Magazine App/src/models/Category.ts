import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

export type Category = InferSchemaType<typeof CategorySchema>;
export default mongoose.models.Category || mongoose.model("Category", CategorySchema);

