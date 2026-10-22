import Link from "next/link";
import { connection } from "next/server";
import { categoryTones, type CategoryTone } from "./categories";
import { listCategoriesForSite } from "@/lib/categories";

export const instant = false;

function toneFor(tone: string) {
  return categoryTones[tone as CategoryTone] ?? categoryTones.rose;
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default async function CategoriesPage() {
  await connection();

  const categories = await listCategoriesForSite();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          Categories
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          Fresh blooms, cakes, chocolates and gifts for every occasion.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className="mt-8 text-base text-neutral-600">No categories yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((category) => {
            const tone = toneFor(category.tone);

            return (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className={`group flex h-full flex-col gap-4 rounded-2xl p-5 ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 ${tone.card}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xl ${tone.icon}`}
                    >
                      {category.icon}
                    </span>
                    <div className="min-w-0">
                      <h2
                        className={`truncate text-lg font-semibold ${tone.title}`}
                      >
                        {category.name}
                      </h2>
                      <p className={`text-sm font-medium ${tone.text}`}>
                        {category.count} products
                      </p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {category.samples.map((sample, index) => (
                      <li
                        key={sample}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          tone.badges[index % tone.badges.length]
                        }`}
                      >
                        {sample}
                      </li>
                    ))}
                  </ul>

                  <span
                    className={`mt-auto inline-flex items-center gap-1 text-sm font-semibold ${tone.text}`}
                  >
                    Browse category
                    <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
