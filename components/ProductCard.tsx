import Image from "next/image";
import Link from "next/link";
import FavouriteButton from "@/components/FavouriteButton";

const WHATSAPP_NUMBER = "923188989545";

export type ProductCardData = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
};

function whatsappHref(product: ProductCardData) {
  const message = `Hi there! Can i get some updates regarding this product\n\nProduct: ${product.name}\nDescription: ${product.description}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price: number) {
  return `Rs ${price.toLocaleString("en-US")}`;
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

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-pink-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
      />
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
        <span className="text-[10px] font-semibold tracking-wide text-pink-600 uppercase sm:text-xs">
          {product.category}
        </span>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-pink-900 sm:text-base">
            {product.name}
          </h3>
          <p className="shrink-0 text-sm font-bold text-pink-500 sm:text-base">
            {formatPrice(product.price)}
          </p>
        </div>
        <div className="relative z-20 mt-auto flex items-center justify-between gap-2">
          <a
            href={whatsappHref(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#25D366] px-3 py-2 text-xs font-semibold text-green-800 transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:px-4 sm:text-sm"
          >
            <WhatsAppIcon className="size-4 shrink-0 sm:size-5" />
            <span className="sm:hidden">Chat now</span>
            <span className="hidden sm:inline">Chat on WhatsApp</span>
          </a>

          <FavouriteButton
            product={{
              slug: product.slug,
              name: product.name,
              category: product.category,
              description: product.description,
              image: product.image,
              price: product.price,
            }}
          />
        </div>
      </div>
    </article>
  );
}
