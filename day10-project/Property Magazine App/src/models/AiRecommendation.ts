import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AiRecommendationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kind: { type: String, enum: ["summary", "similar", "style", "palette"], required: true, index: true },
    input: { type: Schema.Types.Mixed },
    output: { type: Schema.Types.Mixed },
    model: { type: String },
    latencyMs: { type: Number }
  },
  { timestamps: true }
);

AiRecommendationSchema.index({ userId: 1, createdAt: -1 });

export type AiRecommendation = InferSchemaType<typeof AiRecommendationSchema>;
export default mongoose.models.AiRecommendation || mongoose.model("AiRecommendation", AiRecommendationSchema);

