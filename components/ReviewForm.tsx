"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { showToast } from "@/components/Toast";

const inputClass =
  "w-full rounded-md border border-pink-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

type ApiPayload = {
  error?: string;
  details?: Record<string, string>;
};

function errorText(payload: ApiPayload | null, status: number) {
  const detail = payload?.details
    ? Object.values(payload.details)[0]
    : undefined;

  return detail ?? payload?.error ?? `Could not post your review (${status})`;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5Z" />
    </svg>
  );
}

function StarsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="radiogroup"
        aria-label="Your rating"
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            className="cursor-pointer rounded p-0.5 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            <StarIcon
              className={`size-7 transition-colors ${
                star <= active ? "text-amber-400" : "text-neutral-300"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-neutral-500">
        {value ? `${value} of 5 stars` : "Select a rating"}
      </span>
    </div>
  );
}

export default function ReviewForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      const text = "Enter your name before posting.";

      setError(text);
      showToast(text, "error");
      return;
    }

    if (!rating) {
      const text = "Choose a star rating before posting.";

      setError(text);
      showToast(text, "error");
      return;
    }

    setPending(true);

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(slug)}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, message, rating }),
        },
      );

      const payload = (await response.json().catch(() => null)) as
        | ApiPayload
        | null;

      if (!response.ok) {
        const text = errorText(payload, response.status);

        setError(text);
        showToast(text, "error");
        return;
      }

      setName("");
      setRating(0);
      setMessage("");
      showToast("Thanks! Your review has been posted.");
      router.refresh();
    } catch {
      const text = "Network error — please try again.";

      setError(text);
      showToast(text, "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-4 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-200 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-pink-900">Drop a review</h3>
        <p className="text-sm text-neutral-600">
          No account needed. Your name and rating help other customers choose.
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
        Your name
        <input
          type="text"
          required
          minLength={2}
          maxLength={60}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Ayesha K."
          autoComplete="name"
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
        Your rating
        <StarsInput value={rating} onChange={setRating} />
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
        Your review
        <textarea
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us how the flowers were…"
          className={`${inputClass} resize-y`}
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-pink-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && (
            <span
              aria-hidden="true"
              className="inline-block size-4 animate-spin rounded-full border-2 border-black/25 border-t-black"
            />
          )}
          {pending ? "Posting…" : "Post review"}
        </button>
        <span className="text-xs text-neutral-500">
          {message.trim().length}/1000
        </span>
      </div>
    </form>
  );
}
