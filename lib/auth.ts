import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error(
    "MONGO_URI is not set. Add it to .env.local to enable authentication.",
  );
}

const connection = await mongoose.connect(uri);
const db = connection.connection.db;

if (!db) {
  throw new Error("MongoDB connection is not ready.");
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
});
