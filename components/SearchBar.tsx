"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { allProducts } from "@/app/categories/categories";

const MAX_RESULTS = 6;

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

type SearchBarProps = {
  className?: string;
  inline?: boolean;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

export default function SearchBar({
  className = "",
  inline = false,
  autoFocus = false,
  onNavigate,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const term = query.trim().toLowerCase();
  const matches = term
    ? allProducts
        .filter((product) => product.name.toLowerCase().includes(term))
        .slice(0, MAX_RESULTS)
    : [];

  useEffect(() => {
    if (inline) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [inline]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      event.currentTarget.blur();
    }
  }

  function handleSelect() {
    setQuery("");
    setOpen(false);
    onNavigate?.();
  }

  const showResults = open && term.length > 0;

  return (
    <div ref={containerRef} role="search" className={`relative ${className}`}>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          autoComplete="off"
          placeholder="Search flowers…"
          className="w-full rounded-md border border-pink-200 bg-white py-2 pr-3 pl-9 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        />
      </div>

      {showResults && (
        <div
          className={
            inline
              ? "mt-2 overflow-hidden rounded-xl border border-pink-200 bg-white"
              : "absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-pink-200 bg-white shadow-lg 2xl:w-72"
          }
        >
          {matches.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto py-1">
              {matches.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={handleSelect}
                    className="flex flex-col gap-0.5 px-3 py-2 transition-colors hover:bg-pink-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink-500"
                  >
                    <span className="text-sm font-semibold text-pink-900">
                      {product.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {product.categoryName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-neutral-500">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
