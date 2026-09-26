"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const informationPoints = [
  {
    number: "01",
    title: "Eligibility",
    description:
      "Eligibility criteria are governed by the respective authorities and may change from time to time.",
  },
  {
    number: "02",
    title: "Financial Support",
    description:
      "Scholarship availability and support amounts may change according to the applicable scheme guidelines.",
  },
  {
    number: "03",
    title: "Application Guidance",
    description:
      "Students should check the latest official guidelines and contact the STCET Scholarship / Student Affairs Office for current information and application guidance.",
  },
];

export default function ScholarshipImportantNote() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll(".important-note-reveal");

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-100">
      <Container>
        <div className="py-14 sm:py-18 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            {/* Left */}
            <div className="important-note-reveal">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                Important Information
              </p>

              <SectionHeading as="h2" className="mt-7 max-w-xl">
                Before <span className="text-accent-400">You Apply.</span>
              </SectionHeading>

              <p className="mt-7 max-w-md text-lg leading-8 text-gray-600">
                Scholarship rules, eligibility and financial support may change.
                Always verify the latest information before applying.
              </p>
            </div>

            {/* Right */}
            <div className="important-note-reveal">
              <div className="border-t border-gray-200">
                {informationPoints.map((item) => (
                  <div
                    key={item.number}
                    className="grid gap-5 border-b border-gray-200 py-7 sm:grid-cols-[48px_180px_1fr] sm:items-start sm:gap-6"
                  >
                    <span className="text-sm font-medium text-accent-400">
                      {item.number}
                    </span>

                    <h3 className="text-lg leading-normal! font-bold uppercase text-primary-800">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
