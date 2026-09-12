"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const reasons = [
  "Strong foundation in electronics and communication",
  "Exposure to hardware and software integration",
  "Emphasis on practical application",
  "Opportunities to explore emerging technologies",
  "Broad career pathways across core and technology sectors",
];

export default function ECEWhyStudy() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(".why-heading");
      const items = gsap.utils.toArray<HTMLElement>(".why-item");
      const closing = section.querySelector(".course-closing");

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

      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                x: -20,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.65,
                delay: index * 0.07,
                ease: "power3.out",
              },
            );
          },
        });
      });

      if (closing) {
        ScrollTrigger.create({
          trigger: closing,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              closing,
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
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Why Study ECE at STCET?
              </span>
            </div>

            <h2 className="why-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
              Build the knowledge behind connected technology.
            </h2>
          </div>

          {/* Reasons */}
          <div className="border-t border-gray-200">
            {reasons.map((reason, index) => (
              <div
                key={reason}
                className="why-item group relative grid gap-4 border-b border-gray-200 py-7 sm:grid-cols-[72px_1fr] sm:items-center sm:gap-8 sm:py-8"
              >
                <span className="text-sm font-black tracking-[0.18em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center justify-between gap-5">
                  <span className="text-lg font-extrabold leading-7 tracking-[-0.015em] text-gray-900 transition-transform duration-300 group-hover:translate-x-1 sm:text-xl sm:leading-8">
                    {reason}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400 transition-transform duration-300 group-hover:scale-150"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="course-closing relative mt-16 overflow-hidden bg-primary-700 px-7 py-10 text-white sm:mt-20 sm:px-10 sm:py-12 lg:mt-24 lg:px-14 lg:py-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-10 select-none text-[9rem] font-black leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[14rem] lg:text-[19rem]"
          >
            ECE
          </span>

          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-full w-1 bg-accent-400"
          />

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Build Your Future
              </span>
            </div>

            <h2 className="max-w-5xl text-2xl font-extrabold leading-[1.2] tracking-[-0.025em] sm:text-3xl lg:text-4xl">
              Understand the technology behind the connection. Build what
              connects the world.
            </h2>
          </div>
        </div>
      </Container>
    </section>
  );
}
