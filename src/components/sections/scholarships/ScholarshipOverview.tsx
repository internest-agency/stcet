"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    number: "7.5%",
    label: "Government School Quota",
  },
  {
    number: "₹2.5L",
    label: "FG / SC Income Ceiling",
  },
  {
    number: "₹1,000",
    label: "Monthly Assistance",
  },
  {
    number: "₹50K",
    label: "AICTE Pragati / Year",
  },
];

export default function ScholarshipOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".scholarship-highlight",
            {
              opacity: 0,
              y: 35,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            },
          );
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Financial Support
              </span>
            </div>

            <h2 className="mt-6 max-w-sm text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-primary-700 sm:text-4xl">
              Opportunities
              <br />
              That Support
              <br />
              Students.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl sm:leading-9">
              STCET students may have access to various scholarship and
              financial-support schemes offered by government and regulatory
              authorities. Eligibility, benefits and application requirements
              vary according to each scheme.
            </p>

            <div className="mt-12 grid border-y border-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item, index) => (
                <div
                  key={item.label}
                  className={`scholarship-highlight group relative overflow-hidden py-8 transition-colors duration-400 hover:bg-primary-700 sm:px-6 lg:px-7 ${
                    index !== 0
                      ? "border-t border-gray-200 sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-1 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
                  />

                  <span className="relative z-10 block text-3xl font-black tracking-[-0.04em] text-primary-700 transition-colors duration-300 group-hover:text-white sm:text-4xl">
                    {item.number}
                  </span>

                  <span className="relative z-10 mt-3 block text-xs font-bold uppercase leading-5 tracking-[0.12em] text-gray-500 transition-colors duration-300 group-hover:text-white/70">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
