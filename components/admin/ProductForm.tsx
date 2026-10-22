"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { showToast } from "@/components/Toast";
import { Spinner } from "@/components/admin/Loader";
import { adminFetch, errorMessage } from "@/lib/admin-client";

export type AdminProductImage = {
  url: string;
  publicId: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  description: string;
  images: AdminProductImage[];
  isFresh: boolean;
  isTopSelling: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const MAX_IMAGES = 3;
const CATEGORY_CACHE_MS = 60_000;

let categoriesCache: { list: Category[]; at: number } | null = null;

async function loadCategories() {
  if (
    categoriesCache &&
    Date.now() - categoriesCache.at < CATEGORY_CACHE_MS
  ) {
    return categoriesCache.list;
  }

  const result = await adminFetch<{ categories: Category[] }>(
    "/api/admin/categories",
  );

  if (!result.ok) return null;

  const list = result.data.categories ?? [];
  categoriesCache = { list, at: Date.now() };

  return list;
}

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const labelClass =
  "flex flex-col gap-1.5 text-sm font-medium text-neutral-700";

const primaryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60";

const ghostButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100";

export default function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: AdminProduct | null;
  onSaved?: (product: AdminProduct) => void;
  onCancel?: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<AdminProductImage[]>(
    product?.images ?? [],
  );
  const [isFresh, setIsFresh] = useState(product?.isFresh ?? false);
  const [isTopSelling, setIsTopSelling] = useState(product?.isTopSelling ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      const list = await loadCategories();

      if (list) {
        setCategories(list);
        setCategory((current) => current || list[0]?.slug || "");
      }
    })();
  }, []);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      showToast(`You can add up to ${MAX_IMAGES} images`, "info");
      return;
    }

    const formData = new FormData();
    files.slice(0, remaining).forEach((file) => formData.append("file", file));

    setUploading(true);
    const result = await adminFetch<{ images: AdminProductImage[] }>(
      "/api/admin/uploads",
      { method: "POST", body: formData },
    );
    setUploading(false);

    if (fileRef.current) fileRef.current.value = "";

    if (!result.ok) {
      showToast(errorMessage(result), "error");
      return;
    }

    setImages((current) =>
      [...current, ...result.data.images].slice(0, MAX_IMAGES),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name,
      category,
      price: Number(price),
      description,
      images,
      isFresh,
      isTopSelling,
    };

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(payload);

    const result = product
      ? await adminFetch<{ product: AdminProduct }>(
          `/api/admin/products/${product.id}`,
          { method: "PATCH", headers, body },
        )
      : await adminFetch<{ product: AdminProduct }>("/api/admin/products", {
          method: "POST",
          headers,
          body,
        });

    setSaving(false);

    if (!result.ok) {
      showToast(errorMessage(result), "error");
      return;
    }

    showToast(product ? "Product updated" : "Product created");
    onSaved?.(result.data.product);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-neutral-200"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Category
          <select
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            <option value="">Select a category</option>
            {categories.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Price (Rs)
          <input
            required
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-700">
          Images ({images.length}/{MAX_IMAGES})
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {images.map((image, index) => (
            <div
              key={image.publicId || image.url || index}
              className="relative size-24 overflow-hidden rounded-xl ring-1 ring-neutral-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt=""
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setImages((current) =>
                    current.filter((_, position) => position !== index),
                  )
                }
                className="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-neutral-300 text-xs text-neutral-500 hover:bg-neutral-50">
              {uploading ? (
                <Spinner className="size-5" />
              ) : (
                <>
                  <span className="text-lg">＋</span>
                  Add image
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isFresh}
            onChange={(event) => setIsFresh(event.target.checked)}
            className="size-4 cursor-pointer"
          />
          Fresh (homepage)
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isTopSelling}
            onChange={(event) => setIsTopSelling(event.target.checked)}
            className="size-4 cursor-pointer"
          />
          Top selling
        </label>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving && <Spinner className="size-4" />}
          {product ? "Save changes" : "Create product"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={ghostButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
