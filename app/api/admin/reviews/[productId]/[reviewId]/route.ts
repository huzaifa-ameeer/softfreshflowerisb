import { jsonError, withAdmin } from "@/lib/api";
import { deleteProductReview, setReviewPublished } from "@/lib/products";

type Context = {
  params: Promise<{ productId: string; reviewId: string }>;
};

export async function PATCH(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { productId, reviewId } = await context.params;

    let body: { published?: unknown };

    try {
      body = ((await request.json()) ?? {}) as { published?: unknown };
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    if (typeof body.published !== "boolean") {
      return jsonError(400, "published must be true or false");
    }

    const result = await setReviewPublished(
      productId,
      reviewId,
      body.published,
    );

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json(result.data);
  });
}

export async function DELETE(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { productId, reviewId } = await context.params;
    const result = await deleteProductReview(productId, reviewId);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json(result.data);
  });
}
