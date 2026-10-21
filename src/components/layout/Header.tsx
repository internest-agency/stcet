"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaCircleArrowRight,
  FaXmark,
} from "react-icons/fa6";

import Dropdown from "@/src/components/ui/Dropdown";
import Button from "@/src/components/ui/Button";
import Container from "../ui/Container";
import type { MenuItemNode } from "@/src/lib/menu-types";

interface HeaderProps {
  collegeName?: string | null;
  logoPath?: string | null;
  /**
   * Navigation items managed in the admin Menu Management screen.
   *
   * Fetched on the server (see `getMenuItems`) and passed down so the Header
   * stays a Client Component without importing Prisma. When empty or
   * unavailable, a documented fallback navigation is rendered.
   */
  menuItems?: MenuItemNode[];
  /**
   * Set overlay=true on the homepage.
   *
   * The navbar starts with white text over the hero
   * and changes to dark text after scrolling.
   *
   * On inner pages, leave overlay=false.
   * The navbar will use dark text from the beginning.
   */
  overlay?: boolean;
}

/*
 * Deliberate, documented fallback used ONLY when the menu table has no
 * published/active items or the query is temporarily unavailable. It is not a
 * second source of truth: as soon as an administrator publishes menu items,
 * those records fully replace this list. It exists so the public site never
 * renders an empty/broken header.
 */
const FALLBACK_NAV: MenuItemNode[] = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Admissions", "/admissions"],
  ["Infrastructure", "/infrastructure"],
  ["Placements", "/placements"],
  ["Careers", "/careers"],
  ["Contact Us", "/contact#application"],
].map(([title, url], index) => ({
  id: -(index + 1),
  parentId: null,
  title,
  url,
  type: "link",
  sortOrder: index,
  isActive: true,
  openInNewTab: false,
  isPublished: true,
  children: [],
  depth: 0,
}));

/** External destinations render as plain anchors; internal ones use `Link`. */
function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

/**
 * A destination of `#` is an explicit placeholder (typically a dropdown
 * parent such as "Courses"). It must never trigger navigation or scroll the
 * page to the top, so it renders as a non-navigating control instead of a link.
 */
function isPlaceholderDestination(url: string) {
  return url.trim() === "#";
}

/**
 * Flattens a branch into a single dropdown list. Menu nesting is arbitrary, so
 * deeper levels are surfaced in the same panel rather than being dropped.
 */
function flattenForDropdown(
  nodes: MenuItemNode[],
): { href: string; label: string; openInNewTab: boolean }[] {
  return nodes.flatMap((node) => [
    { href: node.url, label: node.title, openInNewTab: node.openInNewTab },
    ...flattenForDropdown(node.children),
  ]);
}

/** A single top-level desktop item: dropdown when it has children, else link. */
function DesktopNavItem({
  item,
  pathname,
}: {
  item: MenuItemNode;
  pathname: string;
}) {
  const target = item.openInNewTab ? "_blank" : undefined;
  const rel = item.openInNewTab ? "noopener noreferrer" : undefined;

  if (item.children.length > 0) {
    return (
      <Dropdown
        key={`${item.id}-${pathname}`}
        href={item.url}
        label={item.title}
        items={flattenForDropdown(item.children)}
      />
    );
  }

  if (isExternalUrl(item.url)) {
    return (
      <a
        key={item.id}
        href={item.url}
        className="header-nav-item"
        target={target}
        rel={rel}
      >
        {item.title}
      </a>
    );
  }

  if (isPlaceholderDestination(item.url)) {
    return (
      <button
        key={item.id}
        type="button"
        className="header-nav-item cursor-pointer"
      >
        {item.title}
      </button>
    );
  }

  return (
    <Link
      key={item.id}
      href={item.url}
      className="header-nav-item"
      target={target}
      rel={rel}
    >
      {item.title}
    </Link>
  );
}

