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

interface HeaderProps {
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

const courseLinks = [
  {
    href: "/courses/computer-science-engineering",
    label: "Computer Science Engineering",
  },
  {
    href: "/courses/computer-science-ai-ml",
    label: "Computer Science Engineering (AI & ML)",
  },
  {
    href: "/courses/electronics-communication-engineering",
    label: "Electronics & Communication Engineering",
  },
  {
    href: "/courses/electrical-electronics-engineering",
    label: "Electrical & Electronics Engineering",
  },
  {
    href: "/courses/information-technology",
    label: "Information Technology",
  },
];

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About Us",
  },
  {
    href: "/admissions",
    label: "Admissions",
  },
  {
    href: "/infrastructure",
    label: "Infrastructure",
  },
  {
    href: "/placements",
    label: "Placement",
  },
  {
    href: "/careers",
    label: "Careers",
  },
  {
    href: "/enquire-now",
    label: "Contact Us",
  },
];

export default function Header({ overlay = false }: HeaderProps) {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

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
    if (!overlay) {
      setIsScrolled(false);
      return;
    }

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
   * CLOSE MOBILE MENU
   * ============================================================
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCoursesOpen(false);
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
              src="/images/logo-transparent.png"
              alt="S. Thangapazham College of Engineering and Technology"
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
            {/* HOME */}
            <Link href="/" className="header-nav-item">
              Home
            </Link>

            {/* ABOUT */}
            <Link href="/about" className="header-nav-item">
              About Us
            </Link>

            {/* COURSES */}
            <div className="header-dropdown">
              <Dropdown
                key={pathname}
                href="/courses"
                label="Courses"
                items={courseLinks}
              />
            </div>

            {/* REMAINING LINKS */}
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header-nav-item"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ====================================================
              DESKTOP CTA
          ===================================================== */}
          <div className="hidden lg:block">
            <Button
              href="/enquire-now"
              variant="secondary"
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
              href="/enquire-now"
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
            {/* HOME */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="
                block
                border-b
                border-gray-200
                py-5
                text-lg
                font-bold
                uppercase
                tracking-tight
                text-gray-900
                transition-colors
                hover:text-primary-700
              "
            >
              Home
            </Link>

            {/* ABOUT */}
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="
                block
                border-b
                border-gray-200
                py-5
                text-lg
                font-bold
                uppercase
                tracking-tight
                text-gray-900
                transition-colors
                hover:text-primary-700
              "
            >
              About Us
            </Link>

            {/* ==================================================
                COURSES
            =================================================== */}
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                {/* Courses Link */}
                <Link
                  href="/courses"
                  onClick={closeMobileMenu}
                  className="
                    py-5
                    text-lg
                    font-bold
                    uppercase
                    tracking-tight
                    text-gray-900
                    transition-colors
                    hover:text-primary-700
                  "
                >
                  Courses
                </Link>

                {/* Expand Button */}
                <button
                  type="button"
                  aria-label={
                    coursesOpen ? "Collapse courses" : "Expand courses"
                  }
                  aria-expanded={coursesOpen}
                  onClick={() => setCoursesOpen((prev) => !prev)}
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
                  {coursesOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {/* Course List */}
              <div
                className={`
                  grid
                  transition-[grid-template-rows]
                  duration-300
                  ease-out

                  ${coursesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                `}
              >
                <div className="overflow-hidden">
                  <div className="mb-5 border-l-2 border-primary-700 pl-4">
                    {courseLinks.map((course) => (
                      <Link
                        key={course.href}
                        href={course.href}
                        onClick={closeMobileMenu}
                        className="
                          block
                          py-3
                          text-sm
                          font-medium
                          leading-5
                          text-gray-600
                          transition-colors
                          hover:text-primary-700
                        "
                      >
                        {course.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                REMAINING LINKS
            =================================================== */}
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="
                  block
                  border-b
                  border-gray-200
                  py-5
                  text-lg
                  font-bold
                  uppercase
                  tracking-tight
                  text-gray-900
                  transition-colors
                  hover:text-primary-700
                "
              >
                {link.label}
              </Link>
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
              href="/enquire-now"
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
