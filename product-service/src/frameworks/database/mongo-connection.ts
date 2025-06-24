import mongoose from "mongoose";

export async function connectToMongoDB(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
