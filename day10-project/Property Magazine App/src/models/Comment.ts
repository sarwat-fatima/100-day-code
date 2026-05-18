import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CommentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contentType: { type: String, enum: ["article", "property"], required: true, index: true },
    contentSlug: { type: String, required: true, index: true },
    body: { type: String, required: true, maxlength: 2000 },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" }
  },
  { timestamps: true }
);

CommentSchema.index({ contentType: 1, contentSlug: 1, createdAt: -1 });

export type Comment = InferSchemaType<typeof CommentSchema>;
export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

