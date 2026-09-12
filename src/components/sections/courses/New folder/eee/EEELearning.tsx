"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const learningAreas = [
  "Electrical circuits and systems",
  "Electrical machines",
  "Power systems",
  "Power electronics",
  "Control systems",
  "Measurements and instrumentation",
  "Digital electronics",
  "Microcontrollers",
  "Electrical drives",
  "Renewable energy systems",
  "Automation and industrial control",
];

export default function EEELearning() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".eee-learning-heading",
      ) as HTMLElement | null;

      const items = sectionRef.current?.querySelectorAll(".eee-learning-item");

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
              stagger: 0.06,
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
    <section ref={sectionRef} className="bg-gray-50">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                What You Will Learn
              </span>
            </div>

            <h2 className="eee-learning-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Build
              <br />
              Strong
              <br />
              Foundations.
            </h2>
          </div>

          <div>
            <p className="mb-8 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Students develop knowledge in areas such as:
            </p>

            <div className="border-t border-gray-200">
              {learningAreas.map((item, index) => (
                <div
                  key={item}
                  className="eee-learning-item group flex items-center gap-4 border-b border-gray-200 py-5 sm:py-6"
                >
                  <span className="w-8 shrink-0 text-xs font-bold text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-primary-700 sm:text-lg">
                    {item}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-accent-400 transition-all duration-400 group-hover:w-8"
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
