import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryTones, getCategory } from "../categories";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({
  params,
}: PageProps<"/categories/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const tone = categoryTones[category.tone];

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span aria-hidden="true" className="text-5xl">
        {category.icon}
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-pink-500 sm:text-5xl">
        {category.name}
      </h1>
      <p
        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tone.badge}`}
      >
        Coming soon
      </p>
      <p className="max-w-xl text-base text-neutral-600 sm:text-lg">
        We are still arranging this collection. Meanwhile, browse the other
        categories.
      </p>
      <Link
        href="/categories"
        className="text-sm font-semibold text-pink-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
      >
        Back to categories
      </Link>
    </main>
  );
}
