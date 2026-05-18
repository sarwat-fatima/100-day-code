import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PaymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, enum: ["stripe", "manual"], default: "manual" },
    providerPaymentId: { type: String, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, enum: ["succeeded", "failed", "pending"], default: "pending", index: true }
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });

export type Payment = InferSchemaType<typeof PaymentSchema>;
export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

