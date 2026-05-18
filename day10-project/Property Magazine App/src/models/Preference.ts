import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PreferenceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    styles: [{ type: String, trim: true }],
    architects: [{ type: String, trim: true }],
    theme: { type: String, enum: ["system", "light", "dark"], default: "system" },
    fontSize: { type: String, enum: ["sm", "md", "lg"], default: "md" },
    notifications: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type Preference = InferSchemaType<typeof PreferenceSchema>;
export default mongoose.models.Preference || mongoose.model("Preference", PreferenceSchema);

