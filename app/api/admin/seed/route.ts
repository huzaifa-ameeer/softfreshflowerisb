import { categories } from "@/app/categories/categories";
import { productDetails } from "@/app/products/products";
import { withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { CategoryModel } from "@/lib/models/category";
import { ProductModel } from "@/lib/models/product";

const FRESH_SLUGS = [
  "blush-rose-bouquet",
  "rose-petal-celebration-cake",
  "jasmine-gajra",
  "chocolate-bloom-box",
];

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
              images: product.images.map((url) => ({ url, publicId: "" })),
              highlights: product.highlights,
              reviews: product.reviews,
              rating: product.rating,
              isFresh: FRESH_SLUGS.includes(product.slug),
            },
          },
          upsert: true,
        },
      })),
    );

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
