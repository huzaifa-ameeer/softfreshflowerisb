import Image from "next/image";

const WHATSAPP_NUMBER = "923188989545";

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

function whatsappHref(product: Product) {
  const message = `Hi there! Can i get some updates regarding this product\n\nProduct: ${product.name}\nDescription: ${product.description}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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
        {products.map((product) => (
          <li key={product.name}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-pink-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 sm:text-xs">
                  {product.category}
                </span>
                <h3 className="text-sm font-semibold text-pink-900 sm:text-base">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-600 sm:text-sm">
                  {product.description}
                </p>

                <a
                  href={whatsappHref(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#25D366] px-3 py-2 text-xs font-semibold text-green-800 transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:px-4 sm:text-sm"
                >
                  <WhatsAppIcon className="size-4 shrink-0 sm:size-5" />
                  <span className="sm:hidden">Chat now</span>
                  <span className="hidden sm:inline">Chat on WhatsApp</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
