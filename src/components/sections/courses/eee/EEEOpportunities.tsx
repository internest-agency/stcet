"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const opportunities = [
  "Renewable Energy",
  "Electric Vehicles",
  "Smart Grids",
  "Power Electronics",
  "Industrial Automation",
  "Energy Management",
  "Battery Technologies",
  "Control Systems",
  "Smart Electrical Systems",
];

export default function EEEOpportunities() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector<HTMLElement>(
        ".opportunity-heading",
      );

      const items = gsap.utils.toArray<HTMLElement>(".opportunity-item");

      /* Heading animation */
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

      /* Opportunity items */
      items.forEach((item) => {
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
      <Container className="relative z-10 py-14 md:py-18 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-24">
          {/* LEFT CONTENT */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-accent-400"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 sm:text-xs">
                Opportunity Areas
              </span>
            </div>

            <h2
              className="
                opportunity-heading
                max-w-md
                text-[32px]
                font-extrabold
                uppercase
                leading-[0.98]
                tracking-[-0.045em]
                text-white
                sm:text-[40px]
                lg:text-[48px]
              "
            >
              Explore the technologies shaping a smarter energy future.
            </h2>

            <div className="mt-7 h-px w-12 bg-accent-400" />
          </div>

          {/* RIGHT OPPORTUNITIES */}
          <div className="border-t border-white/15">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {opportunities.map((item, index) => (
                <div
                  key={item}
                  className="
                    opportunity-item
                    group
                    relative
                    flex
                    min-h-[78px]
                    items-center
                    gap-4
                    border-b
                    border-white/15
                    px-0
                    py-5
                    sm:min-h-[88px]
                    sm:px-5
                    sm:py-6
                    lg:px-6
                  "
                >
                  {/* Number */}
                  <span
                    className="
                      w-7
                      shrink-0
                      font-mono
                      text-[10px]
                      font-bold
                      tracking-[0.12em]
                      text-white/30
                      transition-colors
                      duration-300
                      group-hover:text-accent-400
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <span
                    className="
                      min-w-0
                      text-[14px]
                      font-bold
                      leading-5
                      text-white/75
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:text-white
                      sm:text-[15px]
                      sm:leading-6
                      lg:text-[16px]
                    "
                  >
                    {item}
                  </span>

                  {/* Hover line */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-0.5
                      w-0
                      bg-accent-400
                      transition-all
                      duration-500
                      ease-out
                      group-hover:w-full
                    "
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
