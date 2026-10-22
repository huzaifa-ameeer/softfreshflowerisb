import { jsonError } from "@/lib/api";
import { addProductReview } from "@/lib/products";

type Context = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: Context) {
  try {
    const { slug } = await context.params;

    let body: {
      name?: unknown;
      message?: unknown;
      rating?: unknown;
    };

    try {
      body = ((await request.json()) ?? {}) as {
        name?: unknown;
        message?: unknown;
        rating?: unknown;
      };
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const result = await addProductReview(slug, {
      name: body.name,
      message: body.message,
      rating: body.rating,
    });

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json({ review: result.data }, { status: 201 });
  } catch (error) {
    console.error("[product reviews api]", error);

    return jsonError(500, "Something went wrong.");
  }
}
