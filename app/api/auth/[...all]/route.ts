import { getAuth } from "@/lib/auth";

async function handle(request: Request) {
  try {
    const auth = await getAuth();

    return await auth.handler(request);
  } catch (error) {
    console.error("[auth] request failed:", error);

    return Response.json(
      { message: "Authentication is temporarily unavailable." },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
