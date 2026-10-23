"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { showToast } from "@/components/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Spinner } from "@/components/admin/Loader";
import { adminFetch, errorMessage } from "@/lib/admin-client";

type AdminReview = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  published: boolean;
  publishedAt: string;
};

type Filter = "all" | "published" | "hidden";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All reviews" },
  { key: "published", label: "Live on /reviews" },
  { key: "hidden", label: "Hidden" },
];

function formatDate(value: string) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Stars({ rating }: { rating: number }) {
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
          className={`size-3.5 ${
            star <= Math.round(rating) ? "text-amber-400" : "text-neutral-200"
          }`}
        >
          <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5Z" />
        </svg>
      ))}
    </span>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.5 10.5 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9" />
      <path d="M6.2 6.3C3.6 8 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.1-.9" />
    </svg>
  );
}

const actionButton =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export default function ReviewsManager({
  initialReviews,
}: {
  initialReviews: AdminReview[];
}) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminReview | null>(null);

  const counts = useMemo(
    () => ({
      all: reviews.length,
      published: reviews.filter((review) => review.published).length,
      hidden: reviews.filter((review) => !review.published).length,
    }),
    [reviews],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return reviews.filter((review) => {
      if (filter === "published" && !review.published) return false;
      if (filter === "hidden" && review.published) return false;

      if (!needle) return true;

      return [review.productName, review.author, review.body, review.title]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [reviews, filter, query]);

  function matchesFilter(review: AdminReview, nextFilter: Filter) {
    if (nextFilter === "published") return review.published;
    if (nextFilter === "hidden") return !review.published;
    return true;
  }

  async function togglePublished(review: AdminReview) {
    const next = !review.published;
    const previous = reviews;

    setBusy(review.id);
    setReviews((current) =>
      current
        .map((item) =>
          item.id === review.id
            ? {
                ...item,
                published: next,
                publishedAt: next
                  ? new Date().toISOString().slice(0, 10)
                  : "",
              }
            : item,
        )
        .filter((item) => matchesFilter(item, filter)),
    );

    const result = await adminFetch(
      `/api/admin/reviews/${review.productId}/${review.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      },
    );

    setBusy(null);

    if (!result.ok) {
      setReviews(previous);
      showToast(errorMessage(result), "error");
      return;
    }

    showToast(
      next
        ? "Review posted to /reviews"
        : "Review hidden temporarily — you can post it again anytime.",
      next ? "success" : "info",
    );
  }

  async function handleDelete() {
    if (!pendingDelete) return;

    const target = pendingDelete;
    const previous = reviews;

    setBusy(target.id);
    setReviews((current) => current.filter((item) => item.id !== target.id));

    const result = await adminFetch(
      `/api/admin/reviews/${target.productId}/${target.id}`,
      { method: "DELETE" },
    );

    setBusy(null);

    if (!result.ok) {
      setReviews(previous);
      showToast(errorMessage(result), "error");
      return;
    }

    setPendingDelete(null);
    showToast("Review deleted", "info");
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Manage Reviews
        </h1>
        <p className="text-sm text-neutral-500">
          Choose what appears on the public /reviews page. Hidden reviews stay in
          the database and can be shown again at any time.
        </p>
      </header>

      <ul className="grid grid-cols-3 gap-3">
        {(
          [
            ["Total reviews", counts.all, "text-neutral-900"],
            ["Live on /reviews", counts.published, "text-green-700"],
            ["Hidden", counts.hidden, "text-neutral-500"],
          ] as const
        ).map(([label, value, tone]) => (
          <li
            key={label}
            className="rounded-xl bg-white p-4 ring-1 ring-neutral-200"
          >
            <p className="text-xs font-medium text-neutral-500">{label}</p>
            <p className={`mt-0.5 text-2xl font-bold ${tone}`}>{value}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={filter === item.key}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === item.key
                  ? "bg-pink-500 text-black"
                  : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-pink-50"
              }`}
            >
              {item.label} ({counts[item.key]})
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search author, product or review…"
          aria-label="Search reviews"
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:w-72"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-neutral-500 ring-1 ring-neutral-200">
          {reviews.length === 0
            ? "No reviews have been submitted yet."
            : query.trim()
              ? "No reviews match your search."
              : filter === "published"
                ? "No reviews are live on /reviews yet."
                : "No hidden reviews."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((review) => {
            const isBusy = busy === review.id;

            return (
              <li
                key={`${review.productId}-${review.id}`}
                className="rounded-2xl bg-white p-4 ring-1 ring-neutral-200 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">
                        {review.author || "Anonymous"}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          review.published
                            ? "bg-green-100 text-green-800"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {review.published ? "Live on /reviews" : "Hidden"}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      On{" "}
                      <Link
                        href={`/products/${review.productSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-pink-700 hover:underline"
                      >
                        {review.productName}
                      </Link>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Stars rating={review.rating} />
                      <span>{review.rating}/5</span>
                    </div>
                    <time dateTime={review.date}>
                      Submitted {formatDate(review.date)}
                    </time>
                    {review.published && review.publishedAt && (
                      <span className="text-green-700">
                        Live since {formatDate(review.publishedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {review.title && (
                  <h2 className="mt-3 text-sm font-semibold text-neutral-900">
                    {review.title}
                  </h2>
                )}

                <p className="mt-2 text-sm whitespace-pre-line text-neutral-700">
                  {review.body}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
                  <button
                    type="button"
                    onClick={() => togglePublished(review)}
                    disabled={isBusy || review.published}
                    title={
                      review.published
                        ? "This review is already live on /reviews"
                        : "Post this review to the public /reviews page"
                    }
                    className={`${actionButton} ${
                      review.published
                        ? "bg-neutral-100 text-neutral-400"
                        : "bg-pink-500 text-black hover:bg-pink-600"
                    }`}
                  >
                    {isBusy && !review.published ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <EyeIcon className="size-3.5" />
                    )}
                    Post to /reviews
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePublished(review)}
                    disabled={isBusy || !review.published}
                    title={
                      review.published
                        ? "Hide this review temporarily without deleting it"
                        : "This review is already hidden"
                    }
                    className={`${actionButton} ${
                      !review.published
                        ? "bg-neutral-100 text-neutral-400"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {isBusy && review.published ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <EyeOffIcon className="size-3.5" />
                    )}
                    Hide temporarily
                  </button>

                  <button
                    type="button"
                    onClick={() => setPendingDelete(review)}
                    disabled={isBusy}
                    className={`${actionButton} border border-red-200 text-red-700 hover:bg-red-50`}
                  >
                    <TrashIcon className="size-3.5" />
                    Delete permanently
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete review"
        message={
          pendingDelete
            ? `Delete the review by “${pendingDelete.author || "Anonymous"}” on “${pendingDelete.productName}”? This cannot be undone.`
            : ""
        }
        busy={pendingDelete !== null && busy === pendingDelete.id}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!busy) setPendingDelete(null);
        }}
      />
    </div>
  );
}
