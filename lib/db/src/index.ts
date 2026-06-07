import mongoose from "mongoose";

export { mongoose };
export * from "./models";

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI must be set.");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
