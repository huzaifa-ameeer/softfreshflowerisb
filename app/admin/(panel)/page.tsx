import { categories } from "@/app/categories/categories";
import { listAllReviews, listProducts } from "@/lib/products";

export default async function AdminDashboardPage() {
  const [{ total }, reviews] = await Promise.all([
    listProducts({ page: 1, limit: 1 }),
    listAllReviews(),
  ]);

  const stats = [
    { label: "Products", value: total },
    { label: "Categories", value: categories.length },
    { label: "Customer reviews", value: reviews.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500">
          Welcome back. Here is a quick overview of your store.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200"
          >
            <p className="text-sm font-medium text-neutral-500">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-bold text-pink-600">
              {stat.value}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
