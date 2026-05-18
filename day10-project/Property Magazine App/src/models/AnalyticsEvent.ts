import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AnalyticsEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    anonId: { type: String, index: true },
    name: { type: String, required: true, index: true },
    path: { type: String },
    properties: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ createdAt: -1 });

export type AnalyticsEvent = InferSchemaType<typeof AnalyticsEventSchema>;
export default mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema);

