import ProductCarousel from "@/components/ProductCarousel";
import { listProducts } from "@/lib/products";

export default async function FeaturedProducts() {
  const { items } = await listProducts({ fresh: true, limit: 20 });

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-2 pb-10 sm:px-6 sm:pt-4 sm:pb-14 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-pink-700 sm:text-3xl">
          Fresh favourites
        </h2>
        <p className="max-w-2xl text-base text-neutral-600">
          A few of our most-loved arrangements, delivered across Islamabad.
        </p>
      </header>

      <div className="mt-6">
        <ProductCarousel
          products={items.map((product) => ({
            slug: product.slug,
            name: product.name,
            category: product.categoryName,
            description: product.description,
            image: product.image,
            price: product.price,
          }))}
        />
      </div>
    </section>
  );
}
