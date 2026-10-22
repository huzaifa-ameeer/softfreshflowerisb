import { getAuth } from "@/lib/auth";

export async function requireAdmin(request: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: request.headers });

  return session ?? null;
}
