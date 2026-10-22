"use client";

import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/components/Toast";
import { Spinner } from "@/components/admin/Loader";
import ProductForm, { type AdminProduct } from "@/components/admin/ProductForm";
import { adminFetch, errorMessage } from "@/lib/admin-client";

type Mode = "all" | "fresh" | "top";

const headings: Record<Mode, { title: string; description: string }> = {
  all: {
    title: "Edit/Delete Products",
    description: "Update details or remove products from the catalog.",
  },
  fresh: {
    title: "Fresh Products",
    description: "Products shown in the homepage “Fresh favourites” row.",
  },
  top: {
    title: "Top Selling Products",
    description: "Products listed on the Most Selling Products page.",
  },
};

const toggleBase =
  "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export default function ProductsManager({ mode }: { mode: Mode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const query = mode === "fresh" ? "?fresh=1" : mode === "top" ? "?top=1" : "";
    const result = await adminFetch<{ items: AdminProduct[] }>(
      `/api/admin/products${query}`,
    );

    if (result.ok) {
      setProducts(result.data.items ?? []);
      setError(null);
    }
  }, [mode]);

  useEffect(() => {
    void (async () => {
      const query =
        mode === "fresh" ? "?fresh=1" : mode === "top" ? "?top=1" : "";
      const result = await adminFetch<{ items: AdminProduct[] }>(
        `/api/admin/products${query}`,
      );

      if (result.ok) {
        setProducts(result.data.items ?? []);
        setError(null);
      } else {
        setError(errorMessage(result));
      }

      setLoading(false);
    })();
  }, [mode]);

  async function toggle(product: AdminProduct, field: "isFresh" | "isTopSelling") {
    setBusy(product.id);

    const result = await adminFetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !product[field] }),
    });

    setBusy(null);

    if (!result.ok) {
      showToast(errorMessage(result), "info");
      return;
    }

    showToast("Updated");
    await refresh();
  }

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`Delete “${product.name}”? This also removes its images from Cloudinary.`)) {
      return;
    }

    setBusy(product.id);

    const result = await adminFetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });

    setBusy(null);

    if (!result.ok) {
      showToast(errorMessage(result), "info");
      return;
    }

    showToast("Product deleted", "info");
    await refresh();
  }

  const heading = headings[mode];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {heading.title}
        </h1>
        <p className="text-sm text-neutral-500">{heading.description}</p>
      </header>

      {editing && (
        <ProductForm
          product={editing}
          onSaved={async () => {
            setEditing(null);
            await refresh();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <Spinner className="size-6" />
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500">No products here yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200"
            >
              <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {product.images[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0].url}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {product.name}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {product.categoryName} · Rs {product.price.toLocaleString("en-US")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggle(product, "isFresh")}
                  disabled={busy === product.id}
                  className={`${toggleBase} ${
                    product.isFresh
                      ? "border-pink-500 bg-pink-500 text-black"
                      : "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  Fresh
                </button>

                <button
                  type="button"
                  onClick={() => toggle(product, "isTopSelling")}
                  disabled={busy === product.id}
                  className={`${toggleBase} ${
                    product.isTopSelling
                      ? "border-pink-500 bg-pink-500 text-black"
                      : "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  Top
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(product)}
                  className="inline-flex cursor-pointer items-center rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  disabled={busy === product.id}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy === product.id ? <Spinner className="size-3" /> : null}
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
