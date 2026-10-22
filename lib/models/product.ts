import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const productImageSchema = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false, id: false },
);

const reviewSchema = new Schema(
  {
    id: { type: String, default: "" },
    author: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    date: { type: String, default: "" },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  { _id: false, id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    category: { type: String, required: true, index: true, trim: true },
    categoryName: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    images: { type: [productImageSchema], default: [] },
    highlights: { type: [String], default: [] },
    reviews: { type: [reviewSchema], default: [] },
    rating: { type: Number, default: 0 },
    isFresh: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ProductDocument = InferSchemaType<typeof productSchema>;

export const ProductModel: Model<ProductDocument> =
  (models.Product as Model<ProductDocument>) ??
  model<ProductDocument>("Product", productSchema);
