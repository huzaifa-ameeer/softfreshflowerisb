import Link from "next/link";
import { categoryTones, type CategoryTone } from "@/app/categories/categories";
import { LinkPendingOverlay, LinkPendingSwap } from "@/components/LinkPending";
import { listCategoriesForSite } from "@/lib/categories";

function toneFor(tone: string) {
  return categoryTones[tone as CategoryTone] ??  categoryTones.rose;
}

export default async function CategoryStrip() {
  const categories = (await listCategoriesForSite()).slice(0, 4);

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-pink-700 sm:text-3xl">
          Shop by category
        </h2>
        <p className="max-w-2xl text-base text-neutral-600">
          A few of our collections — pick one to explore.
        </p>
      </header>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((category) => {
          const tone = toneFor(category.tone);

          return (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className={`group relative flex h-full flex-col items-center gap-3 rounded-2xl p-5 text-center ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 ${tone.card}`}
              >
                <LinkPendingOverlay />
                <span
                  aria-hidden="true"
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ${tone.icon}`}
                >
                  {category.icon}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h3
                    className={`truncate text-sm font-semibold sm:text-base ${tone.title}`}
                  >
                    {category.name}
                  </h3>
                  <p className={`text-xs font-medium ${tone.text}`}>
                    {category.count} products
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          Explore all categories
          <LinkPendingSwap className="size-5">
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
          </LinkPendingSwap>
        </Link>
      </div>
    </section>
  );
}
