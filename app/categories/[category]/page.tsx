import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ProductCarousel from "@/components/ProductCarousel";
import { categoryTones, type CategoryTone } from "../categories";
import { getCategory } from "@/lib/categories";
import { listProductsByCategory } from "@/lib/products";

function toneFor(tone: string) {
  return categoryTones[tone as CategoryTone] ?? categoryTones.rose;
}

export default async function CategoryPage({
  params,
}: PageProps<"/categories/[category]">) {
  const { category: slug } = await params;
  await connection();
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = await listProductsByCategory(category.slug);
  const tone = toneFor(category.tone);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-neutral-500">
          <li>
            <Link href="/" className="hover:text-pink-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/categories" className="hover:text-pink-700">
              Categories
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-neutral-700">
            {category.name}
          </li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-col items-center gap-2 text-center">
        <span
          aria-hidden="true"
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ${tone.icon}`}
        >
          {category.icon}
        </span>
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight sm:text-4xl ${tone.title}`}
          >
            {category.name}
          </h1>
          <p className="text-sm font-medium text-neutral-600">
            {products.length} products
          </p>
        </div>
      </header>

      {products.length > 0 ? (
        <div className="mt-8">
          <ProductCarousel
            products={products.map((product) => ({
              slug: product.slug,
              name: product.name,
              category: product.categoryName || category.name,
              description: product.description,
              image: product.image,
              price: product.price,
            }))}
          />
        </div>
      ) : (
        <p className="mt-8 text-base text-neutral-600">
          We are still arranging this collection. Meanwhile, browse the other
          categories.
        </p>
      )}
    </main>
  );
}
