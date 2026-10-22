"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavouriteProduct = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
};

type FavouritesState = {
  items: FavouriteProduct[];
  toggle: (product: FavouriteProduct) => void;
  remove: (slug: string) => void;
};

export const useFavourites = create<FavouritesState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (product) =>
        set((state) => ({
          items: state.items.some((item) => item.slug === product.slug)
            ? state.items.filter((item) => item.slug !== product.slug)
            : [...state.items, product],
        })),
      remove: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        })),
    }),
    { name: "softfreshflower:favourites" },
  ),
);
