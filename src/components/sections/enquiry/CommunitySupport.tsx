"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import { RiUserCommunityLine } from "react-icons/ri";
import { SiSemanticscholar } from "react-icons/si";
import { AiOutlineGlobal } from "react-icons/ai";

gsap.registerPlugin(ScrollTrigger);

const supportSchemes = [
  {
    number: "01",
    icon: RiUserCommunityLine,
    title: "SC / ST Post-Matric Scholarship",
    eligibility: "Eligible students belonging to SC/ST communities.",
    support:
      "Tuition-fee and other financial support under applicable schemes.",
    income:
      "For the SC Post-Matric Scholarship, the parental/guardian income ceiling is ₹2.5 lakh per annum, subject to the applicable conditions.",
  },
  {
    number: "02",
    icon: SiSemanticscholar,
    title: "BC / MBC / DNC Scholarships",
    eligibility: "Eligible students from BC, MBC and DNC communities.",
    support:
      "Fee reimbursement and other financial assistance, subject to government norms.",
    income: "As per government norms and applicable income criteria.",
  },
  {
    number: "03",
    icon: AiOutlineGlobal,
    title: "Minority Merit-cum-Means Scholarships",
    eligibility:
      "Students belonging to the notified minority communities — Muslim, Christian, Sikh, Buddhist, Jain and Parsi. At least 50% marks in the previous final examination.",
    support:
      "Merit-cum-Means Scholarship support for professional and technical courses.",
    income:
      "Annual parental/guardian income of not more than ₹2.5 lakh, subject to the applicable guidelines.",
  },
];

export default function CommunitySupport() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const label = section.querySelector(".community-label");
      const heading = section.querySelector(".community-heading");
      const intro = section.querySelector(".community-intro");
      const cards = section.querySelectorAll(".community-card");

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
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 68%",
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
            <div className="community-label">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                03 — Community & Social Support
              </p>
            </div>

            <div>
              <SectionHeading as="h2" className="community-heading max-w-4xl">
                Scholarships for{" "}
                <span className="text-accent-400">Community Advancement.</span>
              </SectionHeading>

              <p className="community-intro mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Financial support for eligible students from reserved and
                minority communities.
              </p>
            </div>
          </div>

          {/* Support Areas */}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {supportSchemes.map((scheme) => {
              const Icon = scheme.icon;

              return (
                <article
                  key={scheme.number}
                  className="community-card bg-white p-7 sm:p-8 lg:p-9"
                >
                  {/* Top */}
                  <div className="text-4xl text-accent-400">
                    <Icon />
                  </div>

                  {/* Title */}
                  <SectionHeading as="h3" className="mt-4">
                    {scheme.title}
                  </SectionHeading>

                  {/* Details */}
                  <div className="mt-8">
                    <div className="border-t border-gray-200 py-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                        Eligibility
                      </p>

                      <p className="mt-3 text-gray-600">{scheme.eligibility}</p>
                    </div>

                    <div className="border-t border-gray-200 py-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                        Support
                      </p>

                      <p className="mt-3 text-gray-600">{scheme.support}</p>
                    </div>

                    <div className="border-t border-gray-200 pt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                        Income Requirement
                      </p>

                      <p className="mt-3 text-gray-600">{scheme.income}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
