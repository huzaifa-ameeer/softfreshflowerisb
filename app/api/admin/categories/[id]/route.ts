import { jsonError, withAdmin } from "@/lib/api";
import {
  deleteCategory,
  getCategory,
  updateCategory,
  type CategoryInput,
} from "@/lib/categories";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const category = await getCategory(id);

    if (!category) return jsonError(404, "Category not found");

    return Response.json({ category });
  });
}

export async function PATCH(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { id } = await context.params;

    let body: CategoryInput;

    try {
      body = ((await request.json()) ?? {}) as CategoryInput;
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const result = await updateCategory(id, body);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json({ category: result.data });
  });
}

export async function DELETE(request: Request, context: Context) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const result = await deleteCategory(id);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json({ ok: true, id: result.data.id });
  });
}
