"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AUTO_ADVANCE_MS = 2000;

const slides = [
  { src: "/1.png", alt: "Seasonal flowers from Soft Fresh Flower ISB" },
  { src: "/6.png", alt: "Seasonal flowers from Soft Fresh Flower ISB" },
  { src: "/2.png", alt: "Seasonal flowers from Soft Fresh Flower ISB" },
  { src: "/3.png", alt: "Seasonal flowers from Soft Fresh Flower ISB" },
  { src: "/4.png", alt: "Seasonal flowers from Soft Fresh Flower ISB" },
  { src: "/5.png", alt: "Seasonal flowers from Soft Fresh Flower ISB" },
];

function ChevronIcon({
  className,
  direction,
}: {
  className?: string;
  direction: "left" | "right";
}) {
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
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(
      () => setIndex((current) => (current + 1) % slides.length),
      AUTO_ADVANCE_MS,
    );

    return () => clearTimeout(timer);
  }, [index, paused]);

  const step = (offset: number) =>
    setIndex((current) => (current + offset + slides.length) % slides.length);

  return (
    <section className="px-0 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div
        className="relative mx-auto aspect-video w-full max-w-7xl overflow-hidden rounded-2xl bg-pink-100 sm:w-[92%] lg:w-[70%]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className="flex h-full w-full transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              aria-hidden={i !== index}
              className="relative h-full w-full shrink-0"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4 sm:size-12"
        >
          <ChevronIcon className="size-5 sm:size-6" direction="left" />
        </button>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4 sm:size-12"
        >
          <ChevronIcon className="size-5 sm:size-6" direction="right" />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-black/40 px-3 py-2 sm:bottom-4">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-md transition-all ${
                i === index ? "w-6 bg-pink-500" : "w-2 bg-white/80 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
