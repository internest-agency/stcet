"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * ============================================================
 * HASH SCROLL
 * ============================================================
 *
 * ScrollSmoother transforms #smooth-content, so the browser's
 * native hash navigation (and Next.js Link's) cannot position
 * anchor targets correctly. This component routes every hash
 * navigation through the existing ScrollSmoother instance.
 *
 * Handles:
 *   - same-page anchor clicks (intercepted before Next.js)
 *   - cross-page navigations that include a hash
 *   - browser back/forward and external hash changes
 *   - direct loads of a URL that already contains a hash
 *
 * The fixed site header height is subtracted so the target is
 * never hidden underneath the navbar.
 * ============================================================
 */

const HEADER_SELECTOR = ".site-header";
const MAX_ATTEMPTS = 20;
const RETRY_DELAY = 50;
const NAVIGATION_DELAY = 120;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
  return header ? header.offsetHeight : 0;
}

function resolveTarget(hash: string): HTMLElement | null {
  if (!hash || hash === "#") return null;

  let id = hash.slice(1);

  try {
    id = decodeURIComponent(id);
  } catch {
    // Keep the raw fragment when it is not valid URI-encoded.
  }

  return id ? document.getElementById(id) : null;
}

function scrollToHash(hash: string, attempt = 0): void {
  const smooth = !prefersReducedMotion();
  const smoother = ScrollSmoother.get();
  const target = resolveTarget(hash);

  if (!smoother || !target) {
    if (attempt < MAX_ATTEMPTS) {
      window.setTimeout(() => scrollToHash(hash, attempt + 1), RETRY_DELAY);
    }
    return;
  }

  ScrollTrigger.refresh();

  const offset = getHeaderOffset();
  const position = Math.max(0, smoother.offset(target, "top top") - offset);

  smoother.scrollTo(position, smooth);
}

export default function HashScroll() {
  const pathname = usePathname();

  /*
   * Same-page anchor clicks.
   *
   * Intercepted during the capture phase so Next.js <Link>
   * does not run its own (incompatible) hash navigation.
   */
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const url = new URL(href, window.location.href);

      // Only handle links that stay on the current page.
      if (
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search ||
        !url.hash ||
        url.hash === "#"
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (window.location.hash !== url.hash) {
        window.history.pushState(null, "", url.hash);
      }

      scrollToHash(url.hash);
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  /*
   * Browser back/forward and any other native hash change.
   */
  useEffect(() => {
    const handleHashChange = () => scrollToHash(window.location.hash);

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  /*
   * Cross-page navigation (pathname change) and direct loads.
   *
   * A short delay lets the incoming route mount and settle
   * before the target position is measured.
   */
  useEffect(() => {
    if (!window.location.hash) return;

    const timer = window.setTimeout(
      () => scrollToHash(window.location.hash),
      NAVIGATION_DELAY,
    );

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
