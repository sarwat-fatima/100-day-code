import mongoose, { Schema, type InferSchemaType } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String },
    url: { type: String },
    readAt: { type: Date }
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export type Notification = InferSchemaType<typeof NotificationSchema>;
export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

