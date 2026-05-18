import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ArchitectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  { timestamps: true }
);

export type Architect = InferSchemaType<typeof ArchitectSchema>;
export default mongoose.models.Architect || mongoose.model("Architect", ArchitectSchema);

