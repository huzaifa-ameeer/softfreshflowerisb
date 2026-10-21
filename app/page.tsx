import Link from "next/link";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  
  return (
    <main className="flex flex-1 flex-col">
      <HeroCarousel />

      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-6 sm:gap-4 sm:py-8">
        <Link
          href="/about-us"
          className="inline-flex items-center justify-center rounded-md border border-pink-500 px-6 py-3 text-base font-semibold text-pink-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          About Us
        </Link>
        <Link
          href="/most-selling-products"
          className="inline-flex items-center justify-center rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          Top Selling Products
        </Link>
      </div>

      <FeaturedProducts />

      <div className="flex justify-center px-4 pt-2 pb-14 sm:pt-4 sm:pb-16">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          Explore all categories
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
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
