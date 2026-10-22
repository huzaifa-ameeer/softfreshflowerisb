import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/lib/models/category";
import { ProductModel } from "@/lib/models/product";
import { slugify } from "@/lib/slug";

export const MAX_PRODUCT_IMAGES = 3;

export type ProductImageDTO = {
  url: string;
  publicId: string;
};

export type ReviewDTO = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  description: string;
  image: string;
  images: ProductImageDTO[];
  highlights: string[];
  reviews: ReviewDTO[];
  rating: number;
  isFresh: boolean;
  isTopSelling: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryProductStats = {
  count: number;
  samples: string[];
};

export type ProductInput = {
  name?: unknown;
  slug?: unknown;
  category?: unknown;
  price?: unknown;
  description?: unknown;
  images?: unknown;
  highlights?: unknown;
  reviews?: unknown;
  isFresh?: unknown;
  isTopSelling?: unknown;
};

export type ServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: number;
      error: string;
      details?: Record<string, string>;
    };

export type ListProductsOptions = {
  q?: string;
  category?: string;
  fresh?: boolean;
  top?: boolean;
  page?: number;
  limit?: number;
};

type ProductRecord = {
  _id: unknown;
  slug: string;
  name: string;
  category: string;
  categoryName?: string | null;
  price: number;
  description?: string | null;
  images?: ProductImageDTO[] | null;
  highlights?: string[] | null;
  reviews?: ReviewDTO[] | null;
  rating?: number | null;
  isFresh?: boolean | null;
  isTopSelling?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function toIso(value: Date | string | null | undefined) {
  if (!value) return "";

  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function normalizeImages(value: ProductImageDTO[] | null | undefined) {
  return (value ?? []).map((image) => ({
    url: image?.url ?? "",
    publicId: image?.publicId ?? "",
  }));
}

export function serializeProduct(record: ProductRecord): ProductDTO {
  const images = normalizeImages(record.images);

  return {
    id: String(record._id),
    slug: record.slug,
    name: record.name,
    category: record.category,
    categoryName: record.categoryName ?? "",
    price: record.price,
    description: record.description ?? "",
    image: images[0]?.url ?? "",
    images,
    highlights: record.highlights ?? [],
    reviews: record.reviews ?? [],
    rating: record.rating ?? 0,
    isFresh: Boolean(record.isFresh),
    isTopSelling: Boolean(record.isTopSelling),
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toImages(value: unknown): ProductImageDTO[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  if (value.length > MAX_PRODUCT_IMAGES) return null;

  const images = value
    .map((item) => {
      const image = (item ?? {}) as Record<string, unknown>;

      return {
        url: typeof image.url === "string" ? image.url.trim() : "",
        publicId: typeof image.publicId === "string" ? image.publicId.trim() : "",
      };
    })
    .filter((image) => image.url);

  if (images.length === 0 || images.length > MAX_PRODUCT_IMAGES) return null;

  return images;
}

function toReviews(value: unknown): ReviewDTO[] | null {
  if (!Array.isArray(value)) return null;

  return value.map((item) => {
    const review = (item ?? {}) as Record<string, unknown>;

    return {
      id: typeof review.id === "string" ? review.id : "",
      author: typeof review.author === "string" ? review.author : "",
      rating: Number(review.rating) || 0,
      date: typeof review.date === "string" ? review.date : "",
      title: typeof review.title === "string" ? review.title : "",
      body: typeof review.body === "string" ? review.body : "",
    };
  });
}

function averageRating(reviews: ReviewDTO[]) {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return Math.round((total / reviews.length) * 10) / 10;
}

export function validateProduct(
  input: ProductInput,
  options: { partial?: boolean } = {},
):
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; details: Record<string, string> } {
  const partial = options.partial ?? false;
  const details: Record<string, string> = {};
  const data: Record<string, unknown> = {};
  const provided = (key: keyof ProductInput) => input[key] !== undefined;

  if (!partial || provided("name")) {
    const name = typeof input.name === "string" ? input.name.trim() : "";

    if (!name) details.name = "Required";
    else data.name = name;
  }

  if (!partial || provided("category")) {
    const category =
      typeof input.category === "string" ? slugify(input.category) : "";

    if (!category) details.category = "Required";
    else data.category = category;
  }

  if (!partial || provided("price")) {
    const price = Number(input.price);

    if (
      input.price === undefined ||
      input.price === null ||
      input.price === ""
    ) {
      details.price = "Required";
    } else if (!Number.isFinite(price) || price < 0) {
      details.price = "Must be a number greater than or equal to 0";
    } else {
      data.price = price;
    }
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

  if (provided("images")) {
    const images = toImages(input.images);

    if (!images) {
      details.images = `Must be 1 to ${MAX_PRODUCT_IMAGES} images, each with a url`;
    } else {
      data.images = images;
    }
  }

  if (provided("highlights")) {
    const highlights = toStringArray(input.highlights);

    if (!highlights) details.highlights = "Must be an array of strings";
    else data.highlights = highlights;
  }

  if (provided("reviews")) {
    const reviews = toReviews(input.reviews);

    if (!reviews) {
      details.reviews = "Must be an array of reviews";
    } else {
      data.reviews = reviews;
      data.rating = averageRating(reviews);
    }
  }

  if (provided("isFresh")) data.isFresh = Boolean(input.isFresh);
  if (provided("isTopSelling")) data.isTopSelling = Boolean(input.isTopSelling);

  if (Object.keys(details).length > 0) return { ok: false, details };

  return { ok: true, data };
}

async function resolveCategoryName(categorySlug: string) {
  await connectDB();

  const category = await CategoryModel.findOne({ slug: categorySlug })
    .select({ name: 1 })
    .lean();

  return category?.name ?? null;
}

async function findRecord(idOrSlug: string): Promise<ProductRecord | null> {
  await connectDB();

  const query = isValidObjectId(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const doc = await ProductModel.findOne(query).lean();

  return (doc as unknown as ProductRecord) ?? null;
}

export async function listProducts(options: ListProductsOptions = {}) {
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (options.category) filter.category = slugify(options.category);
  if (options.fresh) filter.isFresh = true;
  if (options.top) filter.isTopSelling = true;

  if (options.q) {
    filter.name = { $regex: escapeRegex(options.q.trim()), $options: "i" };
  }

  const limit = Math.min(Math.max(options.limit ?? 50, 1), 200);
  const page = Math.max(options.page ?? 1, 1);

  const [docs, total] = await Promise.all([
    ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    items: (docs as unknown as ProductRecord[]).map(serializeProduct),
    total,
    page,
    limit,
  };
}

export async function getProduct(idOrSlug: string): Promise<ProductDTO | null> {
  const record = await findRecord(idOrSlug);

  return record ? serializeProduct(record) : null;
}

export async function listProductsByCategory(
  categorySlug: string,
): Promise<ProductDTO[]> {
  await connectDB();

  const docs = await ProductModel.find({ category: categorySlug })
    .sort({ name: 1 })
    .lean();

  return (docs as unknown as ProductRecord[]).map(serializeProduct);
}

export async function productStatsByCategory(): Promise<
  Map<string, CategoryProductStats>
> {
  await connectDB();

  const rows = await ProductModel.aggregate<{
    _id: string;
    count: number;
    samples: string[];
  }>([
    { $sort: { name: 1 } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        samples: { $push: "$name" },
      },
    },
  ]);

  return new Map(
    rows.map((row) => [
      row._id,
      { count: row.count, samples: row.samples.slice(0, 3) },
    ]),
  );
}

export async function createProduct(
  input: ProductInput,
): Promise<ServiceResult<ProductDTO>> {
  const validation = validateProduct(input);

  if (!validation.ok) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed",
      details: validation.details,
    };
  }

  const data = { ...validation.data };
  const categoryName = await resolveCategoryName(String(data.category));

  if (!categoryName) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed",
      details: { category: "Unknown category" },
    };
  }

  if (!data.slug) data.slug = slugify(String(data.name ?? ""));

  await connectDB();

  try {
    const created = await ProductModel.create({ ...data, categoryName });

    return {
      ok: true,
      data: serializeProduct(created.toObject() as unknown as ProductRecord),
    };
  } catch (error) {
    if (isDuplicateKey(error)) {
      return {
        ok: false,
        status: 409,
        error: "A product with this slug already exists.",
      };
    }

    throw error;
  }
}

export async function updateProduct(
  idOrSlug: string,
  input: ProductInput,
): Promise<ServiceResult<ProductDTO>> {
  const validation = validateProduct(input, { partial: true });

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
    return { ok: false, status: 404, error: "Product not found" };
  }

  const data = { ...validation.data };

  if (data.category) {
    const categoryName = await resolveCategoryName(String(data.category));

    if (!categoryName) {
      return {
        ok: false,
        status: 400,
        error: "Validation failed",
        details: { category: "Unknown category" },
      };
    }

    data.categoryName = categoryName;
  }

  if (Object.keys(data).length === 0) {
    return { ok: true, data: serializeProduct(record) };
  }

  try {
    const updated = await ProductModel.findByIdAndUpdate(
      record._id,
      { $set: data },
      { new: true },
    ).lean();

    if (!updated) {
      return { ok: false, status: 404, error: "Product not found" };
    }

    return {
      ok: true,
      data: serializeProduct(updated as unknown as ProductRecord),
    };
  } catch (error) {
    if (isDuplicateKey(error)) {
      return {
        ok: false,
        status: 409,
        error: "A product with this slug already exists.",
      };
    }

    throw error;
  }
}

export async function deleteProduct(
  idOrSlug: string,
): Promise<ServiceResult<{ id: string; publicIds: string[] }>> {
  const record = await findRecord(idOrSlug);

  if (!record) {
    return { ok: false, status: 404, error: "Product not found" };
  }

  await ProductModel.findByIdAndDelete(record._id);

  const publicIds = normalizeImages(record.images)
    .map((image) => image.publicId)
    .filter(Boolean);

  return { ok: true, data: { id: String(record._id), publicIds } };
}

export type ProductSummary = {
  slug: string;
  name: string;
  categoryName: string;
};

export async function listProductSummaries(): Promise<ProductSummary[]> {
  await connectDB();

  const docs = await ProductModel.find()
    .select({ slug: 1, name: 1, categoryName: 1 })
    .sort({ name: 1 })
    .lean<{ slug: string; name: string; categoryName?: string | null }[]>();

  return docs.map((doc) => ({
    slug: doc.slug,
    name: doc.name,
    categoryName: doc.categoryName ?? "",
  }));
}
