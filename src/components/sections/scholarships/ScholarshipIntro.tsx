"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export default function ScholarshipIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const label = section.querySelector(".scholarship-intro-label");
      const heading = section.querySelector(".scholarship-intro-heading");
      const content = section.querySelector(".scholarship-intro-content");

      gsap.fromTo(
        label,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
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
    <section ref={sectionRef} className="overflow-hidden bg-white">
      <Container>
        <div className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:py-32">
          {/* Left */}
          <div className="scholarship-intro-label">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
              01 — About
            </p>
          </div>

          {/* Right */}
          <div className="scholarship-intro-content">
            <SectionHeading
              as="h2"
              className="scholarship-intro-heading max-w-3xl"
            >
              Supporting Your{" "}
              <span className="text-accent-400">Education.</span>
            </SectionHeading>

            <div className="mt-8 max-w-3xl space-y-6 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              <p>
                Students at STCET may be eligible for a range of Government of
                Tamil Nadu, Government of India and AICTE scholarship and
                fee-support schemes, subject to the applicable eligibility
                criteria.
              </p>

              <p>
                Explore the schemes below to understand the broad eligibility
                requirements and financial support available.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
