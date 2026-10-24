import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          About Us
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          Soft Fresh Flower ISB hand-prepares fresh flowers, cakes and gifts,
          and delivers them across Islamabad and Rawalpindi in 30 minutes.
        </p>
      </header>

      <section className="mt-8 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
          What we do
        </h2>
        <p className="max-w-3xl text-base text-neutral-600">
          Every bouquet is tied to order, so what reaches you was cut the same
          day. Alongside fresh flowers we put together flower cakes, gajray,
          balloons, chocolates, birthday cards and flower jewellery for
          weddings, eids and birthdays.
        </p>
        <p className="max-w-3xl text-base text-neutral-600">
          Looking for something specific? Message us on WhatsApp and we will
          arrange it.
        </p>
      </section>

      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-[#7b2fbf] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#6a28a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
