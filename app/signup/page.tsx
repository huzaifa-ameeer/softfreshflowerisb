"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { showToast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "w-full rounded-md border border-pink-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const buttonClass =
  "inline-flex w-full items-center justify-center rounded-md bg-pink-500 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:cursor-not-allowed disabled:opacity-60";

export default function SignupPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (signUpError) {
      setError(
        signUpError.message ?? "Could not create your account. Please try again.",
      );
      setPending(false);
      return;
    }

    showToast(`Welcome to Soft Fresh Flower, ${name}`);
    router.push("/");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md rounded-2xl bg-white/70 p-6 text-center ring-1 ring-pink-200 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-pink-700 sm:text-3xl">
          Signup
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Create your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 text-left"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Name
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Password
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

          <button type="submit" disabled={pending} className={buttonClass}>
            {pending ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="mt-5 text-sm text-neutral-600">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-semibold text-pink-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
