"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Mail, AlertCircle, CheckCircle } from "lucide-react";

export default function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("idle");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/admin/forgot-password", {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      if (response.redirected) {
        const url = new URL(response.url);
        if (url.searchParams.has("sent")) {
          setStatus("success");
          setMessage(
            "If an account exists for this email address, a password reset link has been sent.",
          );
        } else if (url.searchParams.has("error")) {
          setStatus("error");
          setMessage("Unable to process request. Please try again later.");
        }
      } else {
        setStatus("error");
        setMessage("Unable to process request. Please try again later.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      {message && (
        <div
          aria-live="polite"
          className={`flex items-start gap-3 rounded-md border px-3 py-2.5 text-sm ${
            status === "success"
              ? "border-secondary-200 bg-secondary-50 text-secondary-800"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
          role="status"
        >
          {status === "success" ? (
            <CheckCircle aria-hidden className="size-5 shrink-0 text-secondary-600" />
          ) : (
            <AlertCircle aria-hidden className="size-5 shrink-0 text-amber-600" />
          )}
          <p className="leading-6">{message}</p>
        </div>
      )}

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
            className={`w-full rounded-md border border-gray-300 bg-white pl-10 pr-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100 ${
              pending ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={pending}
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
      </div>

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
        {pending ? "Sending" : "Send reset link"}
      </button>
    </form>
  );
}