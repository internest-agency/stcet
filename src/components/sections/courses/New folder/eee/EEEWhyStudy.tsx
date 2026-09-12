"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reasons = [
  "Strong foundation in electrical engineering",
  "Integration of electrical and electronic concepts",
  "Exposure to automation and emerging energy technologies",
  "Practical and application-oriented learning",
  "Diverse opportunities across core and emerging sectors",
];

export default function EEEWhyStudy() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".eee-why-heading",
      ) as HTMLElement | null;

      const items = sectionRef.current?.querySelectorAll(".eee-why-item");

      const closing = sectionRef.current?.querySelector(
        ".eee-why-closing",
      ) as HTMLElement | null;

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

          gsap.fromTo(
            closing,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.65,
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
                Why Study EEE at STCET?
              </span>
            </div>

            <h2 className="eee-why-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Learn.
              <br />
              Apply.
              <br />
              Grow.
            </h2>
          </div>

          <div>
            <div className="border-t border-gray-200">
              {reasons.map((reason, index) => (
                <div
                  key={reason}
                  className="eee-why-item group flex items-start gap-5 border-b border-gray-200 py-6"
                >
                  <span className="mt-1 text-xs font-bold text-accent-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="flex-1 text-base font-semibold leading-7 text-gray-700 transition-colors duration-300 group-hover:text-primary-700 sm:text-lg">
                    {reason}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-1 h-px w-0 shrink-0 bg-accent-400 transition-all duration-400 group-hover:w-8"
                  />
                </div>
              ))}
            </div>

            <div className="eee-why-closing relative mt-12 overflow-hidden bg-primary-700 px-7 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-14">
              <span
                aria-hidden="true"
                className="absolute bottom-[-4rem] right-[-1rem] select-none text-[10rem] font-black leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[14rem]"
              >
                EEE
              </span>

              <div className="relative z-10">
                <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  EEE at STCET
                </span>

                <p className="max-w-3xl text-xl font-extrabold leading-8 tracking-[-0.02em] text-white sm:text-2xl sm:leading-9 lg:text-3xl">
                  Understand power. Control systems. Build a more connected and
                  sustainable future.
                </p>
              </div>

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-full bg-accent-400"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
