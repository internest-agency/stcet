"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaQuoteRight } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";

import Container from "../../ui/Container";
import RichText from "../../ui/RichText";
import SectionHeading from "../../ui/SectionHeading";
import {
  aboutTrust as defaultTrust,
  type AboutTrustContent,
} from "@/src/lib/content/about-content";
import { resolveAboutIcon } from "@/src/lib/content/about-icons";

gsap.registerPlugin(ScrollTrigger);

export default function OurTrust({
  content = defaultTrust,
}: {
  content?: AboutTrustContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pillars = content.pillars ?? [];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const eyebrow = section.querySelector<HTMLElement>(".trust-eyebrow");
      const intro = section.querySelector<HTMLElement>(".trust-intro");
      const cards = gsap.utils.toArray<HTMLElement>(".trust-pillar", section);
      const statement = section.querySelector<HTMLElement>(
        ".institution-statement",
      );

      if (eyebrow) {
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              eyebrow,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            );
          },
        });
      }

      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              intro,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            );
          },
        });
      }

      if (cards.length) {
        ScrollTrigger.create({
          trigger: cards[0],
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
              },
            );
          },
        });
      }

      if (statement) {
        ScrollTrigger.create({
          trigger: statement,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              statement,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            );
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [content]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
      aria-labelledby="trust-heading"
    >
      <Container>
        {/* INTRO */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <div className="trust-eyebrow mb-6 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary-700">
                {content.eyebrow || "Our Trust"}
              </span>
            </div>

            <SectionHeading as="h2" html={content.heading ?? undefined} />
          </div>

          <div className="trust-intro lg:border-l lg:border-primary-900/15 lg:pb-1 lg:pl-8">
            <RichText
              html={content.intro}
              className="max-w-2xl text-base leading-8 text-gray-600 sm:text-lg sm:leading-9"
            />
          </div>
        </div>

        {/* PILLAR CARDS */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = resolveAboutIcon(pillar.icon, FaGraduationCap);

            return (
              <article
                key={pillar.id ?? `${pillar.title}-${index}`}
                className="trust-pillar group relative isolate flex min-h-[310px] flex-col overflow-hidden border border-primary-900/10 bg-[#F7F8FA] p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-primary-900/[0.07] sm:min-h-[330px] sm:p-8 lg:p-10"
              >
                {/* Card header */}
                <div className="flex h-12 w-12 items-center justify-center rounded border border-primary-900/10 bg-white text-xl text-primary-700 transition-all duration-300 group-hover:border-accent-400/40 group-hover:bg-accent-400 group-hover:text-white">
                  <Icon aria-hidden="true" />
                </div>

                {/* Card content */}
                <div className="mt-9 flex-1">
                  <SectionHeading
                    as="h3"
                    customSize={true}
                    className="text-2xl"
                  >
                    {pillar.title}
                  </SectionHeading>

                  <RichText
                    html={pillar.description}
                    className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8"
                  />
                </div>

                {/* Card footer */}
                <div className="mt-8 border-t uppercase text-gray-400 border-primary-900/10 pt-5">
                  {pillar.tag}
                </div>
              </article>
            );
          })}
        </div>

        {/* CLOSING STATEMENT */}
        <div className="institution-statement group relative mt-12 overflow-hidden rounded-2xl bg-primary-900 px-6 py-9 sm:mt-16 sm:px-10 sm:py-12 lg:mt-20 lg:px-14 lg:py-14">
          {/* Background graphic */}
          <FaQuoteRight
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-5 text-[140px] text-white/[0.04] sm:text-[200px] lg:text-[250px]"
          />

          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-1 bg-accent-400"
          />

          <div className="relative grid gap-7 lg:grid-cols-[190px_1fr] lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                  {content.closingEyebrow || "STCET"}
                </span>
              </div>

              <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                {content.closingLabel || "Our Approach"}
              </span>
            </div>

            <div>
              <RichText
                html={content.closingStatement}
                className="max-w-4xl text-xl font-semibold leading-8 tracking-tight text-white sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10"
              />

              <div className="mt-8 flex items-center gap-4">
                <span className="h-[2px] w-10 bg-accent-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  {content.closingFooter || "Learn · Innovate · Grow"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
