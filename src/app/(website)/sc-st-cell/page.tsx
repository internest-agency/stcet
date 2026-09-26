"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EditorialHero from "@/src/components/ui/EditorialHero";
import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Breadcrumb from "@/src/components/ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger);

export default function SCSTCell() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const reveals = section.querySelectorAll(".scst-reveal");

      reveals.forEach((element) => {
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
              start: "top 88%",
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
      {/* --------------------------------
          HERO
      -------------------------------- */}
      <EditorialHero
        image="/images/committee-hero.webp"
        imageAlt="STCET campus"
      >
        <Breadcrumb
          items={[
            {
              label: "SC/ST Cell",
            },
          ]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          SC/ST <span className="text-accent-400">Cell</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-white/75">
          Promoting an inclusive, supportive and equitable academic environment
          for every student.
        </p>
      </EditorialHero>

      {/* --------------------------------
          INTRODUCTION
      -------------------------------- */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
            {/* Heading */}
            <div className="scst-reveal">
              <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-500">
                Student Support
              </span>

              <SectionHeading as="h2">
                Supporting{" "}
                <span className="text-accent-400">Equal Opportunities</span>
              </SectionHeading>
            </div>

            {/* Content */}
            <div className="scst-reveal max-w-2xl">
              <p className="text-lg leading-8 text-gray-600">
                The SC/ST Cell at STCET is committed to promoting an inclusive,
                supportive, and equitable academic environment for students
                belonging to Scheduled Caste (SC) and Scheduled Tribe (ST)
                communities.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                The Cell works to facilitate awareness of government
                scholarships, welfare schemes, educational opportunities, and
                institutional support, while addressing the academic and
                developmental needs of students and ensuring equal opportunities
                for their overall growth and success.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------
          SUPPORT AREAS
      -------------------------------- */}
      <section className="bg-gray-50 py-14 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="scst-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">01</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Scholarships
              </h3>

              <p className="mt-3 text-gray-600">
                Awareness of government scholarship opportunities and available
                financial support.
              </p>
            </div>

            <div className="scst-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">02</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Welfare Schemes
              </h3>

              <p className="mt-3 text-gray-600">
                Information about relevant welfare schemes and institutional
                support available to eligible students.
              </p>
            </div>

            <div className="scst-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">03</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Educational Opportunities
              </h3>

              <p className="mt-3 text-gray-600">
                Support in accessing educational opportunities that contribute
                to students' academic growth.
              </p>
            </div>

            <div className="scst-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">04</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Student Development
              </h3>

              <p className="mt-3 text-gray-600">
                Supporting the academic and developmental needs of students and
                promoting equal opportunities.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------
          CLOSING
      -------------------------------- */}
      <section className="bg-primary-800 py-14 lg:py-20">
        <Container>
          <div className="scst-reveal max-w-3xl">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-400">
              Our Commitment
            </span>

            <SectionHeading as="h2" className="text-white">
              Inclusive. Supportive.{" "}
              <span className="text-accent-400">Equitable.</span>
            </SectionHeading>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              STCET is committed to ensuring equal opportunities and supporting
              the overall academic and developmental growth of students.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
