import { jsonError, withAdmin } from "@/lib/api";
import {
  createCategory,
  listCategories,
  type CategoryInput,
} from "@/lib/categories";

async function readBody(
  request: Request,
): Promise<
  { ok: true; body: CategoryInput } | { ok: false; response: Response }
> {
  try {
    const body = (await request.json()) as CategoryInput | null;

    return { ok: true, body: body ?? {} };
  } catch {
    return { ok: false, response: jsonError(400, "Invalid JSON body") };
  }
}

export async function GET(request: Request) {
  return withAdmin(request, async () => {
    const categories = await listCategories();

    return Response.json({ categories });
  });
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const parsed = await readBody(request);

    if (!parsed.ok) return parsed.response;

    const result = await createCategory(parsed.body);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json({ category: result.data }, { status: 201 });
  });
}
