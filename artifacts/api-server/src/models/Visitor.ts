import mongoose, { Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  page: string;
  referrer: string;
  userAgent: string;
  country: string;
  city: string;
  region: string;
  device: string;
  browser: string;
  sessionId: string;
  createdAt: Date;
}

const VisitorSchema = new Schema<IVisitor>({
  ip: { type: String, default: "" },
  page: { type: String, required: true },
  referrer: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  region: { type: String, default: "" },
  device: { type: String, default: "" },
  browser: { type: String, default: "" },
  sessionId: { type: String, default: "" },
}, { timestamps: true });

VisitorSchema.index({ createdAt: -1 });
VisitorSchema.index({ page: 1 });
VisitorSchema.index({ country: 1 });

export const Visitor = mongoose.model<IVisitor>("Visitor", VisitorSchema);
