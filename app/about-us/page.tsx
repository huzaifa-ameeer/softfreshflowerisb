import Link from "next/link";

type Location = {
  name: string;
  address: string;
  plusCode?: string;
  directions: string;
  embed: string;
};

const locations: Location[] = [
  {
    name: "Bahria Town Phase II",
    address:
      "Service Rd, Bahria Town Phase II, Phase 2, Bahria Town, Rawalpindi",
    plusCode: "H43F+266",
    directions:
      "https://www.google.com/maps/search/?api=1&query=33.552537,73.123016",
    embed: "https://www.google.com/maps?q=33.552537,73.123016&z=16&output=embed",
  },
  {
    name: "F-10/3 Islamabad",
    address: "Street 57, 3 Service Rd E, F-10/3, F-10, Islamabad",
    directions:
      "https://www.google.com/maps/search/?api=1&query=Street+57+Service+Rd+E+F-10%2F3+Islamabad",
    embed:
      "https://www.google.com/maps?q=Street+57+Service+Rd+E+F-10%2F3+Islamabad&z=16&output=embed",
  },
];

export default function AboutUsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
      <header className="flex flex-col gap-2">
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

      <section className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
            Our locations
          </h2>
          <p className="max-w-2xl text-base text-neutral-600">
            Two shops, one in Rawalpindi and one in Islamabad.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {locations.map((location) => (
            <li key={location.name}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-pink-200">
                <iframe
                  title={`Map of ${location.name}`}
                  src={location.embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full border-0 sm:h-64"
                />

                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <h3 className="text-lg font-semibold text-pink-900">
                    {location.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{location.address}</p>
                  {location.plusCode && (
                    <p className="text-xs font-medium tracking-wide text-pink-600 uppercase">
                      Plus code {location.plusCode}
                    </p>
                  )}

                  <a
                    href={location.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex w-fit items-center justify-center rounded-md border border-pink-500 px-4 py-2 text-sm font-semibold text-pink-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                  >
                    Get directions
                  </a>
                </div>
              </article>
            </li>
          ))}
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
