"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

const subjects = [
  {
    name: "Mathematics",
    marks: "100",
    width: "100%",
  },
  {
    name: "Physics",
    marks: "50",
    width: "50%",
  },
  {
    name: "Chemistry",
    marks: "50",
    width: "50%",
  },
];

export default function TNEACutoff() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cutoff-number",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".cutoff-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
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
      className="overflow-hidden bg-primary-800 py-16 text-white sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Cut Off Calculation
              </span>
            </div>

            <h2 className="text-[34px] font-bold leading-none tracking-[-0.035em] sm:text-[44px]">
              TNEA Cut Off
            </h2>

            <p className="mt-2 text-[18px] font-medium text-white/80">
              (Out of 200 Marks)
            </p>

            <div className="cutoff-number mt-8">
              <span className="block text-[100px] font-bold leading-[0.8] tracking-[-0.06em] sm:text-[130px]">
                200
              </span>

              <span className="mt-4 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                Maximum Marks
              </span>
            </div>
          </div>

          <div className="border-l border-white/15 pl-0 lg:pl-12">
            <div className="grid gap-8">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="mb-3 flex items-center justify-between gap-5">
                    <span className="text-[13px] font-medium text-white/80">
                      {subject.name}
                    </span>

                    <span className="font-mono text-[12px] font-bold">
                      {subject.marks}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden bg-white/10">
                    <div
                      className="cutoff-bar h-full origin-left bg-accent-400"
                      style={{ width: subject.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-[12px] leading-6 text-white/50">
              Physics and Chemistry marks are scaled to 50 each for the
              engineering cutoff calculation.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
