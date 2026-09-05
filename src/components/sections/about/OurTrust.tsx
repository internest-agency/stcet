"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const trustPillars = [
  {
    number: "01",
    title: "Quality",
    description:
      "We are committed to maintaining high standards and creating meaningful learning experiences that contribute to the academic and personal development of students.",
  },
  {
    number: "02",
    title: "Opportunity",
    description:
      "We believe in expanding access to quality higher education, enabling students to pursue their aspirations, build confidence and realise their potential.",
  },
  {
    number: "03",
    title: "Excellence",
    description:
      "We continually strive to learn, improve and raise our standards across our educational initiatives, creating an environment that encourages continuous growth.",
  },
  {
    number: "04",
    title: "Values",
    description:
      "We aim to nurture responsible, disciplined and confident individuals who uphold strong values and contribute positively to their professions and society.",
  },
];

export default function OurTrust() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const eyebrow = sectionRef.current?.querySelector(
        ".trust-eyebrow",
      ) as HTMLElement | null;

      const heading = sectionRef.current?.querySelector(
        ".trust-heading",
      ) as HTMLElement | null;

      const intro = sectionRef.current?.querySelector(
        ".trust-intro",
      ) as HTMLElement | null;

      const pillars = gsap.utils.toArray<HTMLElement>(".trust-pillar");

      // Eyebrow
      if (eyebrow) {
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              eyebrow,
              {
                opacity: 0,
                y: 15,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Heading
      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              split.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              },
            );
          },
        });
      }

      // Intro
      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              intro,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Pillars
      pillars.forEach((pillar, index) => {
        ScrollTrigger.create({
          trigger: pillar,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              pillar,
              {
                opacity: 0,
                y: 35,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.75,
                delay: index * 0.08,
                ease: "power3.out",
              },
            );
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-white">
      <Container className="py-20 sm:py-24 lg:py-32">
        {/* -------------------------------------------------
            INTRO
        ------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 xl:gap-28">
          {/* Left */}
          <div>
            <div className="trust-eyebrow mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Our Trust
              </span>
            </div>

            <h2 className="trust-heading max-w-md text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl lg:text-5xl uppercase">
              Four pillars.
              <br />
              One purpose.
            </h2>
          </div>

          {/* Right */}
          <div className="lg:pt-8">
            <p className="trust-intro max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The Trust oversees four educational institutions across the
              southern districts of Tamil Nadu. Our approach is guided by a
              commitment to quality, opportunity, excellence and values.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------
            PILLARS
        ------------------------------------------------- */}
        <div className="mt-16 border-t border-gray-200 sm:mt-20 lg:mt-24">
          {trustPillars.map((pillar) => (
            <article
              key={pillar.number}
              className="trust-pillar group relative grid border-b border-gray-200 py-8 sm:py-10 lg:grid-cols-[100px_0.65fr_1.35fr] lg:items-start lg:gap-10 lg:py-12"
            >
              {/* Hover accent */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-400 transition-all duration-500 ease-out group-hover:w-full"
              />

              {/* Number */}
              <div>
                <span className="text-sm font-black tracking-[0.18em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700">
                  {pillar.number}
                </span>
              </div>

              {/* Title */}
              <div className="mt-4 lg:mt-0">
                <h3 className="text-2xl font-extrabold tracking-[-0.025em] text-gray-900 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:text-3xl">
                  {pillar.title}
                </h3>
              </div>

              {/* Description */}
              <div className="mt-4 lg:mt-0">
                <p className="max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  {pillar.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* -------------------------------------------------
            CLOSING STATEMENT
        ------------------------------------------------- */}
        <div className="relative mt-16 border-l-4 border-accent-400 bg-gray-50 px-7 py-8 sm:mt-20 sm:px-10 sm:py-10 lg:mt-24 lg:ml-[100px] lg:px-12 lg:py-12">
          <span
            aria-hidden="true"
            className="absolute right-6 top-3 select-none text-7xl font-black leading-none tracking-[-0.08em] text-primary-700/[0.04] sm:right-8 sm:text-8xl"
          >
            04
          </span>

          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Our Purpose
              </span>
            </div>

            <p className="max-w-4xl text-xl font-extrabold leading-8 tracking-[-0.02em] text-primary-700 sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10">
              Creating educational opportunities that help students build
              confidence, discover their potential and prepare for successful
              futures.
            </p>
          </div>
        </div>
      </Container>

      {/* Section transition */}
      <div className="h-px w-full bg-gray-200" />
    </section>
  );
}
