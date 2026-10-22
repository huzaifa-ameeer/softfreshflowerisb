"use client";

import type { ReactNode } from "react";
import { useLinkStatus } from "next/link";

const spinnerClasses =
  "inline-block animate-spin rounded-full border-2 border-current border-r-transparent";

export function LinkPendingSpinner({
  className = "size-4",
}: {
  className?: string;
}) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`${spinnerClasses} ${className}`}
    />
  );
}

export function LinkPendingSwap({
  children,
  className = "size-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useLinkStatus();

  if (!pending) return <>{children}</>;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`${spinnerClasses} ${className}`}
    />
  );
}

export function LinkPendingOverlay({
  className = "size-7",
}: {
  className?: string;
}) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span className="absolute inset-0 z-20 grid place-items-center bg-white/60 backdrop-blur-[1px]">
      <span
        role="status"
        aria-label="Loading"
        className={`${spinnerClasses} border-pink-500 text-pink-500 ${className}`}
      />
    </span>
  );
}
