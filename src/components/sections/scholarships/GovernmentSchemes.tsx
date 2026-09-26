"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const governmentSchemes = [
  {
    number: "01",
    title: "7.5% Government School Quota",
    description:
      "Students who have studied Classes 6 to 12 in Tamil Nadu Government Schools may be eligible for the 7.5% preferential reservation in engineering admissions, along with applicable tuition-fee waiver and financial support under the scheme.",
  },
  {
    number: "02",
    title: "First Graduate (FG) Scheme",
    description:
      "Students who are the first person in their family to pursue an engineering degree and meet the prescribed income and other eligibility conditions may be eligible for a tuition-fee concession under the First Generation Graduate scheme. The current family-income ceiling is ₹2.5 lakh per annum.",
  },
  {
    number: "03",
    title: "Pudhumai Penn",
    description:
      "Eligible female students who studied Classes 6–12 in Government schools may receive a ₹1,000 monthly financial assistance, subject to scheme guidelines.",
  },
  {
    number: "04",
    title: "Tamizh Pudhalvan",
    description:
      "Eligible male students who studied Classes 6–12 in Government or Government-aided schools in Tamil medium may receive a ₹1,000 monthly financial assistance, subject to scheme guidelines.",
  },
];

export default function GovernmentSchemes() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const label = section.querySelector(".government-label");
      const heading = section.querySelector(".government-heading");
      const intro = section.querySelector(".government-intro");
      const items = section.querySelectorAll(".government-scheme");

      gsap.fromTo(
        [label, heading, intro],
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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
    <section ref={sectionRef} className="overflow-hidden bg-gray-100">
      <Container>
        <div className="py-14 sm:py-18 lg:py-20">
          {/* Section heading */}
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div className="government-label">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                02 — Government of Tamil Nadu Support
              </p>
            </div>

            <div>
              <SectionHeading as="h2" className="government-heading max-w-4xl">
                Government <span className="text-accent-400">Schemes.</span>
              </SectionHeading>

              <p className="government-intro mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Supporting eligible students through admission preference and
                financial assistance.
              </p>
            </div>
          </div>

          {/* Schemes */}
          <div className="mt-14 grid border-t border-gray-200 lg:grid-cols-4 items-start">
            {governmentSchemes.map((scheme) => (
              <article
                key={scheme.number}
                className="government-scheme group relative flex min-h-[420px] flex-col border-b border-gray-200 py-8 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                {/* Number */}
                <div>
                  <span className="text-5xl font-bold leading-none tracking-[-0.04em] text-gray-200 transition-colors duration-500 group-hover:text-accent-400">
                    {scheme.number}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-16">
                  <SectionHeading as="h3">{scheme.title}</SectionHeading>
                  <p className="mt-5 max-w-[270px] text-gray-600">
                    {scheme.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
