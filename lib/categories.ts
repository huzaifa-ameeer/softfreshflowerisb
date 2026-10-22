import { isValidObjectId } from "mongoose";
import { revalidateTag, unstable_cache } from "next/cache";
import { categoryTones } from "@/app/categories/categories";
import { CATEGORIES_TAG, PRODUCTS_TAG } from "@/lib/cache-tags";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/lib/models/category";
import { productStatsByCategory } from "@/lib/products";
import { slugify } from "@/lib/slug";

const CATEGORY_TONES = Object.keys(categoryTones);

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  tone: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithStats = CategoryDTO & {
  count: number;
  samples: string[];
};

export type CategoryInput = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  icon?: unknown;
  tone?: unknown;
  order?: unknown;
};

export type ServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: number;
      error: string;
      details?: Record<string, string>;
    };

type CategoryRecord = {
  _id: unknown;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  tone?: string | null;
  order?: number | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function toIso(value: Date | string | null | undefined) {
  if (!value) return "";

  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function serializeCategory(record: CategoryRecord): CategoryDTO {
  return {
    id: String(record._id),
    name: record.name,
    slug: record.slug,
    description: record.description ?? "",
    icon: record.icon ?? "",
    tone: record.tone ?? "rose",
    order: record.order ?? 0,
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

function isDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

export function validateCategory(
  input: CategoryInput,
  options: { partial?: boolean } = {},
):
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; details: Record<string, string> } {
  const partial = options.partial ?? false;
  const details: Record<string, string> = {};
  const data: Record<string, unknown> = {};
  const provided = (key: keyof CategoryInput) => input[key] !== undefined;

  if (!partial || provided("name")) {
    const name = typeof input.name === "string" ? input.name.trim() : "";

    if (!name) details.name = "Required";
    else data.name = name;
  }

  if (provided("slug")) {
    const slug = typeof input.slug === "string" ? slugify(input.slug) : "";

    if (!slug) details.slug = "Invalid slug";
    else data.slug = slug;
  }

  if (provided("description")) {
    data.description =
      typeof input.description === "string" ? input.description.trim() : "";
  }

  if (provided("icon")) {
    data.icon = typeof input.icon === "string" ? input.icon.trim() : "";
  }

  if (provided("tone")) {
    const tone = typeof input.tone === "string" ? input.tone.trim() : "";

    if (!CATEGORY_TONES.includes(tone)) {
      details.tone = `Must be one of: ${CATEGORY_TONES.join(", ")}`;
    } else {
      data.tone = tone;
    }
  }

  if (provided("order")) {
    const order = Number(input.order);

    if (!Number.isFinite(order)) details.order = "Must be a number";
    else data.order = order;
  }

  if (Object.keys(details).length > 0) return { ok: false, details };

  return { ok: true, data };
}

async function findRecord(idOrSlug: string): Promise<CategoryRecord | null> {
  await connectDB();

  const query = isValidObjectId(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const doc = await CategoryModel.findOne(query).lean();

  return (doc as unknown as CategoryRecord) ?? null;
}

const cachedListCategories = unstable_cache(
  async () => {
    await connectDB();

    const docs = await CategoryModel.find().sort({ order: 1, name: 1 }).lean();

    return (docs as unknown as CategoryRecord[]).map(serializeCategory);
  },
  ["categories:list"],
  { tags: [CATEGORIES_TAG], revalidate: 300 },
);

export function listCategories() {
  return cachedListCategories();
}

const cachedListCategoriesForSite = unstable_cache(
  async () => {
    await connectDB();

    const [docs, stats] = await Promise.all([
      CategoryModel.find().sort({ order: 1, name: 1 }).lean(),
      productStatsByCategory(),
    ]);

    return (docs as unknown as CategoryRecord[]).map((record) => {
      const category = serializeCategory(record);
      const stat = stats.get(category.slug);

      return {
        ...category,
        count: stat?.count ?? 0,
        samples: stat?.samples ?? [],
      };
    });
  },
  ["categories:site"],
  { tags: [CATEGORIES_TAG, PRODUCTS_TAG], revalidate: 300 },
);

export function listCategoriesForSite() {
  return cachedListCategoriesForSite();
}

const cachedGetCategory = unstable_cache(
  async (idOrSlug: string) => {
    const record = await findRecord(idOrSlug);

    return record ? serializeCategory(record) : null;
  },
  ["categories:get"],
  { tags: [CATEGORIES_TAG], revalidate: 300 },
);

export function getCategory(idOrSlug: string) {
  return cachedGetCategory(idOrSlug);
}

export async function createCategory(
  input: CategoryInput,
): Promise<ServiceResult<CategoryDTO>> {
  const validation = validateCategory(input);

  if (!validation.ok) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed",
      details: validation.details,
    };
  }

  const data = { ...validation.data };

  if (!data.slug) data.slug = slugify(String(data.name ?? ""));

  await connectDB();

  try {
    const created = await CategoryModel.create(data);

    revalidateTag(CATEGORIES_TAG, "max");
    revalidateTag(PRODUCTS_TAG, "max");

    return {
      ok: true,
      data: serializeCategory(created.toObject() as unknown as CategoryRecord),
    };
  } catch (error) {
    if (isDuplicateKey(error)) {
      return {
        ok: false,
        status: 409,
        error: "A category with this slug already exists.",
      };
    }

    throw error;
  }
}

export async function updateCategory(
  idOrSlug: string,
  input: CategoryInput,
): Promise<ServiceResult<CategoryDTO>> {
  const validation = validateCategory(input, { partial: true });

  if (!validation.ok) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed",
      details: validation.details,
    };
  }

  const record = await findRecord(idOrSlug);

  if (!record) {
    return { ok: false, status: 404, error: "Category not found" };
  }

  if (Object.keys(validation.data).length === 0) {
    return { ok: true, data: serializeCategory(record) };
  }

  try {
    const updated = await CategoryModel.findByIdAndUpdate(
      record._id,
      { $set: validation.data },
      { new: true },
    ).lean();

    if (!updated) {
      return { ok: false, status: 404, error: "Category not found" };
    }

    revalidateTag(CATEGORIES_TAG, "max");
    revalidateTag(PRODUCTS_TAG, "max");

    return {
      ok: true,
      data: serializeCategory(updated as unknown as CategoryRecord),
    };
  } catch (error) {
    if (isDuplicateKey(error)) {
      return {
        ok: false,
        status: 409,
        error: "A category with this slug already exists.",
      };
    }

    throw error;
  }
}

export async function deleteCategory(
  idOrSlug: string,
): Promise<ServiceResult<{ id: string }>> {
  const record = await findRecord(idOrSlug);

  if (!record) {
    return { ok: false, status: 404, error: "Category not found" };
  }

  await CategoryModel.findByIdAndDelete(record._id);

  revalidateTag(CATEGORIES_TAG, "max");
  revalidateTag(PRODUCTS_TAG, "max");

  return { ok: true, data: { id: String(record._id) } };
}
