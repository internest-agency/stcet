import ForgotPasswordForm from "@/src/app/admin/forgot-password/ForgotPasswordForm";
import Link from "next/link";

export const metadata = { title: "Forgot Password | STCET Admin" };

export const dynamic = "force-dynamic";

export default function AdminForgotPasswordPage() {
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
            <svg aria-hidden className="size-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051l.003.022a28.304 28.304 0 006.006-.002l.002-.022L12.887 6.25a1 1 0 10.75-1.788l-1.76-2.42a.999.999 0 00-1.176-.078l-7 3a1 1 0 00-.082.67v2.167c0 .546.438.988.98.992h3.167v12.167c0 .547.437.99.98.99h2.03c.542 0 .98-.443.98-.99V9.493h3.167c.542 0 .98-.446.98-.992v-2.167a1 1 0 00-.082-.67l-7-3a1 1 0 00-.788 0l-1.76 2.42a.997.997 0 01-1.176.078z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold tracking-wide">STCET</p>
            <p className="text-xs text-white/70">Content administration</p>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-7 lg:hidden">
              <div className="mb-5 grid size-11 place-items-center rounded-md bg-primary-800 text-white">
                <svg aria-hidden className="size-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051l.003.022a28.304 28.304 0 006.006-.002l.002-.022L12.887 6.25a1 1 0 10.75-1.788l-1.76-2.42a.999.999 0 00-1.176-.078l-7 3a1 1 0 00-.082.67v2.167c0 .546.438.988.98.992h3.167v12.167c0 .547.437.99.98.99h2.03c.542 0 .98-.443.98-.99V9.493h3.167c.542 0 .98-.446.98-.992v-2.167a1 1 0 00-.082-.67l-7-3a1 1 0 00-.788 0l-1.76 2.42a.997.997 0 01-1.176.078z" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase text-primary-700">STCET Admin</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-700">
              Forgot password?
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Enter your registered email address and we&apos;ll send you a secure link to reset your password.
            </p>
            <ForgotPasswordForm />
            <p className="mt-7 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
              <Link className="font-semibold text-primary-700 hover:text-primary-900" href="/admin/login">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}