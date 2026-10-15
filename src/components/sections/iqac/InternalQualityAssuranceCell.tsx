"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EditorialHero from "@/src/components/ui/EditorialHero";
import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Breadcrumb from "@/src/components/ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger);

export default function InternalQualityAssuranceCell() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const reveals = section.querySelectorAll(".iqac-reveal");

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
      {/* =====================================================
          HERO
      ===================================================== */}
      <EditorialHero
        image="/images/iqac/hero.webp"
        imageAlt="STCET academic and institutional environment"
      >
        <Breadcrumb
          items={[
            {
              label: "Internal Quality Assurance Cell",
            },
          ]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Internal Quality{" "}
          <span className="text-accent-400">Assurance Cell</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-white/75">
          Promoting a continuous culture of quality enhancement across academic
          and administrative activities.
        </p>
      </EditorialHero>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
            {/* Heading */}
            <div className="iqac-reveal">
              <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-500">
                Quality Enhancement
              </span>

              <SectionHeading as="h2">
                Building a Culture of{" "}
                <span className="text-accent-400">Continuous Improvement</span>
              </SectionHeading>
            </div>

            {/* Content */}
            <div className="iqac-reveal max-w-2xl">
              <p className="text-lg leading-8 text-gray-600">
                The Internal Quality Assurance Cell (IQAC) at STCET is
                established to promote a continuous culture of quality
                enhancement across all academic and administrative activities.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                The IQAC works towards strengthening teaching-learning
                processes, encouraging innovation and best practices, supporting
                faculty and student development, and fostering a systematic
                approach to institutional improvement.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Through regular quality initiatives, documentation, feedback,
                and review, the IQAC strives to enhance the overall academic and
                institutional performance of STCET.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          QUALITY AREAS
      ===================================================== */}
      <section className="bg-gray-50 py-14 lg:py-20">
        <Container>
          <div className="mb-12 max-w-2xl iqac-reveal">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-500">
              Areas of Focus
            </span>

            <SectionHeading as="h2">
              Strengthening{" "}
              <span className="text-accent-400">Institutional Quality</span>
            </SectionHeading>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Teaching & Learning */}
            <div className="iqac-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">01</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Teaching & Learning
              </h3>

              <p className="mt-3 text-gray-600">
                Strengthening teaching-learning processes across the
                institution.
              </p>
            </div>

            {/* Innovation & Best Practices */}
            <div className="iqac-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">02</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Innovation & Best Practices
              </h3>

              <p className="mt-3 text-gray-600">
                Encouraging innovation and the adoption of effective
                institutional practices.
              </p>
            </div>

            {/* Faculty & Student Development */}
            <div className="iqac-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">03</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Faculty & Student Development
              </h3>

              <p className="mt-3 text-gray-600">
                Supporting the academic and developmental growth of faculty and
                students.
              </p>
            </div>

            {/* Review & Improvement */}
            <div className="iqac-reveal rounded-2xl bg-white p-7">
              <span className="text-sm font-semibold text-accent-500">04</span>

              <h3 className="mt-6 text-xl font-semibold text-primary-800">
                Review & Improvement
              </h3>

              <p className="mt-3 text-gray-600">
                Using documentation, feedback and review to support systematic
                institutional improvement.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          CLOSING
      ===================================================== */}
      <section className="bg-primary-800 py-14 lg:py-20">
        <Container>
          <div className="iqac-reveal max-w-3xl">
            <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.15em] text-accent-400">
              Institutional Improvement
            </span>

            <SectionHeading as="h2" className="text-white">
              Quality. Innovation.{" "}
              <span className="text-accent-400">Continuous Improvement.</span>
            </SectionHeading>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Through regular quality initiatives, documentation, feedback and
              review, the IQAC strives to enhance the overall academic and
              institutional performance of STCET.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
