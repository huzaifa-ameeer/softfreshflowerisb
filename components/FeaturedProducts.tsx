import ProductCard from "@/components/ProductCard";
import { slugify } from "@/app/categories/categories";
import { getProductDetail } from "@/app/products/products";

type Product = {
  name: string;
  category: string;
  description: string;
  image: string;
};

const products: Product[] = [
  {
    name: "Blush Rose Bouquet",
    category: "Bouquets",
    description:
      "Two dozen blush roses hand-tied with eucalyptus and wrapped in kraft paper.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Rose_Flower_Bouquet_052.JPG/960px-Rose_Flower_Bouquet_052.JPG",
  },
  {
    name: "Rose Petal Celebration Cake",
    category: "Flower Cakes",
    description:
      "Vanilla sponge layered with rose cream and finished with fresh edible petals.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Cake_Flowers.jpg/960px-Cake_Flowers.jpg",
  },
  {
    name: "Jasmine Gajra",
    category: "Gajray",
    description:
      "Fresh jasmine buds strung by hand, ready to wear for weddings and eids.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Jasmine_Garland.jpg/960px-Jasmine_Garland.jpg",
  },
  {
    name: "Chocolate Bloom Box",
    category: "Chocolates",
    description:
      "Assorted dark and milk truffles arranged with dried rose buds in a keepsake box.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Assorted_Chocolate_Collection.jpg/960px-Assorted_Chocolate_Collection.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-2 pb-10 sm:px-6 sm:pt-4 sm:pb-14 lg:px-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-pink-700 sm:text-3xl">
          Fresh favourites
        </h2>
        <p className="max-w-2xl text-base text-neutral-600">
          A few of our most-loved arrangements, delivered across Islamabad.
        </p>
      </header>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => {
          const slug = slugify(product.name);
          const detail = getProductDetail(slug);

          if (!detail) return null;

          return (
            <li key={product.name}>
              <ProductCard
                product={{
                  slug,
                  name: product.name,
                  category: product.category,
                  description: product.description,
                  image: product.image,
                  price: detail.price,
                }}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
