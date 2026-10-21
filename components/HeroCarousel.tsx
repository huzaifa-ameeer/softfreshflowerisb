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

function DrawPath({
  delay,
  d,
  stroke,
}: {
  delay: number;
  d: string;
  stroke?: string;
}) {
  return (
    <path
      d={d}
      stroke={stroke}
      pathLength={1}
      strokeDasharray={1}
      style={{ animationDelay: `${delay}ms` }}
      className="draw-line"
    />
  );
}

function FlowerSprig({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 128"
      fill="none"
      stroke="#16a34a"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <DrawPath delay={0} d="M32 128C32 104 32 82 32 60" />
      <DrawPath delay={180} d="M32 106C20 102 13 90 15 78c13 4 18 17 17 28Z" />
      <DrawPath delay={300} d="M32 94c12-4 19-16 17-28-13 4-18 17-17 28Z" />
      <DrawPath
        delay={460}
        d="M18 60c0-18 6-32 14-40 8 8 14 22 14 40-6 4-22 4-28 0Z"
        stroke="#ec4899"
      />
      <DrawPath delay={700} d="M32 20v40" stroke="#ec4899" />
      <DrawPath delay={840} d="M23 32c0 12 2 20 4 26" stroke="#ec4899" />
      <DrawPath delay={840} d="M41 32c0 12-2 20-4 26" stroke="#ec4899" />
    </svg>
  );
}

function Cake({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 80"
      fill="none"
      stroke="#831843"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <DrawPath delay={0} d="M4 74h56" />
      <DrawPath delay={140} d="M10 48h44v26H10Z" />
      <DrawPath delay={280} d="M10 56h44" stroke="#ec4899" />
      <DrawPath delay={380} d="M20 30h24v18H20Z" />
      <DrawPath delay={500} d="M20 37h24" stroke="#ec4899" />
      <DrawPath delay={620} d="M32 18v12" />
      <DrawPath
        delay={720}
        d="M32 18c-3-3-3-7 0-10 3 3 3 7 0 10Z"
        stroke="#ec4899"
      />
    </svg>
  );
}

const sparkleShapes = {
  star: "M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z",
  spike: "M12 1l2.1 8.9L23 12l-8.9 2.1L12 23l-2.1-8.9L1 12l8.9-2.1Z",
  dot: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z",
  ring: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z",
} as const;

type SparkleShape = keyof typeof sparkleShapes;

function Sparkle({
  className,
  delay = 0,
  shape = "star",
  strong = false,
}: {
  className?: string;
  delay?: number;
  shape?: SparkleShape;
  strong?: boolean;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#ec4899" aria-hidden="true">
      <path
        className={strong ? "glow-strong" : "glow"}
        style={{ animationDelay: `${delay}ms` }}
        d={sparkleShapes[shape]}
      />
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
    <section className="relative px-0 py-5 sm:px-6 sm:py-8 lg:px-8">
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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-2 hidden items-end gap-2 lg:bottom-8 lg:left-4 lg:flex xl:left-8"
      >
        <FlowerSprig className="h-20 w-auto xl:h-28" />
        <FlowerSprig className="h-28 w-auto -rotate-6 xl:h-36" />

        <Sparkle
          className="absolute -top-8 right-6 h-3.5 w-3.5 xl:h-4 xl:w-4"
          delay={0}
          shape="star"
          strong
        />
        <Sparkle
          className="absolute right-1 top-14 h-2.5 w-2.5"
          delay={350}
          shape="dot"
        />
        <Sparkle
          className="absolute -left-3 top-28 h-3 w-3"
          delay={700}
          shape="spike"
        />
        <Sparkle
          className="absolute -top-3 left-12 h-2.5 w-2.5"
          delay={1050}
          shape="ring"
          strong
        />
        <Sparkle
          className="absolute -left-2 top-6 h-2.5 w-2.5"
          delay={1400}
          shape="dot"
        />
        <Sparkle
          className="absolute right-10 top-6 h-2.5 w-2.5"
          delay={1750}
          shape="star"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-2 hidden items-end gap-2 lg:bottom-8 lg:right-4 lg:flex xl:right-8"
      >
        <Cake className="h-20 w-auto xl:h-28" />
        <FlowerSprig className="h-28 w-auto rotate-6 xl:h-36" />

        <Sparkle
          className="absolute -top-8 left-6 h-3.5 w-3.5 xl:h-4 xl:w-4"
          delay={200}
          shape="spike"
          strong
        />
        <Sparkle
          className="absolute left-1 top-14 h-2.5 w-2.5"
          delay={550}
          shape="dot"
        />
        <Sparkle
          className="absolute -right-3 top-24 h-3 w-3"
          delay={900}
          shape="star"
        />
        <Sparkle
          className="absolute -top-3 right-12 h-2.5 w-2.5"
          delay={1250}
          shape="ring"
        />
        <Sparkle
          className="absolute -right-2 top-6 h-2.5 w-2.5"
          delay={1600}
          shape="dot"
          strong
        />
        <Sparkle
          className="absolute left-10 top-6 h-2.5 w-2.5"
          delay={1950}
          shape="star"
        />
      </div>
    </section>
  );
}
