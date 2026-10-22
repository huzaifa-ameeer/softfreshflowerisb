import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI?.trim();

  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to your environment to enable the database.",
    );
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).catch((error: unknown) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}

export async function getDb() {
  const connection = await connectDB();
  const db = connection.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready.");
  }

  return db;
}
