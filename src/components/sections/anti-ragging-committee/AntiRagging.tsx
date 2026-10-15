"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import Breadcrumb from "../../ui/Breadcrumb";
import type { CommitteeMember } from "@/src/generated/prisma/client";

gsap.registerPlugin(ScrollTrigger);

export default function AntiRagging({ members }: { members: CommitteeMember[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const heroElements = section.querySelectorAll(".anti-ragging-reveal");

      const tableSections = section.querySelectorAll(".committee-section");

      gsap.fromTo(
        heroElements,
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
        },
      );

      if (tableSections.length) {
        gsap.fromTo(
          tableSections,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tableSections[0],
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const squadMembers = members.filter((member) => (member.role ?? "").toLowerCase().includes("squad"));
  const committeeMembers = members.filter((member) => !(member.role ?? "").toLowerCase().includes("squad"));

  return (
    <div ref={sectionRef}>
      {/* -------------------------------------------------
          HERO
      ------------------------------------------------- */}
      <section className="overflow-hidden bg-primary-800 text-white">
        <Container className="min-h-[620px] py-14 sm:py-18 lg:py-20">
          <div>
            <Breadcrumb
              items={[
                {
                  label: "Anti Ragging Committee",
                },
              ]}
              className="my-8"
            />
            <div>
              <SectionHeading
                as="h1"
                className="anti-ragging-reveal max-w-4xl text-white"
              >
                A Safe Campus.{" "}
                <span className="text-accent-400">A Respectful Community.</span>
              </SectionHeading>

              <p className="anti-ragging-reveal mt-8 max-w-3xl text-lg leading-8 text-white/70 sm:text-xl sm:leading-9">
                The Anti-Ragging Committee and Anti-Ragging Squad work together
                to prevent ragging and promote a positive campus culture.
              </p>

              <p className="anti-ragging-reveal mt-5 max-w-3xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                Through student awareness, supervision, preventive measures and
                prompt intervention, they help ensure that students can begin
                and continue their college life with confidence and dignity.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------
          COMMITTEE
      ------------------------------------------------- */}
      {committeeMembers.length ? (
        <section className="overflow-hidden bg-white">
          <Container>
            <div className="committee-section py-20 sm:py-24 lg:py-32">
              <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                    01 — Anti-Ragging Committee
                  </p>

                  <SectionHeading as="h2" className="mt-6 max-w-md">
                    Anti-Ragging{" "}
                    <span className="text-accent-400">Committee.</span>
                  </SectionHeading>
                </div>

                <CommitteeTable
                  title="Anti-Ragging Committee Members"
                  members={committeeMembers}
                />
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* -------------------------------------------------
          SQUAD
      ------------------------------------------------- */}
      {squadMembers.length ? (
        <section className="overflow-hidden bg-gray-50">
          <Container>
            <div className="committee-section py-20 sm:py-24 lg:py-32">
              <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                    02 — Anti-Ragging Squad
                  </p>

                  <SectionHeading as="h2" className="mt-6 max-w-md">
                    Anti-Ragging <span className="text-accent-400">Squad.</span>
                  </SectionHeading>
                </div>

                <CommitteeTable
                  title="Anti-Ragging Squad Members"
                  members={squadMembers}
                />
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* -------------------------------------------------
          CLOSING
      ------------------------------------------------- */}
      <section className="overflow-hidden bg-primary-800 text-white">
        <Container>
          <div className="py-20 sm:py-24 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                  Student Welfare
                </p>
              </div>

              <div>
                <SectionHeading className="text-white">
                  Respect. Dignity.{" "}
                  <span className="text-accent-400">Responsibility.</span>
                </SectionHeading>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                  A positive campus culture begins with a safe and respectful
                  environment for every student.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

interface CommitteeTableProps {
  title: string;
  members: CommitteeMember[];
}

function CommitteeTable({ title, members }: CommitteeTableProps) {
  return (
    <div className="overflow-hidden">
      {/* Table header */}
      <div className="hidden grid-cols-[70px_1fr_220px] border-y border-gray-200 py-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 sm:grid">
        <span>Sl. No.</span>
        <span>{title}</span>
        <span>Position</span>
      </div>

      {/* Mobile header */}
      <div className="border-y border-gray-200 py-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 sm:hidden">
        {title}
      </div>

      {/* Members */}
      <div>
        {members.map((member, index) => (
          <div
            key={member.id}
            className="grid gap-3 border-b border-gray-200 py-6 sm:grid-cols-[70px_1fr_220px] sm:items-center sm:gap-0"
          >
            <span className="text-sm font-medium text-accent-400">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <p className="text-base font-semibold text-primary-800 sm:text-lg">
                {member.memberName}
              </p>

              <p className="mt-2 text-sm text-gray-500 sm:hidden">
                {member.designation ?? "—"}
              </p>
            </div>

            <p className="hidden text-sm text-gray-500 sm:block">
              {member.designation ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
