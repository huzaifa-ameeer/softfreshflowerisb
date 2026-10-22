import { connection } from "next/server";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/products";

export const instant = false;

export default async function MostSellingProductsPage() {
  await connection();

  const { items } = await listProducts({ top: true, limit: 40 });

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          Most Selling Products
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          The arrangements our customers order again and again.
        </p>
      </header>

      {items.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((product) => (
            <li key={product.slug}>
              <ProductCard
                product={{
                  slug: product.slug,
                  name: product.name,
                  category: product.categoryName,
                  description: product.description,
                  image: product.image,
                  price: product.price,
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-base text-neutral-600">
          Nothing here yet — check back soon.
        </p>
      )}
    </main>
  );
}
