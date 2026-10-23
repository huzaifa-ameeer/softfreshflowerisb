import ProductsManager from "@/components/admin/ProductsManager";
import { listProducts } from "@/lib/products";

export default async function AdminEditDeleteProductsPage() {
  const { items } = await listProducts({ limit: 200 });

  return <ProductsManager mode="all" initialProducts={items} />;
}
