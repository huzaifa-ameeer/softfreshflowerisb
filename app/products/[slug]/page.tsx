import { allProducts } from "@/app/categories/categories";

export const instant = false;

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  await params;

  return <main className="flex flex-1 flex-col" />;
}
