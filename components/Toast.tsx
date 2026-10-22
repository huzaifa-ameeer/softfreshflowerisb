"use client";

import { useEffect, useState } from "react";

type ToastTone = "success" | "info";

type Toast = {
  message: string;
  tone: ToastTone;
};

type Listener = (toast: Toast) => void;

let listeners: Listener[] = [];

const STORAGE_KEY = "softfreshflower:toast";
const TOAST_MS = 3200;
const EXIT_MS = 300;

const toneStyles: Record<ToastTone, { card: string; icon: string }> = {
  success: {
    card: "border-green-200 border-l-green-500",
    icon: "bg-green-100 text-green-700",
  },
  info: {
    card: "border-pink-200 border-l-pink-500",
    icon: "bg-pink-100 text-pink-700",
  },
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function SignOutIcon({ className }: { className?: string }) {
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
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function showToast(
  message: string,
  tone: ToastTone = "success",
  options?: { persist?: boolean },
) {
  if (options?.persist) {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ message, tone }),
      );
    } catch {
      listeners.forEach((listener) => listener({ message, tone }));
    }

    return;
  }

  listeners.forEach((listener) => listener({ message, tone }));
}

function readPendingToast(): Toast | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    window.sessionStorage.removeItem(STORAGE_KEY);

    return JSON.parse(raw) as Toast;
  } catch {
    return null;
  }
}

export function ToastHost() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listener: Listener = (next) => {
      setToast(next);
      setVisible(true);
    };

    listeners.push(listener);

    const pending = readPendingToast();
    if (pending) listener(pending);

    return () => {
      listeners = listeners.filter((entry) => entry !== listener);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => setVisible(false), TOAST_MS);
    return () => clearTimeout(timer);
  }, [visible, toast]);

  useEffect(() => {
    if (visible || !toast) return;

    const timer = setTimeout(() => setToast(null), EXIT_MS);
    return () => clearTimeout(timer);
  }, [visible, toast]);

  if (!toast) return null;

  const tone = toneStyles[toast.tone];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto flex items-center gap-3 rounded-xl border border-l-4 bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-out motion-reduce:transition-none ${tone.card} ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${tone.icon}`}
        >
          {toast.tone === "success" ? (
            <CheckIcon className="size-4" />
          ) : (
            <SignOutIcon className="size-4" />
          )}
        </span>
        <p className="text-sm font-medium text-neutral-800">{toast.message}</p>
      </div>
    </div>
  );
}
