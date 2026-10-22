"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function ProductCarousel({
  products,
}: {
  products: ProductCardData[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth;

    setCanScroll(max > 8);
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  function move(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: "smooth",
    });
  }

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={update}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:gap-5 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0"
      >
        {products.map((product) => (
          <div
            key={product.slug}
            className="w-[62%] shrink-0 snap-start sm:w-[30%] lg:w-auto lg:shrink"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScroll && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={atStart}
            aria-label="Previous products"
            className="absolute top-1/2 left-1 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-pink-700 shadow-md ring-1 ring-pink-200 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:cursor-default disabled:opacity-0 sm:size-11 lg:hidden"
          >
            <ChevronIcon direction="left" />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            disabled={atEnd}
            aria-label="Next products"
            className="absolute top-1/2 right-1 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-pink-700 shadow-md ring-1 ring-pink-200 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:cursor-default disabled:opacity-0 sm:size-11 lg:hidden"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}
    </div>
  );
}
