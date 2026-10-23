import { requireAdmin } from "@/lib/admin-auth";

export function jsonError(
  status: number,
  error: string,
  details?: Record<string, string>,
) {
  return Response.json(details ? { error, details } : { error }, { status });
}

export async function withAdmin(
  request: Request,
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    const session = await requireAdmin(request);

    if (!session) return jsonError(401, "Unauthorized");

    return await handler();
  } catch (error) {
    if (isControlFlowError(error)) throw error;

    console.error("[admin api]", error);

    return jsonError(500, "Something went wrong.");
  }
}

function isControlFlowError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const digest = (error as { digest?: unknown }).digest;

  return (
    typeof digest === "string" &&
    (digest === "NEXT_PRERENDER_INTERRUPTED" || digest.startsWith("NEXT_"))
  );
}
