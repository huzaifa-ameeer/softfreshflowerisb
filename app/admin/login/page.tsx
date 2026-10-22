"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { showToast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

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

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const interacted = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!interacted.current) {
        setEmail("");
        setPassword("");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message ?? "Could not sign you in.");
      setPending(false);
      return;
    }

    showToast("Logged in successfully");
    router.replace("/admin");
    router.refresh();
  }

  function handleFocus() {
    interacted.current = true;
    setUnlocked(true);
  }

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-pink-500 text-white">
            <FlowerIcon className="size-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Admin login
          </h1>
          <p className="text-sm text-neutral-500">
            Sign in to manage Soft Fresh Flower ISB.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="mt-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Email
            <input
              type="email"
              name="admin-login-email"
              required
              autoComplete="off"
              readOnly={!unlocked}
              onFocus={handleFocus}
              value={email}
              onChange={(event) => {
                interacted.current = true;
                setEmail(event.target.value);
              }}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Password
            <input
              type="password"
              name="admin-login-password"
              required
              autoComplete="new-password"
              readOnly={!unlocked}
              onFocus={handleFocus}
              value={password}
              onChange={(event) => {
                interacted.current = true;
                setPassword(event.target.value);
              }}
              className={fieldClass}
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && (
              <span
                aria-hidden="true"
                className="inline-block size-4 animate-spin rounded-full border-2 border-black/25 border-t-black"
              />
            )}
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
