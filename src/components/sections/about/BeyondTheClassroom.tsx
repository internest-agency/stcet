"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const outcomes = [
  {
    number: "01",
    title: "Competent",
    description:
      "Strong knowledge, practical skills and professional capability.",
  },
  {
    number: "02",
    title: "Confident",
    description:
      "The confidence to explore opportunities and pursue aspirations.",
  },
  {
    number: "03",
    title: "Responsible",
    description:
      "Individuals who contribute meaningfully to their professions and society.",
  },
];

export default function BeyondTheClassroom() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const eyebrow = sectionRef.current?.querySelector(
        ".beyond-eyebrow",
      ) as HTMLElement | null;

      const heading = sectionRef.current?.querySelector(
        ".beyond-heading",
      ) as HTMLElement | null;

      const description = sectionRef.current?.querySelector(
        ".beyond-description",
      ) as HTMLElement | null;

      const outcomes = gsap.utils.toArray<HTMLElement>(".beyond-outcome");

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
          start: "top 88%",
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

      // Outcomes
      outcomes.forEach((outcome, index) => {
        ScrollTrigger.create({
          trigger: outcome,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              outcome,
              {
                opacity: 0,
                x: 30,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
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
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-50">
      <Container className="py-14 sm:py-18 lg:py-20">
        {/* -------------------------------------------------
            INTRO
        ------------------------------------------------- */}
        <div className="grid gap-12 lg:grid-cols-[0.80fr_1.25fr] lg:gap-20 xl:gap-28">
          {/* Left */}
          <div>
            <div className="beyond-eyebrow mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Beyond the Classroom
              </span>
            </div>

            <h2 className="beyond-heading max-w-md text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl lg:text-5xl uppercase">
              Learning that
              <br />
              goes beyond
              <br />
              the classroom.
            </h2>
          </div>

          {/* Right */}
          <div className="lg:pt-8">
            <p className="beyond-description max-w-3xl text-lg font-medium leading-8 text-gray-700 sm:text-xl sm:leading-9">
              Engineering education extends beyond academic knowledge.
            </p>

            <p className="beyond-description mt-6 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              At S. Thangapazham College of Engineering and Technology, we focus
              on developing well-rounded individuals through practical learning,
              collaboration, innovation, leadership and personal development.
            </p>

            <p className="beyond-description mt-6 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Our aim is to nurture competent professionals, confident
              individuals and responsible citizens who are prepared to
              contribute meaningfully to their professions and society.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------
            OUTCOMES
        ------------------------------------------------- */}
        <div className="mt-16 border-y border-gray-200 sm:mt-20 lg:mt-24">
          {outcomes.map((outcome) => (
            <div
              key={outcome.title}
              className="beyond-outcome group relative overflow-hidden border-b border-gray-200 last:border-b-0"
            >
              {/* Hover background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-primary-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />

              <div className="relative grid min-h-[150px] items-center gap-6 px-2 py-8 lg:px-8 sm:grid-cols-[80px_1fr_auto] sm:gap-8 sm:py-10 lg:min-h-[180px] lg:grid-cols-[100px_1fr_0.7fr_auto] lg:gap-10">
                {/* Number */}
                <span className="text-xs font-black tracking-[0.2em] text-gray-300 transition-colors duration-300 group-hover:text-white/40">
                  {outcome.number}
                </span>

                {/* Title */}
                <h3 className="text-4xl font-black uppercase leading-none tracking-[-0.045em] text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:text-white sm:text-3xl lg:text-4xl">
                  {outcome.title}
                </h3>

                {/* Description */}
                <p className="hidden max-w-sm text-md leading-6 text-gray-500 transition-colors duration-300 group-hover:text-white lg:block">
                  {outcome.description}
                </p>

                {/* Indicator */}
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-700 transition-transform duration-300 group-hover:scale-150" />
                </span>
              </div>

              {/* Accent */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 z-10 h-1 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
              />
            </div>
          ))}
        </div>

        {/* -------------------------------------------------
            FINAL STATEMENT
        ------------------------------------------------- */}
        <div className="mt-16 bg-primary-700 px-7 py-10 text-white sm:mt-20 sm:px-10 sm:py-12 lg:mt-24 lg:px-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Our Purpose
              </span>
            </div>

            <p className="max-w-4xl text-xl font-semibold leading-8 tracking-[-0.015em] sm:text-2xl sm:leading-9 lg:text-2xl lg:leading-10">
              We prepare students not only for careers, but for meaningful lives
              of learning, responsibility and contribution.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
