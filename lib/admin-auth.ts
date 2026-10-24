import { getAuth } from "@/lib/auth";

export function isAdminEmail(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL is not set.");
  }

  return email.trim().toLowerCase() === adminEmail;
}

export async function requireAdmin(request: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !isAdminEmail(session.user.email)) return null;

  return session;
}
