import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    description: { type: String, default: "", trim: true },
    icon: { type: String, default: "", trim: true },
    tone: { type: String, default: "rose", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;

export const CategoryModel: Model<CategoryDocument> =
  (models.Category as Model<CategoryDocument>) ??
  model<CategoryDocument>("Category", categorySchema);
