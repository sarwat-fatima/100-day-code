import mongoose, { Schema, type InferSchemaType } from "mongoose";

const VideoAssetSchema = new Schema(
  {
    url: { type: String, required: true, index: true },
    publicId: { type: String, index: true },
    source: { type: String, enum: ["cloudinary", "external"], default: "external", index: true },
    durationSec: { type: Number },
    posterUrl: { type: String }
  },
  { timestamps: true }
);

export type VideoAsset = InferSchemaType<typeof VideoAssetSchema>;
export default mongoose.models.VideoAsset || mongoose.model("VideoAsset", VideoAssetSchema);

