"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavourites } from "@/lib/favourites-store";

export default function FavouritesPage() {
  const items = useFavourites((state) => state.items);
  const remove = useFavourites((state) => state.remove);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          Favourites{" "}
          <span className="text-pink-500">({items.length})</span>
        </h1>
        <p className="max-w-2xl text-base text-neutral-600">
          Products you have saved for later.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-white/70 p-8 text-center ring-1 ring-pink-200">
          <span aria-hidden="true" className="text-4xl">
            💐
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-pink-900">
              No favourites yet
            </p>
            <p className="text-sm text-neutral-600">
              Tap the heart on any product to save it here.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            Browse categories
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-pink-200"
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-pink-100">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="block truncate text-sm font-semibold text-pink-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="truncate text-xs text-neutral-500">
                  {item.category}
                </p>
                <p className="text-sm font-bold text-pink-600">
                  Rs {item.price.toLocaleString("en-US")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => remove(item.slug)}
                className="shrink-0 cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
