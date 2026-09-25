"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FaQuoteRight } from "react-icons/fa";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const institutionStats = [
  {
    number: "2026–27",
    label: "Academic Journey",
  },
  {
    number: "05",
    label: "Engineering Branches",
  },
  {
    number: "04",
    label: "Year Degree Programmes",
  },
];

export default function OurInstitution() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const eyebrow = sectionRef.current?.querySelector(
        ".institution-eyebrow",
      ) as HTMLElement | null;

      const heading = sectionRef.current?.querySelector(
        ".institution-heading",
      ) as HTMLElement | null;

      const description = sectionRef.current?.querySelector(
        ".institution-description",
      ) as HTMLElement | null;

      const stats = gsap.utils.toArray<HTMLElement>(".institution-stat");

      const statement = sectionRef.current?.querySelector(
        ".institution-statement",
      ) as HTMLElement | null;

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

      // Description
      if (description) {
        ScrollTrigger.create({
          trigger: description,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              description,
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

      // Statistics
      stats.forEach((stat, index) => {
        ScrollTrigger.create({
          trigger: stat,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              stat,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.08,
                ease: "power3.out",
              },
            );
          },
        });
      });

      // Closing statement
      if (statement) {
        ScrollTrigger.create({
          trigger: statement,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              statement,
              {
                opacity: 0,
                y: 30,
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
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container className="py-14 sm:py-18 lg:py-20">
        {/* -------------------------------------------------
            INTRO
        ------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:gap-28">
          {/* Left */}
          <div>
            <div className="institution-eyebrow mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Our Institution
              </span>
            </div>

            <h2 className="institution-heading max-w-lg text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl lg:text-5xl uppercase">
              A new generation
              <br />
              of engineering
              <br />
              education.
            </h2>
          </div>

          {/* Right */}
          <div className="lg:pt-8">
            <p className="institution-description max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              S. Thangapazham College of Engineering and Technology commenced
              its academic journey in 2026 - 27 as a co-educational,
              self-financing engineering institution.
            </p>

            <p className="institution-description mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The institution offers four-year undergraduate engineering degree
              programmes across five branches, with a focus on strong technical
              foundations, practical skills, problem-solving and communication.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------
            STATISTICS
        ------------------------------------------------- */}
        <div className="mt-16 grid border-y border-gray-200 sm:mt-20 sm:grid-cols-3 lg:mt-24">
          {institutionStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`institution-stat group relative py-8 transition-colors duration-400 ease-out hover:bg-accent-400 sm:py-10 lg:py-12 ${
                index !== 0
                  ? "border-t border-gray-200 sm:border-l sm:border-t-0"
                  : ""
              }`}
            >
              <div className="px-0 sm:px-8 lg:px-10">
                {/* Number */}
                <span className="block text-4xl font-black tracking-[-0.04em] text-primary-700 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-white sm:text-5xl lg:text-6xl">
                  {stat.number}
                </span>

                {/* Label */}
                <span className="mt-3 block text-xs font-bold uppercase tracking-[0.16em] text-gray-500 transition-colors duration-300 group-hover:text-white">
                  {stat.label}
                </span>
              </div>

              {/* Hover accent */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-accent-200 transition-all duration-500 ease-out group-hover:w-full"
              />
            </div>
          ))}
        </div>

        {/* -------------------------------------------------
            CLOSING STATEMENT
        ------------------------------------------------- */}
        <div className="institution-statement group relative mt-16 overflow-hidden bg-primary-700 px-7 py-9 sm:mt-20 sm:px-10 sm:py-12 lg:mt-24 lg:px-14 lg:py-16">
          {/* Decorative background number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-10 select-none text-[11rem] font-black leading-none tracking-[-0.08em] text-white/[0.045] sm:-right-5 sm:-top-14 sm:text-[15rem] lg:text-[19rem]"
          >
            <FaQuoteRight />
          </span>

          {/* Accent line */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1 bg-accent-400"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[140px_1fr] lg:gap-12">
            {/* Label */}
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                  STCET
                </span>
              </div>

              <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Our Approach
              </span>
            </div>

            {/* Statement */}
            <div>
              <p className="max-w-4xl text-xl font-semibold leading-8 tracking-[-0.015em] text-white sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10">
                Our institution is committed to creating a learning environment
                where students can develop the knowledge, skills and confidence
                required to navigate an evolving engineering landscape and build
                meaningful futures.
              </p>

              {/* Bottom detail */}
              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 bg-accent-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Learn · Innovate · Grow
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Section transition */}
      <div className="h-px w-full bg-gray-200" />
    </section>
  );
}
