"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";

const DESKTOP_QUERY = "(min-width: 1280px)";

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getIsDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getIsDesktopOnServer() {
  return true;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Categories", href: "/categories" },
  { label: "Most Selling Products", href: "/most-selling-products" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

function isActiveHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  "rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const linkIdle = `${linkBase} text-neutral-700 hover:bg-pink-500 hover:text-black`;

const linkActive = `${linkBase} bg-pink-500 text-black`;

const iconButtonClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const whatsappButtonClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-[#128C7E] transition-colors hover:bg-[#25D366] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600";

const whatsappOrderLink = `https://wa.me/923188989545?text=${encodeURIComponent(
  "Hi there! I would like to order something",
)}`;

const loginClass =
  "shrink-0 items-center justify-center rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const mobileLinkBase =
  "rounded-md px-4 py-3.5 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const mobileLinkIdle = `${mobileLinkBase} text-neutral-700 hover:bg-pink-500 hover:text-black`;

const mobileLinkActive = `${mobileLinkBase} bg-pink-500 text-black`;

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
      <circle cx="12" cy="12" r="1.9" fill="var(--background)" />
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

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  const bar =
    "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out";

  return (
    <span className="relative block size-5" aria-hidden="true">
      <span
        className={`${bar} ${
          isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1"
        }`}
      />
      <span
        className={`${bar} top-1/2 -translate-y-1/2 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`${bar} ${
          isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-4"
        }`}
      />
    </span>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getIsDesktop,
    getIsDesktopOnServer,
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktopChange = () => {
      if (desktop.matches) setIsOpen(false);
    };

    desktop.addEventListener("change", onDesktopChange);
    return () => desktop.removeEventListener("change", onDesktopChange);
  }, []);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-pink-200 bg-background">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-2 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8 xl:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex min-w-0 items-baseline gap-1.5 justify-self-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
        >
          <span className="flex min-w-0 items-baseline text-lg font-bold tracking-tight text-pink-500 sm:text-2xl">
            <FlowerIcon className="size-[1.1em] shrink-0 self-center" />
            <span className="min-w-0 truncate">softfreshflower</span>
          </span>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-700 sm:text-xs">
            isb
          </span>
        </Link>

        <div className="hidden items-center gap-1 justify-self-center xl:flex">
          {navLinks.map((link) => {
            const active = isActiveHref(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={active ? linkActive : linkIdle}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 justify-self-end sm:gap-3">
          {isDesktop && (
            <Link
              href="/login"
              className={`${loginClass} hidden xl:inline-flex`}
            >
              Login
            </Link>
          )}

          <a
            href={whatsappOrderLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
            className={whatsappButtonClass}
          >
            <WhatsAppIcon className="size-5" />
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className={`${iconButtonClass} xl:hidden`}
          >
            <MenuIcon isOpen={isOpen} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        inert={!isOpen}
        className={`grid overflow-hidden border-t border-pink-200 bg-background transition-[grid-template-rows,opacity] duration-300 ease-out xl:hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 max-h-[calc(100dvh_-_4rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh_-_5rem)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const active = isActiveHref(pathname, link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={active ? mobileLinkActive : mobileLinkIdle}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`${loginClass} mt-2 flex`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
