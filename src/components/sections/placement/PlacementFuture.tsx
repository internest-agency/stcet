"use client";

import { memo, useState } from "react";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const journeySteps = [
  {
    number: "01",
    title: "Discover Their Strengths",
    description:
      "Help students understand their interests, strengths and career aspirations.",
    keyword: "Discover",
  },
  {
    number: "02",
    title: "Build Relevant Skills",
    description:
      "Develop the technical, analytical, communication and professional skills required for the workplace.",
    keyword: "Develop",
  },
  {
    number: "03",
    title: "Gain Practical Exposure",
    description:
      "Connect learning with practical experiences through projects, internships, workshops and industry interactions.",
    keyword: "Experience",
  },
  {
    number: "04",
    title: "Develop Professional Confidence",
    description:
      "Prepare students to communicate effectively, participate in recruitment processes and approach professional opportunities with confidence.",
    keyword: "Confidence",
  },
  {
    number: "05",
    title: "Pursue the Right Career Opportunities",
    description:
      "Support students as they explore suitable career pathways and opportunities aligned with their skills and aspirations.",
    keyword: "Opportunity",
  },
];

/* -------------------------------------------------------
   STATIC SECTION INTRO

   This component never receives changing props.
   React.memo prevents it from rendering again when
   activeIndex changes.
------------------------------------------------------- */

const PlacementFutureIntro = memo(function PlacementFutureIntro() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.5fr_1.8fr] lg:gap-20">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          07 — Placement Future
        </span>
      </div>

      <div>
        <SectionHeading as="h2">
          From Learning to <span className="text-accent-400">Opportunity</span>
        </SectionHeading>

        <p className="mt-3 max-w-2xl text-gray-600">
          Career readiness is a progressive journey. Students build their
          capabilities step by step, connecting learning, practical exposure and
          professional development with their future career goals.
        </p>
      </div>
    </div>
  );
});

PlacementFutureIntro.displayName = "PlacementFutureIntro";

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */

export default function PlacementFuture() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStep = journeySteps[activeIndex];

  return (
    <section className="overflow-hidden bg-gray-50 py-14 sm:py-18 lg:py-20">
      <Container>
        {/* STATIC INTRO */}

        <PlacementFutureIntro />

        {/* CAREER JOURNEY */}

        <div className="mt-8 lg:mt-14 grid gap-10 lg:grid-cols-[0.45fr_1.55fr] lg:gap-16">
          {/* NAVIGATION */}

          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Career Journey
            </p>

            <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {journeySteps.map((step, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-current={isActive ? "step" : undefined}
                    className="group flex items-center gap-4 bg-transparent px-3 py-3 text-left lg:px-0 cursor-pointer"
                  >
                    <span
                      className={`
                        text-xs font-semibold transition-colors duration-200
                        ${
                          isActive
                            ? "text-accent-400"
                            : "text-gray-300 group-hover:text-accent-400"
                        }
                      `}
                    >
                      {step.number}
                    </span>

                    <span
                      className={`
                        text-sm font-medium transition-colors duration-200
                        ${
                          isActive
                            ? "text-primary-800"
                            : "text-gray-400 group-hover:text-primary-800"
                        }
                      `}
                    >
                      {step.keyword}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ACTIVE CONTENT */}

          <div className="bg-primary-800 px-7 py-6 sm:px-12 sm:py-10 lg:px-12 lg:py-10 xl:px-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
                {activeStep.keyword}
              </span>

              <div className="mt-10 max-w-3xl">
                <SectionHeading as="h3" className="text-white">
                  {activeStep.title}
                </SectionHeading>

                <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                  {activeStep.description}
                </p>
              </div>
            </div>

            <div className="mt-12">
              <span className="text-xs uppercase tracking-[0.15em] text-white/30">
                {activeStep.number} /{" "}
                {journeySteps[journeySteps.length - 1].number}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
