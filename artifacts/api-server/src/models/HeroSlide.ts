import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide extends Document {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  ctaText: { type: String, default: "Explore Now" },
  ctaLink: { type: String, default: "/products" },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const HeroSlide = mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
