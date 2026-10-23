import ProductsManager from "@/components/admin/ProductsManager";
import { listProducts } from "@/lib/products";

export default async function AdminTopSellingProductsPage() {
  const { items } = await listProducts({ top: true, limit: 200 });

  return <ProductsManager mode="top" initialProducts={items} />;
}
