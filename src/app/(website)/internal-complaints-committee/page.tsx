"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EditorialHero from "@/src/components/ui/EditorialHero";
import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Breadcrumb from "@/src/components/ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger);

const committeeMembers = [
  {
    id: "sundaram",
    number: "01",
    name: "Prof.Dr.Sundaram M",
    position: "Chairman",
  },
  {
    id: "kaliponraj",
    number: "02",
    name: "Sri.Kaliponraj N",
    position: "Senior Faculty",
  },
  {
    id: "sriram",
    number: "02",
    name: "Sri.Sriram A",
    position: "Deputy Warden",
    department: "Boys hostel",
  },
  {
    id: "selvakani",
    number: "03",
    name: "Mrs.Selvakani M",
    position: "Lady Faculty Member",
  },
];

export default function InternalComplaintsCommittee() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".icc-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* HERO */}
      <EditorialHero
        image="/images/committee-hero.webp"
        imageAlt="STCET campus and student support"
      >
        <Breadcrumb
          items={[
            {
              label: "Internal Complaints Committee",
            },
          ]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Internal Complaints <span className="text-accent-400">Committee</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-white/80">
          Promoting a safe, respectful and dignified environment for everyone at
          STCET.
        </p>
      </EditorialHero>

      {/* INTRODUCTION */}
      <section className="bg-white py-20 lg:py-28">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="icc-reveal">
              <span className="mb-5 block text-sm font-semibold uppercase tracking-wider text-accent-500">
                Safe & Respectful Campus
              </span>

              <SectionHeading as="h2">
                A Campus Built on{" "}
                <span className="text-accent-400">Respect and Dignity</span>
              </SectionHeading>
            </div>

            <div className="icc-reveal">
              <p className="text-gray-600">
                The Internal Complaints Committee at STCET works towards
                maintaining a safe, respectful, and dignified environment within
                the institution.
              </p>

              <p className="mt-6 text-gray-600">
                It provides a structured mechanism for addressing complaints of
                sexual harassment and promotes awareness, sensitivity and
                prevention in accordance with applicable statutory provisions
                and institutional policies.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* COMMITTEE MEMBERS */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <Container>
          <div className="icc-reveal mb-12 max-w-3xl">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-wider text-accent-500">
              Committee Members
            </span>

            <SectionHeading as="h2">
              Internal Complaints{" "}
              <span className="text-accent-400">Committee Members</span>
            </SectionHeading>
          </div>

          {/* Desktop Table */}
          <div className="icc-reveal hidden overflow-hidden rounded-2xl border border-gray-200 bg-white md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    scope="col"
                    className="w-28 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Sl. No.
                  </th>

                  <th
                    scope="col"
                    className="px-8 py-5 text-sm font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Name
                  </th>

                  <th
                    scope="col"
                    className="w-72 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Position
                  </th>
                </tr>
              </thead>

              <tbody>
                {committeeMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-gray-200 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="px-8 py-7 align-top">
                      <span className="font-semibold text-accent-500">
                        {member.number}
                      </span>
                    </td>

                    <td className="px-8 py-7 align-top">
                      <span className="font-medium text-primary-800">
                        {member.name}
                      </span>
                    </td>

                    <td className="px-8 py-7 align-top">
                      <span className="text-gray-600">{member.position}</span>

                      {member.department && (
                        <span className="mt-1 block text-sm text-gray-500">
                          {member.department}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {committeeMembers.map((member) => (
              <article
                key={member.id}
                className="icc-reveal rounded-2xl border border-gray-200 bg-white p-6"
              >
                <span className="text-sm font-semibold text-accent-500">
                  {member.number}
                </span>

                <h3 className="mt-4 font-semibold text-primary-800">
                  {member.name}
                </h3>

                <p className="mt-2 text-gray-600">{member.position}</p>

                {member.department && (
                  <p className="mt-1 text-sm text-gray-500">
                    {member.department}
                  </p>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* CLOSING */}
      <section className="bg-primary-800 py-20 lg:py-28">
        <Container>
          <div className="icc-reveal max-w-3xl">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-wider text-accent-400">
              Our Commitment
            </span>

            <SectionHeading as="h2" className="text-white">
              Respect. Awareness.{" "}
              <span className="text-accent-400">Prevention.</span>
            </SectionHeading>

            <p className="mt-7 max-w-2xl text-white/75">
              The Internal Complaints Committee promotes awareness, sensitivity
              and prevention while supporting a safe and dignified institutional
              environment.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
