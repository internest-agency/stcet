"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole, LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl: "/admin/dashboard",
      });

      if (result?.ok) {
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }
    } catch {
      setError("Sign in is temporarily unavailable. Try again shortly.");
    }

    setPending(false);
    setError(
      (current) => current || "The email or password could not be verified.",
    );
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-800"
          htmlFor="email"
        >
          Email address
        </label>
        <input
          autoComplete="username"
          className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-800"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      <button
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? (
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
        ) : (
          <LogIn aria-hidden className="size-4" />
        )}
        {pending ? "Signing in" : "Sign in"}
      </button>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <LockKeyhole aria-hidden className="size-3.5" />
        Restricted to authorized college staff
      </div>
    </form>
  );
}
