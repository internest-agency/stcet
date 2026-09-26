"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    value: "₹50,000",
    label: "Annual Support",
  },
  {
    value: "2",
    label: "Girls per Family",
  },
  {
    value: "₹8 Lakh",
    label: "Family Income Ceiling",
  },
];

export default function AICTEPragati() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll(".pragati-reveal");
      const figures = section.querySelectorAll(".pragati-figure");

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        figures,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-primary-800 text-white"
    >
      <Container>
        <div className="py-14 sm:py-18 lg:py-20">
          {/* Header */}
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div className="pragati-reveal">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                AICTE Scholarship
              </p>
            </div>

            <div>
              <SectionHeading
                as="h2"
                className="pragati-reveal max-w-4xl text-white"
              >
                AICTE{" "}
                <span className="text-accent-400">Pragati Scholarship.</span>
              </SectionHeading>

              <p className="pragati-reveal mt-4 max-w-3xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Eligible girl students enrolled in an AICTE-approved degree
                programme may be eligible for financial support under the
                Pragati Scholarship scheme, subject to AICTE guidelines.
              </p>
            </div>
          </div>

          {/* Figures */}
          <div className="mt-8 grid border-t border-white/15 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="pragati-figure border-b border-white/15 py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                <p className="text-4xl font-bold tracking-tight text-accent-400 sm:text-5xl lg:text-6xl">
                  {item.value}
                </p>

                <p className="mt-3 text-sm uppercase tracking-[0.14em] text-white/55">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Eligibility */}
          <div className="grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div className="pragati-reveal">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Eligibility
              </p>
            </div>

            <div className="pragati-reveal max-w-3xl">
              <p className="text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                The scheme may be available to eligible girl students studying
                in AICTE-approved degree programmes. Up to two girls per family
                may be eligible, with a family income ceiling of ₹8 lakh per
                annum, subject to the applicable AICTE guidelines.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
