import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import LoginForm from "@/src/app/admin/login/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in | STCET",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-gray-100 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.85fr)]">
      <section className="relative hidden overflow-hidden bg-primary-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-25"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 45%, rgba(255,255,255,.12) 45%, rgba(255,255,255,.12) 46%, transparent 46%), linear-gradient(45deg, transparent 68%, rgba(255,255,255,.08) 68%, rgba(255,255,255,.08) 69%, transparent 69%)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md bg-white text-primary-800">
            <GraduationCap aria-hidden className="size-6" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-wide">STCET</p>
            <p className="text-xs text-white/70">Content administration</p>
          </div>
        </div>
        <div className="relative max-w-xl pb-12">
          <p className="mb-4 text-xs font-bold uppercase text-secondary-300">
            S. Thangapazham College of Engineering &amp; Technology
          </p>
          <h1 className="max-w-lg text-4xl font-bold leading-tight">
            Website administration
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/75">
            Manage course information and review published website content.
          </p>
        </div>
        <p className="relative text-xs text-white/55">
          Authorized staff access only
        </p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700"
            href="/"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to website
          </Link>
          <div className="rounded-lg border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-7 lg:hidden">
              <div className="mb-5 grid size-11 place-items-center rounded-md bg-primary-800 text-white">
                <GraduationCap aria-hidden className="size-6" />
              </div>
              <p className="text-xs font-bold uppercase text-primary-700">
                STCET Admin
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-700">
              Secure access
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Use the account provided by your administrator.
            </p>
            <LoginForm />
            <p className="mt-7 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
              <Link
                className="font-semibold text-primary-700 hover:text-primary-900"
                href="/admin/forgot-password"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
