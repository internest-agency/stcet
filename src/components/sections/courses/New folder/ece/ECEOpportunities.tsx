"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const opportunities = [
  "Internet of Things",
  "Embedded Systems",
  "VLSI",
  "Robotics",
  "Automotive Electronics",
  "Wireless Technologies",
  "Signal & Image Processing",
  "Smart Devices",
];

export default function ECEOpportunities() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(".opportunity-heading");
      const items = gsap.utils.toArray<HTMLElement>(".opportunity-item");

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
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.05,
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-800 text-white"
    >
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20"
      >
        <div className="absolute right-10 top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute right-24 top-32 h-40 w-40 rounded-full border border-white/10" />
        <div className="absolute right-36 top-44 h-16 w-16 rounded-full bg-accent-400/10" />
      </div>

      <Container className="relative z-10 py-20 sm:py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                Opportunity Areas
              </span>
            </div>

            <h2 className="opportunity-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Explore the technologies shaping connected systems.
            </h2>

            <p className="mt-7 max-w-md text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              ECE provides a foundation for exploring some of the technologies
              shaping the next generation of connected systems.
            </p>
          </div>

          {/* Opportunities */}
          <div className="grid grid-cols-1 border-t border-white/15 sm:grid-cols-2">
            {opportunities.map((item, index) => (
              <div
                key={item}
                className="opportunity-item group relative flex items-center gap-4 border-b border-white/15 px-1 py-6 sm:px-5 sm:py-7"
              >
                <span className="text-xs font-black tracking-[0.18em] text-white/25 transition-colors duration-300 group-hover:text-accent-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-base font-bold text-white/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white sm:text-lg">
                  {item}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
