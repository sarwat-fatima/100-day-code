import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SearchHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    query: { type: String, required: true, trim: true },
    filters: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

SearchHistorySchema.index({ userId: 1, createdAt: -1 });
SearchHistorySchema.index({ query: "text" });

export type SearchHistory = InferSchemaType<typeof SearchHistorySchema>;
export default mongoose.models.SearchHistory || mongoose.model("SearchHistory", SearchHistorySchema);

