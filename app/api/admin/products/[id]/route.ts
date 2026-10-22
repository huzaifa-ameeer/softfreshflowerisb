import { jsonError, withAdmin } from "@/lib/api";
import { destroyImage } from "@/lib/cloudinary";
import {
  deleteProduct,
  getProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/products";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const product = await getProduct(id);

    if (!product) return jsonError(404, "Product not found");

    return Response.json({ product });
  });
}

export async function PATCH(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { id } = await context.params;

    let body: ProductInput;

    try {
      body = ((await request.json()) ?? {}) as ProductInput;
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const result = await updateProduct(id, body);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json({ product: result.data });
  });
}

export async function DELETE(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const result = await deleteProduct(id);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    await Promise.all(
      result.data.publicIds.map((publicId) => destroyImage(publicId)),
    );

    return Response.json({ ok: true, id: result.data.id });
  });
}
