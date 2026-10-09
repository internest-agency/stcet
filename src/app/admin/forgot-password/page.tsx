import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Password assistance | STCET Admin",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-100 px-5 py-12">
      <section className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-700">
          STCET Admin
        </p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Password assistance
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Password reset email is not configured for this deployment. Contact
          the system administrator to restore access.
        </p>
        <Link
          className="mt-7 inline-flex min-h-10 items-center rounded-md bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800"
          href="/admin/login"
        >
          Return to sign in
        </Link>
      </section>
    </main>
  );
}
