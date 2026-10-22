"use client";

import { useFavourites, type FavouriteProduct } from "@/lib/favourites-store";

function HeartIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function FavouriteButton({
  product,
  className = "",
}: {
  product: FavouriteProduct;
  className?: string;
}) {
  const items = useFavourites((state) => state.items);
  const toggle = useFavourites((state) => state.toggle);
  const active = items.some((item) => item.slug === product.slug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(product);
      }}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={active}
      className={`relative z-20 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-pink-600 shadow-sm ring-1 ring-pink-200 transition-colors hover:bg-pink-500 hover:text-white ${className}`}
    >
      <HeartIcon filled={active} className="size-4" />
    </button>
  );
}
