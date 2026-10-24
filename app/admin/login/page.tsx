"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { showToast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const interacted = useRef(false);

  const resetForm = useCallback(() => {
    interacted.current = false;
    setEmail("");
    setPassword("");
    setUnlocked(false);
    setShowPassword(false);
    setError(null);
    setPending(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!interacted.current) resetForm();
    }, 300);

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) resetForm();
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [resetForm]);

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
    resetForm();
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
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
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
                className={`${fieldClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={!unlocked}
                className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 text-neutral-500 transition-colors hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
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
