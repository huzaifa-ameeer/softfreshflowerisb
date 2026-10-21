import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let authPromise: ReturnType<typeof createAuth> | null = null;

export function getAuth() {
  authPromise ??= createAuth().catch((error) => {
    authPromise = null;
    throw error;
  });

  return authPromise;
}

async function createAuth() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to your environment to enable authentication.",
    );
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready.");
  }

  const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return betterAuth({
    trustedOrigins,
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
  });
}
