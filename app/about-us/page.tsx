import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          About Us
        </h1>
        <p className="max-w-3xl text-base text-neutral-600 sm:text-lg">
          Soft Fresh Flower ISB hand-prepares fresh flowers, cakes and gifts,
          and delivers them across Islamabad and Rawalpindi in 30 minutes.
        </p>
      </header>

      <section className="mt-10 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
          Our Story
        </h2>
        <p className="max-w-4xl text-base text-neutral-600">
          Soft Fresh Flower ISB was founded with a simple mission: to bring
          beauty, love, and joy through the timeless gift of fresh flowers.
          We believe that every occasion deserves to be celebrated with
          elegance, and every gesture of love should be delivered with care.
        </p>
        <p className="max-w-4xl text-base text-neutral-600">
          Over the years, we have grown to become one of Islamabad and
          Rawalpindi's most trusted florists, known for our commitment to
          quality, freshness, and exceptional customer service.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
          What We Do
        </h2>
        <p className="max-w-4xl text-base text-neutral-600">
          Every bouquet is tied to order, so what reaches you was cut the same
          day. Alongside fresh flowers we put together flower cakes, gajray,
          balloons, chocolates, birthday cards and flower jewellery for
          weddings, eids and birthdays.
        </p>
        <p className="max-w-4xl text-base text-neutral-600">
          We specialize in creating custom arrangements tailored to your
          specific needs and preferences. From romantic roses to vibrant
          mixed bouquets, our skilled florists craft each piece with
          precision and artistry.
        </p>
        <p className="max-w-4xl text-base text-neutral-600">
          Looking for something specific? Message us on WhatsApp and we will
          arrange it.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
          Our Promise
        </h2>
        <p className="max-w-4xl text-base text-neutral-600">
          At Soft Fresh Flower ISB, freshness is our guarantee. We source the
          finest blooms daily to ensure your flowers arrive vibrant and
          long-lasting. With our 30-minute delivery service across Islamabad
          and Rawalpindi, your special moments are never delayed.
        </p>
        <p className="max-w-4xl text-base text-neutral-600">
          We take pride in our attention to detail, reliable delivery, and
          personalized service. Your satisfaction is our top priority, and
          we go above and beyond to make every delivery perfect.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
          Why Choose Us
        </h2>
        <ul className="max-w-4xl list-disc space-y-2 pl-6 text-base text-neutral-600">
          <li>Fresh flowers cut and arranged the same day</li>
          <li>30-minute express delivery across Islamabad and Rawalpindi</li>
          <li>Wide variety of flowers, cakes, gifts and accessories</li>
          <li>Custom arrangements for all occasions</li>
          <li>Affordable prices with premium quality</li>
          <li>Friendly customer service via WhatsApp and phone</li>
        </ul>
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
