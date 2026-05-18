import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ImageAssetSchema = new Schema(
  {
    url: { type: String, required: true, index: true },
    publicId: { type: String, index: true },
    source: { type: String, enum: ["sanity", "cloudinary", "external"], default: "external", index: true },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String, trim: true }
  },
  { timestamps: true }
);

export type ImageAsset = InferSchemaType<typeof ImageAssetSchema>;
export default mongoose.models.ImageAsset || mongoose.model("ImageAsset", ImageAssetSchema);

