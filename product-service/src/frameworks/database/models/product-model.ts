import mongoose, { Schema, Document } from "mongoose";

interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    inStock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);
