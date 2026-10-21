"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  FiArrowRight,
  FiBookOpen,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";

const highlights = [
  { icon: FiBookOpen, label: "QUALITY", secondLine: "EDUCATION" },
  { icon: FiZap, label: "INNOVATION", secondLine: "& RESEARCH" },
  { icon: FiUsers, label: "INDUSTRY", secondLine: "COLLABORATION" },
  { icon: FiTrendingUp, label: "CAREER", secondLine: "OPPORTUNITIES" },
];

export default function HeroSection1() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Respect reduced-motion: leave the content fully visible and skip GSAP.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll("[data-hero-intro]");
      const highlightsEl = root.querySelector("[data-hero-highlights]");

      // Content stays visible if GSAP is unavailable or an animation fails,
      // because the hidden state is only applied by the tween itself.
      gsap.fromTo(
        intro,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      if (highlightsEl) {
        gsap.fromTo(
          highlightsEl.children,
          { y: 12, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.08,
            delay: 0.35,
            ease: "power2.out",
            clearProps: "transform",
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="stcet-hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#031637] text-white"
    >
      {/* Campus image */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/campus-building.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-center"
        />
      </div>

      {/* Layered navy overlays: dark on the left for text, lighter on the right
          so the campus building stays visible. */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#03132f] via-[#03132f]/80 to-[#03132f]/10 lg:via-[#03132f]/70" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#031637] via-[#03132f]/20 to-transparent" />

      {/* Smooth fade into the section below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#031637]" />

      {/* Decorative technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,180,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.3) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(90deg, black, transparent 85%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pb-16 pt-28 sm:px-10 md:px-14 lg:px-16 lg:pb-20 lg:pt-36">
        <div className="max-w-3xl">
          <div
            data-hero-intro
            className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300 sm:text-xs md:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#ff642d] shadow-[0_0_12px_2px_rgba(255,100,45,0.5)]" />
            Engineering a brighter tomorrow
          </div>

          <SectionHeading
            id="stcet-hero-title"
            as="h1"
            customSize={true}
            className="text-[clamp(2.15rem,6.2vw,5.5rem)] leading-none! tracking-[-0.015em] text-white!"
          >
            Learning today
            <br />
            for a brighter
            <br />
            <span className="text-accent-400">tomorrow.</span>
          </SectionHeading>

          <p
            data-hero-intro
            className="mt-6 max-w-[36rem] text-base leading-relaxed text-slate-200/90 sm:text-lg"
          >
            At S. Thangapazham College of Engineering &amp; Technology, we
            empower future-ready engineers through academic excellence,
            innovation, and real-world learning.
          </p>

          <div
            data-hero-intro
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button
              href={"/enquire-now"}
              variant="accent"
              size="md"
              rightIcon={<FiArrowRight />}
              className="min-h-12 px-7 text-sm font-semibold tracking-wide shadow-[0_12px_30px_-12px_rgba(255,100,45,0.8)] focus:ring-offset-[#031637] sm:text-base"
            >
              Enquire Now
            </Button>
          </div>

          {/* Feature highlights */}
          <div
            data-hero-highlights
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-7 md:grid-cols-4 lg:mt-12"
          >
            {highlights.map(({ icon: Icon, label, secondLine }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-300/25 bg-sky-400/10 text-sky-200">
                  <Icon size={20} />
                </span>
                <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-slate-100 sm:text-xs">
                  {label}
                  <span className="block text-slate-300">{secondLine}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right-side decorative text (hidden where it would crowd) */}
        <div className="pointer-events-none absolute bottom-16 right-6 hidden max-w-[240px] border-l-2 border-[#ff642d] bg-[#031637]/40 py-3 pl-5 pr-4 backdrop-blur-sm xl:block">
          <p className="text-[11px] font-semibold uppercase leading-6 tracking-[0.18em] text-slate-200/90">
            Nurturing talent
            <br />
            Building leaders
            <br />
            Creating opportunities
          </p>
        </div>

        <div className="pointer-events-none absolute right-16 top-24 hidden h-3 w-3 rounded-full bg-[#ff642d] shadow-[0_0_25px_8px_rgba(255,100,45,0.2)] lg:block" />
      </div>
    </section>
  );
}
