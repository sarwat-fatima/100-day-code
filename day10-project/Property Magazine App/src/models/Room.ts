import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RoomSchema = new Schema(
  {
    propertySlug: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrls: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

RoomSchema.index({ propertySlug: 1, name: 1 });

export type Room = InferSchemaType<typeof RoomSchema>;
export default mongoose.models.Room || mongoose.model("Room", RoomSchema);

