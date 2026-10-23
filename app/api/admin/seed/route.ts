import { revalidatePath, revalidateTag } from "next/cache";
import { categories } from "@/app/categories/categories";
import { productDetails } from "@/app/products/products";
import { withAdmin } from "@/lib/api";
import {
  CATEGORIES_TAG,
  PRODUCTS_TAG,
  REVIEWS_TAG,
} from "@/lib/cache-tags";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/lib/models/category";
import { ProductModel } from "@/lib/models/product";

const FRESH_SLUGS = [
  "blush-rose-bouquet",
  "rose-petal-celebration-cake",
  "jasmine-gajra",
  "chocolate-bloom-box",
];

const PHOTOS = {
  bouquet:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Rose_Flower_Bouquet_052.JPG/960px-Rose_Flower_Bouquet_052.JPG",
  cake: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Cake_Flowers.jpg/960px-Cake_Flowers.jpg",
  garland:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Jasmine_Garland.jpg/960px-Jasmine_Garland.jpg",
  chocolate:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Assorted_Chocolate_Collection.jpg/960px-Assorted_Chocolate_Collection.jpg",
};

const CATEGORY_PHOTOS: Record<string, string[]> = {
  "fresh-flowers": [PHOTOS.bouquet],
  bouquets: [PHOTOS.bouquet],
  "flower-cakes": [PHOTOS.cake],
  gajray: [PHOTOS.garland],
  blessings: [PHOTOS.garland],
  balloons: [PHOTOS.bouquet],
  chocolates: [PHOTOS.chocolate],
  "birthday-cards": [PHOTOS.bouquet],
  "flower-jewelry": [PHOTOS.garland],
};

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    await connectDB();

    const categoryResult = await CategoryModel.bulkWrite(
      categories.map((category, index) => ({
        updateOne: {
          filter: { slug: category.slug },
          update: {
            $set: {
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              tone: category.tone,
              description: "",
              order: index,
            },
          },
          upsert: true,
        },
      })),
    );

    const productResult = await ProductModel.bulkWrite(
      productDetails.map((product) => ({
        updateOne: {
          filter: { slug: product.slug },
          update: {
            $set: {
              slug: product.slug,
              name: product.name,
              category: product.categorySlug,
              categoryName: product.categoryName,
              price: product.price,
              description: product.description,
              images: (
                CATEGORY_PHOTOS[product.categorySlug] ?? [PHOTOS.bouquet]
              ).map((url) => ({ url, publicId: "" })),
              highlights: product.highlights,
              isFresh: FRESH_SLUGS.includes(product.slug),
            },
            $setOnInsert: {
              reviews: [],
              rating: 0,
            },
          },
          upsert: true,
        },
      })),
    );

    revalidateTag(CATEGORIES_TAG, "max");
    revalidateTag(PRODUCTS_TAG, "max");
    revalidateTag(REVIEWS_TAG, "max");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/most-selling-products");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/edit-delete-products");
    revalidatePath("/admin/fresh-products");
    revalidatePath("/admin/top-selling-products");

    return Response.json({
      categories: {
        inserted: categoryResult.upsertedCount,
        updated: categoryResult.modifiedCount,
      },
      products: {
        inserted: productResult.upsertedCount,
        updated: productResult.modifiedCount,
      },
    });
  });
}
