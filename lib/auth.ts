import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "@/lib/db";

let authPromise: ReturnType<typeof createAuth> | null = null;

export function getAuth() {
  authPromise ??= createAuth().catch((error) => {
    authPromise = null;
    throw error;
  });

  return authPromise;
}

async function createAuth() {
  const db = await getDb();

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
