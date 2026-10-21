import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error(
    "MONGO_URI is not set. Add it to your environment to enable authentication.",
  );
}

const connection = await mongoose.connect(uri);
const db = connection.connection.db;

if (!db) {
  throw new Error("MongoDB connection is not ready.");
}

const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  trustedOrigins,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
});
