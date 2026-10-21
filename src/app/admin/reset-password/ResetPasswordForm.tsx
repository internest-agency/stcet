"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const error = searchParams.get("error") ?? "";

  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const errorMessages: Record<string, string> = {
    missing_fields: "Missing required information. Please request a new reset link.",
    password_mismatch: "Passwords do not match. Please try again.",
    weak_password: "Password must be at least 8 characters long.",
    invalid_token: "This password reset link is invalid or has been tampered with.",
    token_used: "This password reset link has already been used.",
    token_expired: "This password reset link has expired. Please request a new one.",
    account_disabled: "This account is disabled. Please contact an administrator.",
    unavailable: "Password reset is temporarily unavailable. Please try again later.",
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.currentTarget);
    formData.set("token", token);

    try {
      const response = await fetch("/admin/reset-password", {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      if (response.redirected) {
        const url = new URL(response.url);
        if (url.searchParams.get("reset") === "success") {
          router.push("/admin/login?reset=success");
          return;
        }
        const err = url.searchParams.get("error");
        if (err) {
          alert(errorMessages[err] ?? "An error occurred. Please try again.");
        }
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (error && errorMessages[error]) {
    return (
      <div className="mt-8 space-y-5">
        <div
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <svg aria-hidden className="size-5 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="leading-6">{errorMessages[error]}</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500">
          <Link className="font-semibold text-primary-700 hover:text-primary-900" href="/admin/forgot-password">
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-800"
          htmlFor="password"
        >
          New password
        </label>
        <div className="relative">
          <svg aria-hidden className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            autoComplete="new-password"
            className={`w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100 ${
              pending ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={pending}
            id="password"
            name="password"
            required
            type={showPassword ? "text" : "password"}
            minLength={8}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={pending}
          >
            {showPassword ? (
              <svg aria-hidden className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
              </svg>
            ) : (
              <svg aria-hidden className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8" />
                <path d="M9 9h.01M15 15h.01M2 12l22 22" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-800"
          htmlFor="confirmPassword"
        >
          Confirm new password
        </label>
        <div className="relative">
          <svg aria-hidden className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            autoComplete="new-password"
            className={`w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100 ${
              pending ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={pending}
            id="confirmPassword"
            name="confirmPassword"
            required
            type={showConfirm ? "text" : "password"}
            minLength={8}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            disabled={pending}
          >
            {showConfirm ? (
              <svg aria-hidden className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
              </svg>
            ) : (
              <svg aria-hidden className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8" />
                <path d="M9 9h.01M15 15h.01M2 12l22 22" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? (
          <>
            <svg aria-hidden className="size-4 animate-spin" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                fill="none"
              />
            </svg>
            Resetting...
          </>
        ) : (
          <>
            <svg aria-hidden className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Reset password
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        <Link className="font-semibold text-primary-700 hover:text-primary-900" href="/admin/login">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}