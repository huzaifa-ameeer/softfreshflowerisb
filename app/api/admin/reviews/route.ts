import { withAdmin } from "@/lib/api";
import { listAllReviews } from "@/lib/products";

export async function GET(request: Request) {
  return withAdmin(request, async () => {
    const reviews = await listAllReviews();

    return Response.json({ reviews });
  });
}
