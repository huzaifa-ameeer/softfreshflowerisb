import Link from "next/link";
import CategoryStrip from "@/components/CategoryStrip";
import FeatureStrip from "@/components/FeatureStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroCarousel from "@/components/HeroCarousel";
import { LinkPendingSwap } from "@/components/LinkPending";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroCarousel />

      <section className="mx-auto flex w-full max-w-7xl justify-center px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Link
          href="/most-selling-products"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-pink-500 px-8 py-3.5 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:w-auto"
        >
          Top Selling Products
          <LinkPendingSwap className="size-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </LinkPendingSwap>
        </Link>
      </section>

      <FeatureStrip />

      <FeaturedProducts />

      <CategoryStrip />
    </main>
  );
}