/**
 * Recursive mobile navigation node. Items with children render as expandable
 * sections (multiple can be open at once) at any depth; leaves render as links.
 */
function MobileNavNode({
  item,
  depth,
  openMenus,
  onToggle,
  onNavigate,
}: {
  item: MenuItemNode;
  depth: number;
  openMenus: Set<number>;
  onToggle: (id: number) => void;
  onNavigate: () => void;
}) {
  const target = item.openInNewTab ? "_blank" : undefined;
  const rel = item.openInNewTab ? "noopener noreferrer" : undefined;
  const titleClass =
    depth === 0
      ? "block py-5 text-lg font-bold uppercase tracking-tight text-gray-900 transition-colors hover:text-primary-700"
      : "block py-3 text-sm font-medium leading-5 text-gray-600 transition-colors hover:text-primary-700";

  const hasChildren = item.children.length > 0;
  const open = openMenus.has(item.id);

  const link = isPlaceholderDestination(item.url) ? (
    <button
      type="button"
      aria-expanded={hasChildren ? open : undefined}
      onClick={hasChildren ? () => onToggle(item.id) : undefined}
      className={`${titleClass} w-full cursor-pointer text-left`}
    >
      {item.title}
    </button>
  ) : isExternalUrl(item.url) ? (
    <a
      href={item.url}
      onClick={onNavigate}
      target={target}
      rel={rel}
      className={titleClass}
    >
      {item.title}
    </a>
  ) : (
    <Link
      href={item.url}
      onClick={onNavigate}
      target={target}
      rel={rel}
      className={titleClass}
    >
      {item.title}
    </Link>
  );

  if (!hasChildren) {
    return depth === 0 ? (
      <div className="border-b border-gray-200">{link}</div>
    ) : (
      link
    );
  }

  return (
    <div className={depth === 0 ? "border-b border-gray-200" : ""}>
      <div className="flex items-center justify-between">
        {link}
        <button
          type="button"
          aria-label={`${open ? "Collapse" : "Expand"} ${item.title}`}
          aria-expanded={open}
          onClick={() => onToggle(item.id)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            text-gray-600
            transition-colors
            hover:text-primary-700
          "
        >
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <div
        className={`
          grid
          transition-[grid-template-rows]
          duration-300
          ease-out

          ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `}
      >
        <div className="overflow-hidden">
          <div
            className={
              depth === 0
                ? "mb-5 border-l-2 border-primary-700 pl-4"
                : "mb-3 border-l-2 border-primary-700 pl-4"
            }
          >
            {item.children.map((child) => (
              <MobileNavNode
                key={child.id}
                item={child}
                depth={depth + 1}
                openMenus={openMenus}
                onToggle={onToggle}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header({
  overlay = false,
  collegeName,
  logoPath,
  menuItems,
}: HeaderProps) {
  const pathname = usePathname();

  const items = menuItems && menuItems.length > 0 ? menuItems : FALLBACK_NAV;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<number>>(new Set());

  /*
   * ============================================================
   * SCROLL DETECTION
   * ============================================================
   *
   * Only needed for the homepage overlay header.
   *
   * Before scroll:
   *   Glass navbar + white text
   *
   * After scroll:
   *   Glass navbar + dark text
   */
  useEffect(() => {
    if (!overlay) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [overlay]);

  /*
   * ============================================================
   * BODY SCROLL LOCK
   * ============================================================
   */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /*
   * ============================================================
   * NAVIGATION COLOR MODE
   * ============================================================
   *
   * Inner page:
   *   dark text
   *
   * Homepage:
   *   top       -> white text
   *   scrolled  -> dark text
   */
  const isLightNav = !overlay || isScrolled;

  const navMode = isLightNav ? "nav-light" : "nav-dark";

  /*
   * ============================================================
   * MOBILE MENU HELPERS
   * ============================================================
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenus(new Set());
  };

  const toggleMobileSection = (id: number) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {/* ========================================================
          HEADER
          The header itself is ALWAYS transparent.
      ========================================================= */}
      <header className="site-header">
        <Container
          className="
            mx-auto
            flex
            items-center
            justify-between
            py-3
          "
        >
          {/* ====================================================
              LOGO
          ===================================================== */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="
              relative
              z-[60]
              flex
              shrink-0
              items-center
              rounded-full
              backdrop-blur-md
              transition-all
              duration-300
            "
          >
            <Image
              src={logoPath ?? "/images/logo-transparent.png"}
              alt={
                collegeName ??
                "S. Thangapazham College of Engineering and Technology"
              }
              width={80}
              height={40}
              priority
              className="
                h-auto
                w-[76px]
                sm:w-[76px]
              "
            />
          </Link>

          {/* ====================================================
              DESKTOP NAVIGATION
          ===================================================== */}
          <nav
            className={`
              nav-container
              backdrop-blur-2xl
              ${navMode}
            `}
          >
            {items.map((item) => (
              <DesktopNavItem key={item.id} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* ====================================================
              DESKTOP CTA
          ===================================================== */}
          <div className="hidden lg:block">
            <Button
              href="/enquire-now#application"
              variant="accent"
              size="md"
              rightIcon={<FaCircleArrowRight />}
            >
              Apply Now
            </Button>
          </div>

          {/* ====================================================
              MOBILE CONTROLS
          ===================================================== */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Apply */}
            <Link
              href="/enquire-now#application"
              onClick={closeMobileMenu}
              className="
                hidden
                rounded-full
                bg-primary-700
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-white
                shadow-sm
                sm:inline-flex
              "
            >
              Apply Now
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`
                relative
                z-[60]
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                backdrop-blur-xl
                transition-all
                duration-300

                ${
                  isLightNav
                    ? `
                      border-white/60
                      bg-white/70
                      text-gray-900
                    `
                    : `
                      border-white/25
                      bg-white/10
                      text-white
                    `
                }
              `}
            >
              {mobileMenuOpen ? (
                <FaXmark className="text-lg" />
              ) : (
                <FaBars className="text-lg" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* ========================================================
          MOBILE MENU
      ========================================================= */}
      <div
        className={`
          fixed
          inset-0
          z-40
          lg:hidden
          ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* ------------------------------------------------------
            Backdrop
        ------------------------------------------------------- */}
        <div
          className={`
            absolute
            inset-0
            bg-black/40
            backdrop-blur-sm
            transition-opacity
            duration-500

            ${mobileMenuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={closeMobileMenu}
        />

        {/* ------------------------------------------------------
            Menu Panel
        ------------------------------------------------------- */}
        <div
          className={`
            absolute
            right-0
            top-0
            flex
            h-full
            w-[88%]
            max-w-md
            flex-col

            border-l
            border-white/30
            bg-white/90
            pt-24
            shadow-2xl

            backdrop-blur-2xl

            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* ----------------------------------------------------
              Mobile Navigation
          ----------------------------------------------------- */}
          <nav className="flex-1 overflow-y-auto px-6 pb-8">
            {items.map((item) => (
              <MobileNavNode
                key={item.id}
                item={item}
                depth={0}
                openMenus={openMenus}
                onToggle={toggleMobileSection}
                onNavigate={closeMobileMenu}
              />
            ))}
          </nav>

          {/* ----------------------------------------------------
              Mobile CTA
          ----------------------------------------------------- */}
          <div
            className="
              border-t
              border-gray-200
              bg-white/60
              p-6
              backdrop-blur-xl
            "
          >
            <Link
              href="/enquire-now#application"
              onClick={closeMobileMenu}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                bg-primary-700
                px-6
                py-4
                text-sm
                font-bold
                uppercase
                tracking-wide
                text-white
                transition-colors
                hover:bg-primary-800
              "
            >
              Apply Now
              <FaCircleArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
