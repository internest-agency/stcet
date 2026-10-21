"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings2,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { logoutAdmin } from "@/src/app/admin/actions";
import type { CurrentAdmin } from "@/src/lib/admin/authorization";

const availableLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/contact-messages", label: "Contact Messages", icon: Mail },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/about", label: "About", icon: Building2 },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/faculty", label: "Faculty", icon: UserRound },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/admissions", label: "Admissions", icon: ClipboardList },
  { href: "/admin/scholarships", label: "Scholarships", icon: BookOpen },
  { href: "/admin/placements", label: "Placements", icon: ChartNoAxesCombined },
  { href: "/admin/infrastructure", label: "Infrastructure", icon: Building2 },
  { href: "/admin/committees", label: "Committees", icon: ShieldCheck },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/seo", label: "SEO", icon: FileText },
  { href: "/admin/users", label: "Users", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
  { href: "/admin/menus", label: "Menus", icon: Menu },
  {
    href: "/admin/institutional-pages",
    label: "Institutional Pages",
    icon: FileText,
  },
];

function titleForPath(pathname: string) {
  if (pathname.startsWith("/admin/enquiries")) return "Enquiries";
  if (pathname.startsWith("/admin/contact-messages")) return "Contact Messages";
  if (pathname.startsWith("/admin/courses")) return "Courses";
  if (pathname.startsWith("/admin/faculty")) return "Faculty";
  if (pathname.startsWith("/admin/gallery")) return "Gallery";
  if (pathname.startsWith("/admin/admissions")) return "Admissions";
  if (pathname.startsWith("/admin/scholarships")) return "Scholarships";
  if (pathname.startsWith("/admin/placements")) return "Placements";
  if (pathname.startsWith("/admin/events")) return "Events";
  if (pathname.startsWith("/admin/infrastructure")) return "Infrastructure";
  if (pathname.startsWith("/admin/committees")) return "Committees";
  if (pathname.startsWith("/admin/media")) return "Media";
  if (pathname.startsWith("/admin/seo")) return "SEO";
  if (pathname.startsWith("/admin/users")) return "Users";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  if (pathname.startsWith("/admin/menus")) return "Menus";
  if (pathname.startsWith("/admin/institutional-pages"))
    return "Institutional Pages";
  if (pathname.startsWith("/admin/about")) return "About";
  return "Dashboard";
}

export default function AdminShell({
  admin,
  children,
}: {
  admin: CurrentAdmin;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title = titleForPath(pathname);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {drawerOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-gray-950/45 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          type="button"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(19rem,86vw)] flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:w-64 lg:translate-x-0 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-18 items-center gap-3 border-b border-gray-100 px-5">
          <span className="grid size-9 place-items-center rounded-md bg-primary-800 text-white">
            <GraduationCap aria-hidden className="size-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-gray-900">STCET</p>
            <p className="text-[11px] font-semibold uppercase text-gray-500">
              Website admin
            </p>
          </div>
          <button
            aria-label="Close navigation"
            className="ml-auto grid size-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            type="button"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <nav
          aria-label="Admin navigation"
          className="flex-1 overflow-y-auto px-3 py-5"
        >
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Workspace
          </p>
          <ul className="space-y-1">
            {availableLinks.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin/courses"
                  ? pathname.startsWith(href)
                  : pathname === href;

              return (
                <li key={href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${active ? "bg-primary-50 text-primary-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Icon aria-hidden className="size-4.5" />
                    {label}
                    {active ? (
                      <ChevronRight aria-hidden className="ml-auto size-4" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-gray-100 p-3">
          <div className="mb-2 flex min-w-0 items-center gap-3 px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-800">
              {admin.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-800">
                {admin.name}
              </p>
              <p className="text-xs text-gray-500">
                {admin.role === "SUPER_ADMIN" ? "Administrator" : "Editor"}
              </p>
            </div>
          </div>
          <form action={logoutAdmin}>
            <button
              className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-primary-700"
              type="submit"
            >
              <LogOut aria-hidden className="size-4.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              className="grid size-9 place-items-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              type="button"
            >
              <Menu aria-hidden className="size-5" />
            </button>
            <div>
              <p className="text-[11px] font-semibold text-gray-500">
                STCET / Admin
              </p>
              <h1 className="text-base font-bold text-gray-900">{title}</h1>
            </div>
          </div>
          <p className="hidden text-sm text-gray-600 sm:block">{admin.email}</p>
        </header>
        <main className="mx-auto w-full max-w-360 px-4 py-6 sm:px-7 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
