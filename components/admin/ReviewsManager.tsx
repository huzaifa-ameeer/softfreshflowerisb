"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  { key: "all", label: "All" },
  { key: "published", label: "On /reviews" },
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
          className={`size-4 ${
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

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminReview | null>(null);

  useEffect(() => {
    void (async () => {
      const result = await adminFetch<{ reviews: AdminReview[] }>(
        "/api/admin/reviews",
      );

      if (result.ok) {
        setReviews(result.data.reviews ?? []);
        setError(null);
      } else {
        setError(errorMessage(result));
      }

      setLoading(false);
    })();
  }, []);

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

      return [review.productName, review.author, review.body]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [reviews, filter, query]);

  async function togglePublished(review: AdminReview) {
    const next = !review.published;

    setBusy(review.id);
    setReviews((current) =>
      current.map((item) =>
        item.id === review.id
          ? {
              ...item,
              published: next,
              publishedAt: next
                ? new Date().toISOString().slice(0, 10)
                : "",
            }
          : item,
      ),
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
      setReviews((current) =>
        current.map((item) =>
          item.id === review.id
            ? {
                ...item,
                published: review.published,
                publishedAt: review.publishedAt,
              }
            : item,
        ),
      );
      showToast(errorMessage(result), "error");
      return;
    }

    showToast(
      next ? "Review posted to /reviews" : "Review removed from /reviews",
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
          See every review, remove abusive ones, and choose which reviews appear
          on the public reviews page.
        </p>
      </header>

      <ul className="grid grid-cols-3 gap-3">
        {(
          [
            ["Total reviews", counts.all, "text-neutral-900"],
            ["On /reviews", counts.published, "text-green-700"],
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
          placeholder="Search name, product or text…"
          aria-label="Search reviews"
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:w-72"
        />
      </div>

      {loading ? (
        <Spinner className="size-6" />
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : visible.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-neutral-500 ring-1 ring-neutral-200">
          No reviews match this view.
        </p>
      ) : (
        <ul className="grid gap-4 xl:grid-cols-2">
          {visible.map((review) => (
            <li
              key={`${review.productId}-${review.id}`}
              className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-sm font-semibold text-neutral-900">
                    {review.author || "Anonymous"}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    Review on {review.productName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    review.published
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {review.published ? "On /reviews" : "Hidden"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <Stars rating={review.rating} />
                <span>{review.rating}/5</span>
                <span aria-hidden="true">·</span>
                <time dateTime={review.date}>{formatDate(review.date)}</time>
                <span aria-hidden="true">·</span>
                <Link
                  href={`/products/${review.productSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-medium text-pink-700 hover:underline"
                >
                  {review.productName}
                </Link>
              </div>

              <p className="text-sm whitespace-pre-line text-neutral-700">
                {review.body}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
                <button
                  type="button"
                  onClick={() => togglePublished(review)}
                  disabled={busy === review.id}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    review.published
                      ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      : "bg-pink-500 text-black hover:bg-pink-600"
                  }`}
                >
                  {review.published ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                  {review.published ? "Remove from /reviews" : "Post to /reviews"}
                </button>

                <button
                  type="button"
                  onClick={() => setPendingDelete(review)}
                  disabled={busy === review.id}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <TrashIcon className="size-4" />
                  Delete
                </button>

                {busy === review.id && <Spinner className="size-4" />}
              </div>
            </li>
          ))}
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
