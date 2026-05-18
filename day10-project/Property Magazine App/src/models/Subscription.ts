import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    tier: { type: String, enum: ["free", "premium"], default: "free", index: true },
    status: { type: String, enum: ["active", "canceled", "past_due"], default: "active" },
    provider: { type: String, enum: ["stripe", "manual"], default: "manual" },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type Subscription = InferSchemaType<typeof SubscriptionSchema>;
export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);

