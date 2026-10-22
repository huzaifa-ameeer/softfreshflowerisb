import Link from "next/link";
import { connection } from "next/server";
import { listPublishedReviews } from "@/lib/products";

export const instant = false;

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
          className={`size-4 ${
            star <= rounded ? "text-amber-400" : "text-neutral-200"
          }`}
        >
          <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5Z" />
        </svg>
      ))}
    </span>
  );
}

export default async function ReviewsPage() {
  await connection();

  const reviews = await listPublishedReviews();
  const average =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((total, review) => total + review.rating, 0) /
            reviews.length) *
            10,
        ) / 10
      : 0;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="flex flex-col gap-4">
        <span className="w-fit rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold tracking-wide text-pink-700 uppercase">
          Customer stories
        </span>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
              Reviews from our customers
            </h1>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              Real notes from people who ordered flowers, cakes and gifts across
              Islamabad and Rawalpindi. Every review is checked by our team
              before it goes live.
            </p>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-pink-200">
              <span className="text-3xl font-bold text-pink-700">
                {average.toFixed(1)}
              </span>
              <div className="flex flex-col gap-0.5">
                <Stars rating={average} />
                <span className="text-xs text-neutral-500">
                  {reviews.length} published review
                  {reviews.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {reviews.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl bg-white/70 p-6 ring-1 ring-pink-200 sm:p-8">
          <h2 className="text-lg font-semibold text-pink-900">
            No published reviews yet
          </h2>
          <p className="max-w-xl text-sm text-neutral-600">
            Reviews appear here once the shop approves them. Browse a product to
            leave the first one.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={`${review.productSlug}-${review.id}`}
              className="flex flex-col gap-3 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-200"
            >
              <div className="flex items-center justify-between gap-2">
                <Stars rating={review.rating} />
                <time
                  dateTime={review.date}
                  className="text-xs text-neutral-500"
                >
                  {formatDate(review.date)}
                </time>
              </div>

              {review.title && (
                <h2 className="text-sm font-semibold text-pink-900">
                  {review.title}
                </h2>
              )}

              <p className="text-sm whitespace-pre-line text-neutral-700">
                {review.body}
              </p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-pink-100 pt-3">
                <span className="text-xs font-medium text-neutral-500">
                  — {review.author || "Verified customer"}
                </span>
                <Link
                  href={`/products/${review.productSlug}`}
                  className="text-xs font-semibold text-pink-700 hover:underline"
                >
                  {review.productName}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
