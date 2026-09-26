"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import EditorialHero from "@/src/components/ui/EditorialHero";
import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Breadcrumb from "@/src/components/ui/Breadcrumb";

const committeeMembers = [
  {
    number: "01",
    name: "Prof.Dr.Sundaram M",
    position: "Chairman",
  },
  {
    number: "02",
    name: "Shri.Bala Murugan.C",
    position: "Member",
  },
  {
    number: "03",
    name: "Shri.Rajesh.B",
    position: "Member",
  },
];

export default function GrievanceRedressal() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const reveals = section.querySelectorAll(".grievance-reveal");

      gsap.fromTo(
        reveals,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
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
    <div ref={sectionRef}>
      {/* --------------------------------
          HERO
      -------------------------------- */}
      <EditorialHero
        image="/images/committee-hero.webp"
        imageAlt="Students at STCET"
      >
        <Breadcrumb
          items={[
            {
              label: "Grievance Redressal Committee",
            },
          ]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Grievance Redressal <span className="text-accent-400">Committee</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-white/70">
          A fair and transparent mechanism for addressing legitimate student
          grievances.
        </p>
      </EditorialHero>

      {/* --------------------------------
          INTRODUCTION
      -------------------------------- */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="grievance-reveal">
              <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-500">
                Student Support
              </span>

              <SectionHeading as="h2">
                A Fair Way to <span className="text-accent-400">Be Heard</span>
              </SectionHeading>
            </div>

            <div className="grievance-reveal max-w-2xl">
              <p className="text-lg leading-8 text-gray-600">
                The Grievance Redressal Committee at STCET provides students
                with a fair and transparent mechanism to raise legitimate
                academic, administrative, or other institutional grievances.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                The Committee facilitates the timely consideration and
                resolution of grievances while upholding fairness,
                confidentiality, and the interests of students.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------
          COMMITTEE MEMBERS
      -------------------------------- */}
      <section className="bg-gray-50 py-14 lg:py-20">
        <Container>
          <div className="mb-12 max-w-2xl grievance-reveal">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-500">
              Committee Members
            </span>

            <SectionHeading as="h2">
              Grievance Redressal{" "}
              <span className="text-accent-400">Committee Members</span>
            </SectionHeading>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white md:block grievance-reveal">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="w-28 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Sl. No.
                  </th>

                  <th className="px-8 py-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>

                  <th className="w-56 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Position
                  </th>
                </tr>
              </thead>

              <tbody>
                {committeeMembers.map((member) => (
                  <tr
                    key={member.number}
                    className="border-t border-gray-200 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="px-8 py-7">
                      <span className="text-sm font-semibold text-accent-500">
                        {member.number}
                      </span>
                    </td>

                    <td className="px-8 py-7">
                      <span className="text-lg font-medium text-primary-800">
                        {member.name}
                      </span>
                    </td>

                    <td className="px-8 py-7">
                      <span className="text-gray-600">{member.position}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {committeeMembers.map((member) => (
              <div
                key={member.number}
                className="grievance-reveal rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-semibold text-accent-500">
                    {member.number}
                  </span>

                  <span className="text-sm text-gray-500">
                    {member.position}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-primary-800">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------
          CLOSING
      -------------------------------- */}
      <section className="bg-primary-800 py-14 lg:py-20">
        <Container>
          <div className="max-w-3xl grievance-reveal">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-400">
              Student Support
            </span>

            <SectionHeading as="h2" className="text-white">
              Fairness. Confidentiality.{" "}
              <span className="text-accent-400">Student Support.</span>
            </SectionHeading>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              STCET is committed to providing students with a transparent
              mechanism to raise legitimate grievances and seek appropriate
              resolution.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
