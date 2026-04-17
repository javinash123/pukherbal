import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  categoryId?: Types.ObjectId;
  specification?: string;
  casNumber?: string;
  imageUrl?: string;
  description?: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  specification: { type: String, default: "" },
  casNumber: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
