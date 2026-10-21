"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

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

const linkClass =
  "rounded-md px-2.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const iconButtonClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const loginClass =
  "shrink-0 items-center justify-center rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const mobileLinkClass =
  "rounded-md px-4 py-3.5 text-base font-medium text-neutral-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

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
      <circle cx="12" cy="12" r="1.9" fill="white" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.75 3.25h2.1l2.35 11.1a1.5 1.5 0 0 0 1.47 1.2h8.9a1.5 1.5 0 0 0 1.47-1.2l1.46-7.1H6.02" />
      <circle cx="9.5" cy="19.75" r="1.35" />
      <circle cx="17.4" cy="19.75" r="1.35" />
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

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-2 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8 xl:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex min-w-0 items-baseline gap-1.5 justify-self-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
        >
          <span className="flex min-w-0 items-baseline text-lg font-bold tracking-tight text-pink-500 sm:text-2xl">
            <FlowerIcon className="size-[1.1em] shrink-0 self-center" />
            <span className="min-w-0 truncate">softfreshflower</span>
          </span>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-600 sm:text-xs">
            isb
          </span>
        </Link>

        <div className="hidden items-center gap-1 justify-self-center xl:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
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

          <Link href="/cart" aria-label="Cart" className={iconButtonClass}>
            <CartIcon className="size-5" />
          </Link>

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
        className={`grid overflow-hidden border-t border-neutral-200 bg-white transition-[grid-template-rows,opacity] duration-300 ease-out xl:hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 max-h-[calc(100dvh_-_4rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh_-_5rem)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={mobileLinkClass}
              >
                {link.label}
              </Link>
            ))}
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
