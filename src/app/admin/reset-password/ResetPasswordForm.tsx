"use client";

import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Resetting..." : "Reset password"}
    </button>
  );
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const error = searchParams.get("error") ?? "";
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

  if (!token) {
    return (
      <div className="mt-8 space-y-5">
        <div
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          role="alert"
        >
          This password reset link is invalid or missing.
        </div>
        <p className="text-center text-sm text-gray-500">
          <Link
            className="font-semibold text-primary-700 hover:text-primary-900"
            href="/admin/forgot-password"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={resetPassword} className="mt-8 space-y-5">
      <input name="token" type="hidden" value={token} />

      {error && errorMessages[error] ? (
        <div
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          role="alert"
        >
          {errorMessages[error]}
        </div>
      ) : null}

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-800"
          htmlFor="password"
        >
          New password
        </label>
        <div className="relative">
          <input
            autoComplete="new-password"
            className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-3 pr-20 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            id="password"
            minLength={8}
            name="password"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((v) => !v)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
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
          <input
            autoComplete="new-password"
            className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-3 pr-20 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            id="confirmPassword"
            minLength={8}
            name="confirmPassword"
            required
            type={showConfirm ? "text" : "password"}
          />
          <button
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirm((v) => !v)}
            type="button"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-gray-500">
        <Link
          className="font-semibold text-primary-700 hover:text-primary-900"
          href="/admin/login"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
