"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const scholarshipFigures = [
  {
    number: "01",
    scheme: "First Graduate",
    figure: "₹2.5 Lakh",
    detail: "Current family-income ceiling per year",
  },
  {
    number: "02",
    scheme: "Pudhumai Penn",
    figure: "₹1,000",
    detail: "Monthly financial assistance",
  },
  {
    number: "03",
    scheme: "Tamizh Pudhalvan",
    figure: "₹1,000",
    detail: "Monthly financial assistance",
  },
  {
    number: "04",
    scheme: "SC Post-Matric",
    figure: "₹2.5 Lakh",
    detail: "Parental/guardian income ceiling per year",
  },
  {
    number: "05",
    scheme: "AICTE Pragati",
    figure: "₹50,000",
    detail: "Annual scholarship support",
  },
  {
    number: "06",
    scheme: "AICTE Pragati",
    figure: "₹8 Lakh",
    detail: "Family-income ceiling per year",
  },
  {
    number: "07",
    scheme: "Minority Merit-cum-Means",
    figure: "₹2.5 Lakh",
    detail: "Parental/guardian income ceiling per year",
  },
];

export default function ScholarshipAtAGlance() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const heading = section.querySelector(".glance-heading");
      const intro = section.querySelector(".glance-intro");
      const items = section.querySelectorAll(".glance-item");

      gsap.fromTo(
        [heading, intro],
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

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
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
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container>
        <div className="py-14 sm:py-18 lg:py-20">
          {/* Header */}
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                06 — At a Glance
              </p>
            </div>

            <div>
              <SectionHeading as="h2" className="glance-heading max-w-4xl">
                Key Figures <span className="text-accent-400">to Know.</span>
              </SectionHeading>

              <p className="glance-intro mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                A quick reference to the key financial figures and income
                thresholds described in the scholarship schemes above.
              </p>
            </div>
          </div>

          {/* Figures */}
          <div className="mt-14 grid border-t border-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {scholarshipFigures.map((item) => (
              <div
                key={`${item.number}-${item.scheme}`}
                className="glance-item border-b border-gray-200 py-8 sm:px-7 sm:nth-[2n+1]:border-r lg:border-r lg:px-8 lg:nth-[2n+1]:border-r-0 lg:nth-[4n+1]:border-r lg:nth-[4n+2]:border-r lg:nth-[4n+3]:border-r"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                    {item.scheme}
                  </span>
                </div>

                <p className="mt-8 text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">
                  {item.figure}
                </p>

                <p className="mt-6 max-w-xs text-base leading-6 text-gray-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
