"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import Button from "@/src/components/ui/Button";
import Container from "@/src/components/ui/Container";
import { FaCircleArrowRight } from "react-icons/fa6";

/*
 * ============================================================
 * 404 — NOT FOUND
 * ============================================================
 *
 * Light "technical editorial" treatment that matches the
 * existing STCET visual language (see the Mission section and
 * the TNEA Journey section):
 *
 *   - subtle technical grid + restrained gradient lighting
 *   - editorial eyebrow with an accent rule
 *   - oversized primary "404" as the focal point
 *   - accent + primary CTAs
 *
 * Animation is a single, self-contained GSAP timeline.
 * Content is visible by default (gsap.from only hides it while
 * the animation runs), so the page stays usable without JS and
 * when prefers-reduced-motion is set.
 * ============================================================
 */

export default function NotFoundContent() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .from(".nf-eyebrow", {
          opacity: 0,
          y: 18,
          duration: 0.6,
        })
        .from(
          ".nf-number",
          {
            opacity: 0,
            y: 48,
            scale: 0.94,
            duration: 1,
            ease: "power4.out",
          },
          0.1,
        )
        .from(
          ".nf-heading",
          {
            opacity: 0,
            y: 26,
            duration: 0.7,
          },
          0.35,
        )
        .from(
          ".nf-description",
          {
            opacity: 0,
            y: 22,
            duration: 0.7,
          },
          0.5,
        )
        .from(
          ".nf-actions",
          {
            opacity: 0,
            y: 18,
            duration: 0.6,
          },
          0.65,
        )
        .from(
          ".nf-tagline",
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
          },
          0.8,
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="not-found-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-gray-50 text-primary-900"
    >
      {/* =====================================================
          BACKGROUND — technical grid
      ===================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#10243A 1px, transparent 1px), linear-gradient(90deg, #10243A 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* =====================================================
          BACKGROUND — restrained gradient lighting
      ===================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-[-120px] -z-10 h-[440px] w-[440px] rounded-full bg-accent-200/40 blur-3xl"
      />

      {/* =====================================================
          BACKGROUND — orbital rings (engineering motif)
      ===================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 -z-10 h-[560px] w-[560px] rounded-full border border-primary-900/10 sm:-right-24 sm:-top-64 sm:h-[760px] sm:w-[760px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[360px] w-[360px] rounded-full border border-primary-900/[0.07] sm:h-[520px] sm:w-[520px]"
      />

      <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* =================================================
              EYEBROW
          ================================================== */}
          <div className="nf-eyebrow flex items-center gap-4">
            <span className="h-[2px] w-9 bg-accent-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-700/80">
              Error 404
            </span>
            <span className="h-[2px] w-9 bg-accent-500 sm:hidden" />
          </div>

          {/* =================================================
              404 — focal point
          ================================================== */}
          <div className="nf-number relative mt-8" aria-hidden="true">
            {/* Outlined echo */}
            <span
              className="pointer-events-none absolute inset-0 select-none text-[clamp(5.5rem,23vw,14rem)] font-extrabold leading-none tracking-[-0.06em]"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(16, 36, 58, 0.14)",
                transform: "translate(6px, 6px)",
              }}
            >
              404
            </span>

            {/* Solid number */}
            <span className="relative block text-[clamp(5.5rem,23vw,14rem)] font-extrabold leading-none tracking-[-0.06em] text-primary-800">
              404
            </span>

            {/* Accent baseline */}
            <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-accent-500" />
          </div>

          {/* =================================================
              HEADING
          ================================================== */}
          <h1
            id="not-found-heading"
            className="nf-heading mt-8 max-w-2xl text-balance text-2xl font-extrabold uppercase leading-tight tracking-tight text-primary-700 sm:text-3xl lg:text-4xl"
          >
            Looks like you&apos;ve taken a wrong turn.
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================== */}
          <p className="nf-description mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg sm:leading-9">
            The page you&apos;re looking for may have moved, been removed, or is
            no longer available. Let&apos;s help you find your way back.
          </p>

          {/* =================================================
              ACTIONS
          ================================================== */}
          <div className="nf-actions mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Button
              href="/"
              variant="accent"
              size="md"
              className="w-full sm:w-auto"
              rightIcon={<FaCircleArrowRight />}
            >
              Back to Home
            </Button>

            <Button
              href="/enquire-now#application"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              rightIcon={<FaCircleArrowRight />}
            >
              Enquire Now
            </Button>
          </div>

          {/* =================================================
              TAGLINE
          ================================================== */}
          <div className="nf-tagline mt-14 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-700/60 sm:text-xs">
            <span className="h-px w-8 bg-primary-900/20" />
            Engineering your way forward
            <span className="h-px w-8 bg-primary-900/20" />
          </div>
        </div>
      </Container>
    </section>
  );
}
