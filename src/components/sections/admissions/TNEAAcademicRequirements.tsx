"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

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

const eligibility = [
  ["General (OC)", "45%"],
  ["BC / BCM", "40%"],
  ["MBC & DNC", "40%"],
  ["SC / SCA / ST", "40%"],
];

export default function TNEAAcademicRequirements() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = Array.from(
        section.querySelectorAll<HTMLElement>(".academic-reveal"),
      );

      const cutoffBars = Array.from(
        section.querySelectorAll<HTMLElement>(".cutoff-bar"),
      );

      const tableRows = Array.from(
        section.querySelectorAll<HTMLElement>(".eligibility-row"),
      );

      const counter = section.querySelector<HTMLElement>(".cutoff-counter");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      /* --------------------------------
         Initial States
      -------------------------------- */

      gsap.set(elements, {
        opacity: 0,
        y: 30,
      });

      gsap.set(cutoffBars, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(tableRows, {
        opacity: 0,
        y: 12,
      });

      if (counter) {
        gsap.set(counter, {
          opacity: 1,
        });
      }

      /* --------------------------------
         Content Reveal
      -------------------------------- */

      timeline.to(
        elements,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power4.out",
        },
        0,
      );

      /* --------------------------------
         0 → 200 Counter
      -------------------------------- */

      if (counter) {
        const counterValue = {
          value: 0,
        };

        timeline.to(
          counterValue,
          {
            value: 200,
            duration: 1.8,
            ease: "power2.out",

            onUpdate: () => {
              counter.textContent = Math.round(counterValue.value).toString();
            },
          },
          0.35,
        );
      }

      /* --------------------------------
         Subject Bars
      -------------------------------- */

      timeline.to(
        cutoffBars,
        {
          scaleX: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        },
        0.55,
      );

      /* --------------------------------
         Eligibility Table
      -------------------------------- */

      timeline.to(
        tableRows,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power3.out",
        },
        0.75,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-gray-100 py-14 sm:py-18 lg:py-20"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* =========================================
              TNEA CUTOFF
          ========================================= */}

          <div>
            {/* Section Heading */}
            <div className="mb-6">
              <div className="academic-reveal mb-5 flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900/60">
                  Academic Requirements
                </span>

                <span className="h-px w-10 bg-gray-900/20" />
              </div>

              <SectionHeading as="h2">
                Cut Off Calculation & Eligibility
              </SectionHeading>
            </div>

            {/* Cutoff Card */}
            <div className="bg-primary-800 p-7 text-white sm:p-9 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.5fr_1fr]">
                {/* Counter */}
                <div>
                  <div className="academic-reveal mb-5 flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400">
                      TNEA Cut Off
                    </span>
                  </div>

                  <div className="academic-reveal mt-8">
                    <span
                      className="cutoff-counter block text-[80px] font-semibold leading-none text-accent-400 sm:text-[90px]"
                      aria-label="200 maximum marks"
                    >
                      0
                    </span>

                    <span className="mt-5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                      Maximum Marks
                    </span>
                  </div>
                </div>

                {/* Subject Breakdown */}
                <div className="border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <div className="grid gap-7">
                    {subjects.map((subject) => (
                      <div key={subject.name} className="academic-reveal">
                        <div className="mb-3 flex items-center justify-between gap-5">
                          <span className="text-sm text-white/80">
                            {subject.name}
                          </span>

                          <span className="font-mono text-xs font-bold text-white">
                            {subject.marks}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden bg-white/10">
                          <div
                            className="cutoff-bar h-full bg-accent-400"
                            style={{
                              width: subject.width,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="academic-reveal mt-8 max-w-md text-[11px] leading-5 text-white/45">
                    Physics and Chemistry marks are scaled to 50 each for the
                    engineering cutoff calculation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              ACADEMIC ELIGIBILITY
          ========================================= */}

          <div className="overflow-hidden border border-primary-800/10 bg-white">
            <div className="p-7 sm:p-9">
              {/* Label */}
              <div className="academic-reveal mb-5 flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                  Academic Eligibility
                </span>

                <span className="h-px w-10 bg-primary-800/15" />
              </div>

              {/* Heading */}
              <SectionHeading as="h3">
                Minimum Mark Requirements (PCM Average)
              </SectionHeading>

              {/* Table */}
              <table className="mt-8 w-full border-collapse">
                <thead>
                  <tr className="bg-primary-800 text-white">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                      Category
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em]">
                      PCM Average
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {eligibility.map(([category, marks]) => (
                    <tr
                      key={category}
                      className="eligibility-row border-b border-primary-800/10"
                    >
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {category}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-bold text-primary-800">
                        {marks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Description */}
              <p className="academic-reveal mt-4 text-sm leading-6 text-gray-600">
                This applies to both TNEA through Counselling and Management
                Quota.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
