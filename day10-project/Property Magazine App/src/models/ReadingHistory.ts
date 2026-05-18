import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ReadingHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    articleSlug: { type: String, required: true, index: true },
    sanityId: { type: String, index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    readAt: { type: Date, default: Date.now, index: true },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

ReadingHistorySchema.index({ userId: 1, articleSlug: 1 }, { unique: true });

export type ReadingHistory = InferSchemaType<typeof ReadingHistorySchema>;
export default mongoose.models.ReadingHistory || mongoose.model("ReadingHistory", ReadingHistorySchema);

