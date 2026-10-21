import Link from "next/link";

export default function ReviewsPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-pink-500 sm:text-5xl">
        Reviews
      </h1>
      <p className="max-w-xl text-base text-neutral-600 sm:text-lg">
        Reviews page content goes here.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold text-pink-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
      >
        Back to home
      </Link>
    </main>
  );
}
