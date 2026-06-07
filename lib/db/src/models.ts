import mongoose, { Schema, model, type Document, type Model } from "mongoose";

const jsonOpts = {
  toJSON: {
    virtuals: true,
    transform: (_: unknown, ret: Record<string, unknown>) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};

// ── Users ─────────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string; email: string; passwordHash: string; role: string; active: boolean; createdAt: Date;
}
const userSchema = new Schema<IUser>(
  { name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true }, passwordHash: { type: String, required: true }, role: { type: String, default: "admin" }, active: { type: Boolean, default: true } },
  { timestamps: { createdAt: "createdAt", updatedAt: false }, ...jsonOpts },
);
export const User: Model<IUser> = mongoose.models["User"] ?? model<IUser>("User", userSchema);

// ── Categories ────────────────────────────────────────────────────────────────
export interface ICategory extends Document {
  name: string; slug: string; description?: string; imageUrl?: string; active: boolean; sortOrder: number;
  metaTitle?: string; metaDescription?: string; metaKeywords?: string;
  createdAt: Date; updatedAt: Date;
}
const categorySchema = new Schema<ICategory>(
  { name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, description: String, imageUrl: String, active: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 }, metaTitle: String, metaDescription: String, metaKeywords: String },
  { timestamps: true, ...jsonOpts },
);
export const Category: Model<ICategory> = mongoose.models["Category"] ?? model<ICategory>("Category", categorySchema);

// ── Products ──────────────────────────────────────────────────────────────────
export interface IProduct extends Document {
  name: string; slug: string; categoryId?: string; specification?: string; casNumber?: string; imageUrl?: string; description?: string;
  active: boolean; featured: boolean; sortOrder: number;
  metaTitle?: string; metaDescription?: string; metaKeywords?: string;
  createdAt: Date; updatedAt: Date;
}
const productSchema = new Schema<IProduct>(
  { name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, categoryId: { type: String, default: null }, specification: String, casNumber: String, imageUrl: String, description: String, active: { type: Boolean, default: true }, featured: { type: Boolean, default: false }, sortOrder: { type: Number, default: 0 }, metaTitle: String, metaDescription: String, metaKeywords: String },
  { timestamps: true, ...jsonOpts },
);
export const Product: Model<IProduct> = mongoose.models["Product"] ?? model<IProduct>("Product", productSchema);

// ── Blogs ─────────────────────────────────────────────────────────────────────
export interface IBlog extends Document {
  title: string; slug: string; excerpt?: string; content?: string; imageUrl?: string; category?: string; readTime?: string; author: string; published: boolean; featured: boolean;
  metaTitle?: string; metaDescription?: string; metaKeywords?: string;
  createdAt: Date; updatedAt: Date;
}
const blogSchema = new Schema<IBlog>(
  { title: { type: String, required: true }, slug: { type: String, required: true, unique: true }, excerpt: String, content: String, imageUrl: String, category: String, readTime: String, author: { type: String, default: "Pukhraj Herbals" }, published: { type: Boolean, default: false }, featured: { type: Boolean, default: false }, metaTitle: String, metaDescription: String, metaKeywords: String },
  { timestamps: true, ...jsonOpts },
);
export const Blog: Model<IBlog> = mongoose.models["Blog"] ?? model<IBlog>("Blog", blogSchema);

// ── Settings ──────────────────────────────────────────────────────────────────
export interface ISetting extends Document { key: string; value: string; updatedAt: Date; }
const settingSchema = new Schema<ISetting>(
  { key: { type: String, required: true, unique: true }, value: { type: String, required: true } },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" }, ...jsonOpts },
);
export const Setting: Model<ISetting> = mongoose.models["Setting"] ?? model<ISetting>("Setting", settingSchema);

// ── Enquiries ─────────────────────────────────────────────────────────────────
export interface IEnquiry extends Document {
  name: string; email: string; company?: string; phone?: string; productOfInterest?: string; message: string;
  status: string; createdAt: Date;
}
const enquirySchema = new Schema<IEnquiry>(
  { name: { type: String, required: true }, email: { type: String, required: true, lowercase: true }, company: String, phone: String, productOfInterest: String, message: { type: String, required: true }, status: { type: String, default: "new", enum: ["new", "read", "replied"] } },
  { timestamps: { createdAt: "createdAt", updatedAt: false }, ...jsonOpts },
);
export const Enquiry: Model<IEnquiry> = mongoose.models["Enquiry"] ?? model<IEnquiry>("Enquiry", enquirySchema);

// ── Hero Slides ───────────────────────────────────────────────────────────────
export interface IHeroSlide extends Document {
  title: string; subtitle?: string; ctaText?: string; ctaLink?: string; imageUrl?: string; active: boolean; sortOrder: number;
}
const heroSlideSchema = new Schema<IHeroSlide>(
  { title: { type: String, required: true }, subtitle: String, ctaText: String, ctaLink: String, imageUrl: String, active: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 } },
  { timestamps: true, ...jsonOpts },
);
export const HeroSlide: Model<IHeroSlide> = mongoose.models["HeroSlide"] ?? model<IHeroSlide>("HeroSlide", heroSlideSchema);

// ── Video Items ───────────────────────────────────────────────────────────────
export interface IVideoItem extends Document {
  title: string; subtitle?: string; videoUrl?: string; thumbnailUrl?: string; active: boolean; sortOrder: number;
  productId?: string; productSlug?: string;
}
const videoItemSchema = new Schema<IVideoItem>(
  { title: { type: String, required: true }, subtitle: String, videoUrl: String, thumbnailUrl: String, active: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 }, productId: String, productSlug: String },
  { timestamps: true, ...jsonOpts },
);
export const VideoItem: Model<IVideoItem> = mongoose.models["VideoItem"] ?? model<IVideoItem>("VideoItem", videoItemSchema);
