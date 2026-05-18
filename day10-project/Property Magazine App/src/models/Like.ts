import mongoose, { Schema, type InferSchemaType } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contentType: { type: String, enum: ["article", "property", "comment"], required: true },
    contentSlug: { type: String, index: true },
    contentId: { type: Schema.Types.ObjectId, index: true }
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, contentType: 1, contentSlug: 1 }, { unique: true, sparse: true });
LikeSchema.index({ userId: 1, contentType: 1, contentId: 1 }, { unique: true, sparse: true });

export type Like = InferSchemaType<typeof LikeSchema>;
export default mongoose.models.Like || mongoose.model("Like", LikeSchema);

