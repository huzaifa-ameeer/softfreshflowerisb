import ProductsManager from "@/components/admin/ProductsManager";
import { listProducts } from "@/lib/products";

export default async function AdminFreshProductsPage() {
  const { items } = await listProducts({ fresh: true, limit: 200 });

  return <ProductsManager mode="fresh" initialProducts={items} />;
}
