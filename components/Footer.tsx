import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";

const WHATSAPP_NUMBER = "923188989545";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi there! I would like to order something",
)}`;

const shopLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Most Selling Products", href: "/most-selling-products" },
  { label: "Favourites", href: "/fav" },
];

const companyLinks = [
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="6.4" r="3.4" />
      <circle cx="17.33" cy="10.27" r="3.4" />
      <circle cx="15.29" cy="16.53" r="3.4" />
      <circle cx="8.71" cy="16.53" r="3.4" />
      <circle cx="6.67" cy="10.27" r="3.4" />
      <circle cx="12" cy="12" r="1.9" fill="#ffffff" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-pink-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-7 sm:gap-x-8 sm:gap-y-7 sm:px-6 sm:py-9 lg:grid-cols-4 lg:px-8">
        <div className="col-span-2 flex flex-col items-start gap-2.5 lg:col-span-1">
          <Link
            href="/"
            className="flex items-baseline gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          >
            <span className="flex items-baseline text-lg font-bold tracking-tight text-pink-500">
              <FlowerIcon className="size-[1.1em] shrink-0 self-center" />
              <span>softfreshflower</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-700">
              isb
            </span>
          </Link>

          <p className="max-w-xs text-[13px] text-neutral-600 sm:text-sm">
            Fresh flowers, cakes, chocolates and gifts — hand-prepared and
            delivered across Islamabad in 30 minutes.
          </p>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            <WhatsAppIcon className="size-4" />
            Order on WhatsApp
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold tracking-wide text-pink-900 uppercase sm:text-sm">
            Shop
          </h2>
          <ul className="flex flex-col gap-1.5 text-[13px] sm:text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-neutral-600 transition-colors hover:text-pink-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold tracking-wide text-pink-900 uppercase sm:text-sm">
            Company
          </h2>
          <ul className="flex flex-col gap-1.5 text-[13px] sm:text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-neutral-600 transition-colors hover:text-pink-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 flex flex-col gap-2 lg:col-span-1">
          <h2 className="text-xs font-semibold tracking-wide text-pink-900 uppercase sm:text-sm">
            Visit us
          </h2>
          <ul className="flex flex-col gap-1.5 text-[13px] text-neutral-600 sm:text-sm">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-pink-500" />
              <span>F-10/3, Islamabad</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-pink-500" />
              <span>Bahria Town Phase II, Rawalpindi</span>
            </li>
            <li className="flex items-start gap-2">
              <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-[#25D366]" />
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-pink-700"
              >
                +92 318 8989545
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pink-200">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-4 text-xs text-neutral-500 sm:px-6 lg:px-8">
          <p>© Soft Fresh Flower ISB. All rights reserved.</p>
        </div>
      </div>

      <div className="hidden sm:block">
        <AnnouncementBar />
      </div>
    </footer>
  );
}
