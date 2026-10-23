"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useFavourites } from "@/lib/favourites-store";
import {
  useEffect,
  useRef,
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
  "relative rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const linkIdle = `${linkBase} text-neutral-700 hover:bg-pink-200 hover:text-black`;

const linkActive = `${linkBase} text-black`;

const iconButtonClass =
  "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:size-11";

const mobileLinkBase =
  "inline-flex items-center gap-2 rounded-md px-4 py-3.5 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const mobileLinkIdle = `${mobileLinkBase} text-neutral-700 hover:bg-pink-200 hover:text-black`;

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

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  const bar =
    "absolute left-0 block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ease-out sm:w-5";

  return (
    <span className="relative block size-4 sm:size-5" aria-hidden="true">
      <span
        className={`${bar} ${
          isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5 sm:top-1"
        }`}
      />
      <span
        className={`${bar} top-1/2 -translate-y-1/2 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`${bar} ${
          isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-3.5 sm:top-4"
        }`}
      />
    </span>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const favouriteCount = useFavourites((state) => state.items.length);
  const pathname = usePathname();
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getIsDesktop,
    getIsDesktopOnServer,
  );

  useEffect(() => {
    if (!isOpen && !isSearchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSearchOpen]);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktopChange = () => {
      if (desktop.matches) {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };

    desktop.addEventListener("change", onDesktopChange);
    return () => desktop.removeEventListener("change", onDesktopChange);
  }, []);

  const navLinksRef = useRef<HTMLDivElement>(null);
  const [bubble, setBubble] = useState<{ left: number; width: number } | null>(
    null,
  );

  useEffect(() => {
    const container = navLinksRef.current;
    if (!container) return;

    const measure = () => {
      const active = container.querySelector<HTMLElement>(
        '[aria-current="page"]',
      );

      if (!active || active.offsetParent === null) {
        setBubble(null);
        return;
      }

      setBubble({ left: active.offsetLeft, width: active.offsetWidth });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pathname, isDesktop]);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen((open) => !open);
    setIsOpen(false);
  };

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
          prefetch={true}
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

        <div
          ref={navLinksRef}
          className="relative hidden items-center gap-1 justify-self-center xl:flex"
        >
          {bubble && (
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 rounded-md bg-pink-500 transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
              style={{ left: bubble.left, width: bubble.width }}
            />
          )}

          {navLinks.map((link) => {
            const active = isActiveHref(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                aria-current={active ? "page" : undefined}
                className={active ? linkActive : linkIdle}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 justify-self-end sm:gap-3">
          <SearchBar className="hidden xl:block xl:w-44 2xl:w-60" />

          <Link
            href="/fav"
            prefetch={true}
            aria-label={`Favourites (${favouriteCount})`}
            className={`${iconButtonClass} relative hidden xl:inline-flex`}
          >
            <HeartIcon className="size-5" />
            {favouriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] leading-4 font-bold text-black">
                {favouriteCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleSearch}
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            aria-expanded={isSearchOpen}
            aria-controls="mobile-search"
            className={`${iconButtonClass} xl:hidden`}
          >
            {isSearchOpen ? (
              <CloseIcon className="size-4 sm:size-5" />
            ) : (
              <SearchIcon className="size-4 sm:size-5" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMenu}
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
        id="mobile-search"
        inert={!isSearchOpen}
        className={`grid overflow-hidden border-t border-pink-200 bg-background transition-[grid-template-rows,opacity] duration-300 ease-out xl:hidden ${
          isSearchOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <SearchBar
              inline
              autoFocus={isSearchOpen}
              onNavigate={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      </div>

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
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={active ? mobileLinkActive : mobileLinkIdle}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
