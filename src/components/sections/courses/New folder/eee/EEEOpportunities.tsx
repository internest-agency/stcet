"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

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
      const heading = sectionRef.current?.querySelector(
        ".eee-opportunities-heading",
      ) as HTMLElement | null;

      const items = sectionRef.current?.querySelectorAll(
        ".eee-opportunity-item",
      );

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            split.lines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          gsap.fromTo(
            items,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.07,
              delay: 0.25,
              ease: "power3.out",
            },
          );
        },
      });

      return () => split.revert();
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Opportunity Areas
              </span>
            </div>

            <h2 className="eee-opportunities-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Explore
              <br />
              Emerging
              <br />
              Technologies.
            </h2>
          </div>

          <div>
            <p className="mb-8 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The discipline is evolving rapidly with the transition towards
              cleaner energy and intelligent electrical systems.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((item, index) => (
                <div
                  key={item}
                  className="eee-opportunity-item group relative min-h-28 overflow-hidden border border-gray-200 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-700 hover:bg-primary-700"
                >
                  <span className="block text-[10px] font-bold tracking-[0.18em] text-gray-400 transition-colors group-hover:text-white/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-8 block text-sm font-bold leading-5 text-primary-700 transition-colors group-hover:text-white sm:text-base">
                    {item}
                  </span>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-1 w-0 bg-accent-400 transition-all duration-400 group-hover:w-full"
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
