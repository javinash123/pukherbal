import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  readTime?: string;
  author: string;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: "" },
  content: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  category: { type: String, default: "" },
  readTime: { type: String, default: "" },
  author: { type: String, default: "Pukhraj Herbals" },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  seoTitle: { type: String, default: "" },
  seoDescription: { type: String, default: "" },
  seoKeywords: { type: String, default: "" },
}, { timestamps: true });

export const Blog = mongoose.model<IBlog>("Blog", BlogSchema);
