"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Mail } from "lucide-react";
import { requestPasswordReset } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <LoaderCircle aria-hidden className="size-4 animate-spin" />
      ) : (
        <Mail aria-hidden className="size-4" />
      )}
      {pending ? "Sending..." : "Send reset link"}
    </button>
  );
}

export default function ForgotPasswordForm() {
  return (
    <form action={requestPasswordReset} className="mt-8 space-y-5">
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-800"
          htmlFor="email"
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            aria-hidden
            className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          />
          <input
            autoComplete="username"
            className="w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-3.5 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
