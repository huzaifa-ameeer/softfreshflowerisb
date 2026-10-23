import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ReviewForm from "@/components/ReviewForm";
import { getProduct, listProductSummaries } from "@/lib/products";

const WHATSAPP_NUMBER = "923188989545";

export async function generateStaticParams() {
  const products = await listProductSummaries();

  return products.map((product) => ({ slug: product.slug }));
}

function whatsappHref(name: string) {
  const message = `Hi there! I would like to order:\n\nProduct: ${name}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price: number) {
  return `Rs ${price.toLocaleString("en-US")}`;
}

function formatDate(value: string) {
  if (!value) return "";

  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);

  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`size-4 ${star <= rounded ? "text-amber-400" : "text-neutral-300"}`}
        >
          <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5Z" />
        </svg>
      ))}
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
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

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images = product.images.map((image) => image.url).filter(Boolean);

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
          <li>
            <Link
              href={`/categories/${product.category}`}
              className="hover:text-pink-700"
            >
              {product.categoryName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-neutral-700">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} name={product.name} />

        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold tracking-wide text-pink-700 uppercase">
            {product.categoryName}
          </span>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
              {product.name}
            </h1>
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <Stars rating={product.rating} />
                <span className="text-sm text-neutral-600">
                  {product.rating} · {product.reviews.length} reviews
                </span>
              </div>
            )}
          </div>

          <p className="text-2xl font-bold text-pink-900">
            {formatPrice(product.price)}
          </p>

          <p className="text-base text-neutral-600">{product.description}</p>

          {product.highlights.length > 0 && (
            <ul className="flex flex-col gap-2">
              {product.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-pink-500" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href={whatsappHref(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              <WhatsAppIcon className="size-5" />
              Order on WhatsApp
            </a>
            <Link
              href={`/categories/${product.category}`}
              className="inline-flex items-center justify-center rounded-md border border-pink-500 px-6 py-3 text-base font-semibold text-pink-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              More in {product.categoryName}
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-pink-200 pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-pink-700">
          Customer reviews
        </h2>

        {product.rating > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} />
            <span className="text-sm font-medium text-neutral-700">
              {product.rating} out of 5
            </span>
            <span className="text-sm text-neutral-500">
              · {product.reviews.length} reviews
            </span>
          </div>
        )}

        {product.reviews.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review, index) => (
              <li
                key={review.id || index}
                className="flex flex-col gap-2 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-200"
              >
                <div className="flex items-center justify-between gap-2">
                  {review.rating > 0 ? (
                    <Stars rating={review.rating} />
                  ) : (
                    <span />
                  )}
                  <time
                    dateTime={review.date}
                    className="text-xs text-neutral-500"
                  >
                    {formatDate(review.date)}
                  </time>
                </div>
                {review.title && (
                  <h3 className="text-sm font-semibold text-pink-900">
                    {review.title}
                  </h3>
                )}
                <p className="text-sm whitespace-pre-line text-neutral-600">
                  {review.body}
                </p>
                <p className="mt-auto text-xs font-medium text-neutral-500">
                  — {review.author}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-neutral-600">
            No reviews yet. Be the first to share your thoughts.
          </p>
        )}

        <ReviewForm slug={product.slug} />
      </section>
    </main>
  );
}
