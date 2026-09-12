"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const schemes = [
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
    title: "Tamizh Pudhalvan Schemes",
    description:
      "Eligible male students who studied Classes 6–12 in Government or Government-aided schools in Tamil medium may receive a ₹1,000 monthly financial assistance, subject to scheme guidelines.",
  },
  {
    number: "05",
    title: "SC/ST Post-Matric Scholarship",
    description:
      "Eligible students belonging to SC/ST communities may receive tuition-fee and other financial support under applicable Post-Matric Scholarship schemes. For the SC Post-Matric Scholarship, the parental/guardian income ceiling is ₹2.5 lakh per annum, subject to the applicable conditions.",
  },
  {
    number: "06",
    title: "BC/MBC/DNC Scholarships",
    description:
      "Eligible students from BC, MBC and DNC communities may receive fee reimbursement and other financial assistance, subject to government norms and income criteria.",
  },
  {
    number: "07",
    title: "AICTE Pragati Scholarship",
    description:
      "Eligible girl students admitted to an AICTE-approved degree programme may be eligible for the Pragati Scholarship of ₹50,000 per year. Up to two girls per family may be eligible, with a family-income ceiling of ₹8 lakh per annum, subject to AICTE guidelines.",
  },
  {
    number: "08",
    title: "Minority Merit-cum-Means Scholarships",
    description:
      "Students belonging to the notified minority communities—Muslim, Christian, Sikh, Buddhist, Jain and Parsi—may be eligible for the Merit-cum-Means Scholarship for professional and technical courses. The scheme requires at least 50% marks in the previous final examination and annual parental/guardian income of not more than ₹2.5 lakh, subject to the applicable guidelines.",
  },
];

export default function ScholarshipSchemes() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".scholarship-card",
            {
              opacity: 0,
              y: 40,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
            },
          );
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50">
      <Container className="py-16 sm:py-20 lg:py-28">
        {/* Section Header */}
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          {/* Label */}
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Scholarship Schemes
              </span>
            </div>

            <div className="mt-6 hidden h-px w-16 bg-accent-400 lg:block" />
          </div>

          {/* Heading */}
          <div>
            <h2 className="max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Explore Available
              <br />
              Support Schemes.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
              A range of government and regulatory scholarship schemes may
              support eligible students throughout their engineering journey.
            </p>
          </div>
        </div>

        {/* Scholarship Grid */}
        <div className="grid border-t border-gray-200 md:grid-cols-2">
          {schemes.map((scheme) => (
            <article
              key={scheme.number}
              className="scholarship-card group relative overflow-hidden border-b border-gray-200 p-7 transition-colors duration-400 ease-out hover:bg-primary-700 sm:p-9 lg:p-10"
            >
              {/* Card Content */}
              <div className="relative z-10 grid gap-7 sm:grid-cols-[70px_1fr] sm:gap-8">
                {/* Number */}
                <div>
                  <span className="text-sm font-black tracking-[0.08em] text-accent-400">
                    {scheme.number}
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-4 hidden h-px w-8 bg-gray-300 transition-all duration-300 group-hover:w-12 group-hover:bg-accent-400 sm:block"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-extrabold leading-tight tracking-[-0.02em] text-primary-700 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                    {scheme.title}
                  </h3>

                  <p className="mt-5 text-base leading-7 text-gray-600 transition-colors duration-300 group-hover:text-white/70">
                    {scheme.description}
                  </p>
                </div>
              </div>

              {/* Hover Accent Line */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-accent-400 transition-all duration-500 ease-out group-hover:w-full"
              />

              {/* Background Number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -right-2 select-none text-[8rem] font-black leading-none tracking-[-0.08em] text-primary-700/[0.025] transition-colors duration-300 group-hover:text-white/[0.035] sm:text-[10rem]"
              >
                {scheme.number}
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
