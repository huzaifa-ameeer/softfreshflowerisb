import { jsonError, withAdmin } from "@/lib/api";
import { createProduct, listProducts, type ProductInput } from "@/lib/products";

function toNumber(value: string | null) {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function toBoolean(value: string | null) {
  return value === "1" || value === "true";
}

export async function GET(request: Request) {
  return withAdmin(request, async () => {
    const params = new URL(request.url).searchParams;

    const result = await listProducts({
      q: params.get("q") ?? undefined,
      category: params.get("category") ?? undefined,
      fresh: toBoolean(params.get("fresh")),
      top: toBoolean(params.get("top")),
      page: toNumber(params.get("page")),
      limit: toNumber(params.get("limit")),
    });

    return Response.json(result);
  });
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    let body: ProductInput;

    try {
      body = ((await request.json()) ?? {}) as ProductInput;
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const result = await createProduct(body);

    if (!result.ok) {
      return jsonError(result.status, result.error, result.details);
    }

    return Response.json({ product: result.data }, { status: 201 });
  });
}
