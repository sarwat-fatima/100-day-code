import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CollectionItemSchema = new Schema(
  {
    contentType: { type: String, enum: ["article", "property"], required: true },
    contentSlug: { type: String, required: true },
    sanityId: { type: String },
    imageUrl: { type: String },
    note: { type: String, maxlength: 280 },
    addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const CollectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String, maxlength: 500, trim: true },
    coverImage: { type: String },
    isPublic: { type: Boolean, default: false, index: true },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String, trim: true }],
    items: { type: [CollectionItemSchema], default: [] }
  },
  { timestamps: true }
);

CollectionSchema.index({ userId: 1, createdAt: -1 });

export type Collection = InferSchemaType<typeof CollectionSchema>;
export default mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);

