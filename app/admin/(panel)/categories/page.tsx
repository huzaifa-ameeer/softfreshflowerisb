import CategoriesManager from "@/components/admin/CategoriesManager";
import { listCategories } from "@/lib/categories";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return <CategoriesManager initialCategories={categories} />;
}
