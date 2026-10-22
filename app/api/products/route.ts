import { listProductSummaries } from "@/lib/products";

export async function GET() {
  const products = await listProductSummaries();

  return Response.json({ products });
}
