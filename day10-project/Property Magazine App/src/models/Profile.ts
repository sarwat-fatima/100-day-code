import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    displayName: { type: String, trim: true },
    bio: { type: String, maxlength: 500, trim: true },
    location: { type: String, trim: true },
    avatarUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export type Profile = InferSchemaType<typeof ProfileSchema>;
export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

