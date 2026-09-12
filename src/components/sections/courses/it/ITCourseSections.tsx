"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

/* =========================================================
   DATA
========================================================= */

const learningAreas = [
  "Programming and computational thinking",
  "Data structures and algorithms",
  "Object-oriented programming",
  "Database management systems",
  "Operating systems",
  "Computer networks",
  "Software engineering",
  "Web and application development",
  "Cloud computing",
  "Cybersecurity",
  "Artificial intelligence and emerging technologies",
];

const opportunityAreas = [
  "Software Development",
  "Cloud Computing",
  "Cybersecurity",
  "Data Engineering",
  "Artificial Intelligence",
  "Web Technologies",
  "Mobile Applications",
  "DevOps",
  "Emerging Computing Technologies",
];

const careerPathways = [
  "Software Developer",
  "Full-Stack Developer",
  "Application Developer",
  "Cloud Engineer",
  "Systems Engineer",
  "Data Engineer",
  "Database Administrator",
  "Cybersecurity Professional",
  "DevOps Engineer",
  "Software Analyst",
];

const reasons = [
  "Strong foundation across core computing disciplines",
  "Emphasis on programming and problem-solving",
  "Exposure to contemporary technology areas",
  "Opportunities for practical and project-based learning",
  "Scope to build specialised skills according to individual interests",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function CSECourseSections() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(
          section.querySelectorAll(
            ".course-eyebrow, .course-heading, .course-intro, .course-reveal, .course-item, .career-item, .reason-item, .opportunity-item",
          ),
          {
            clearProps: "all",
          },
        );

        return;
      }

      /* =====================================================
         SPLIT HEADINGS
      ===================================================== */

      const headings = gsap.utils.toArray<HTMLElement>(".course-split-heading");

      headings.forEach((heading) => {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              split.lines,
              {
                yPercent: 105,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              },
            );
          },
        });
      });

      /* =====================================================
         GENERIC REVEALS
      ===================================================== */

      const revealGroups = [
        ".course-eyebrow",
        ".course-intro",
        ".course-reveal",
      ];

      revealGroups.forEach((selector) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
          ScrollTrigger.create({
            trigger: element,
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                element,
                {
                  opacity: 0,
                  y: 25,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.75,
                  ease: "power3.out",
                },
              );
            },
          });
        });
      });

      /* =====================================================
         LEARNING ITEMS
      ===================================================== */

      const learningItems = gsap.utils.toArray<HTMLElement>(".course-item");

      learningItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                x: -25,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.035,
                ease: "power3.out",
              },
            );
          },
        });
      });

      /* =====================================================
         OPPORTUNITY ITEMS
      ===================================================== */

      const opportunityItems =
        gsap.utils.toArray<HTMLElement>(".opportunity-item");

      opportunityItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                delay: index * 0.04,
                ease: "power3.out",
              },
            );
          },
        });
      });

      /* =====================================================
         CAREER ITEMS
      ===================================================== */

      const careerItems = gsap.utils.toArray<HTMLElement>(".career-item");

      careerItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.045,
                ease: "power3.out",
              },
            );
          },
        });
      });

      /* =====================================================
         REASONS
      ===================================================== */

      const reasonItems = gsap.utils.toArray<HTMLElement>(".reason-item");

      reasonItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                x: -20,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.65,
                delay: index * 0.07,
                ease: "power3.out",
              },
            );
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* =====================================================
          01 — COURSE HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-primary-800 text-white">
        {/* Decorative Number */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 -top-14 select-none text-[14rem] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[20rem] lg:-right-8 lg:-top-24 lg:text-[30rem]"
        >
          01
        </span>

        <Container className="relative z-10 py-24 sm:py-28 lg:py-36">
          <div className="max-w-5xl">
            <div className="course-eyebrow mb-7 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                Undergraduate Programme
              </span>
            </div>

            <h1 className="course-split-heading max-w-5xl text-4xl font-extrabold uppercase leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              B.E. Computer Science
              <br />
              and Engineering
            </h1>

            <div className="mt-10 flex items-center gap-4 sm:mt-12">
              <span
                aria-hidden="true"
                className="h-px w-14 bg-accent-400 sm:w-20"
              />

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 sm:text-base">
                Think. Build. Transform.
              </p>
            </div>
          </div>
        </Container>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1 w-full bg-accent-400"
        />
      </section>

      {/* =====================================================
          02 — PROGRAMME OVERVIEW
      ===================================================== */}
      <section className="overflow-hidden bg-white">
        <Container className="py-20 sm:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 xl:gap-28">
            {/* Label */}
            <div>
              <div className="course-eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                  About the Programme
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="course-split-heading max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
                Computing is at the heart of the digital world.
              </h2>

              <div className="course-intro mt-8 max-w-3xl space-y-6 text-base leading-7 text-gray-600 sm:mt-10 sm:text-lg sm:leading-8">
                <p>
                  Computer Science is at the heart of today&apos;s digital
                  world. Software, cloud platforms, mobile applications,
                  cybersecurity, artificial intelligence and digital services
                  all depend on computing technologies.
                </p>

                <p>
                  The{" "}
                  <strong className="font-extrabold text-gray-900">
                    B.E. Computer Science and Engineering
                  </strong>{" "}
                  programme at STCET provides students with a strong foundation
                  in computing, programming and software development while
                  developing the analytical and problem-solving abilities
                  required to address real-world challenges.
                </p>

                <p>
                  The programme is designed to help students understand not only{" "}
                  <strong className="font-extrabold text-primary-700">
                    how technology works, but how it can be used to create
                    solutions
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          03 — WHAT YOU WILL LEARN
      ===================================================== */}
      <section className="overflow-hidden bg-gray-50">
        <Container className="py-20 sm:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
            {/* Intro */}
            <div>
              <div className="course-eyebrow mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                  What You Will Learn
                </span>
              </div>

              <h2 className="course-split-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
                Build the skills behind modern computing.
              </h2>

              <p className="course-intro mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Students develop knowledge across key areas of computer science,
                including:
              </p>
            </div>

            {/* Learning List */}
            <div className="border-t border-gray-200">
              {learningAreas.map((item, index) => (
                <div
                  key={item}
                  className="course-item group relative flex items-center gap-5 border-b border-gray-200 py-5 sm:gap-7 sm:py-6"
                >
                  <span className="w-8 shrink-0 text-xs font-black tracking-[0.15em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700 sm:w-10">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="h-px w-6 shrink-0 bg-accent-400 transition-all duration-300 group-hover:w-10" />

                  <span className="text-base font-bold tracking-[-0.01em] text-gray-800 transition-transform duration-300 group-hover:translate-x-1 sm:text-lg">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          04 — OPPORTUNITY AREAS
      ===================================================== */}
      <section className="overflow-hidden bg-primary-800 text-white">
        <Container className="py-20 sm:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 xl:gap-28">
            {/* Heading */}
            <div>
              <div className="course-eyebrow mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                  Opportunity Areas
                </span>
              </div>

              <h2 className="course-split-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                Explore where computing can take you.
              </h2>
            </div>

            {/* Areas */}
            <div className="flex flex-wrap content-start gap-3">
              {opportunityAreas.map((item, index) => (
                <div
                  key={item}
                  className="opportunity-item group inline-flex items-center gap-3 border border-white/15 px-4 py-3 transition-all duration-300 hover:border-accent-400 hover:bg-accent-400 sm:px-5 sm:py-4"
                >
                  <span className="text-[10px] font-black tracking-[0.15em] text-white/30 transition-colors duration-300 group-hover:text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm font-bold text-white/85 transition-colors duration-300 group-hover:text-white sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          05 — CAREER PATHWAYS
      ===================================================== */}
      <section className="overflow-hidden bg-white">
        <Container className="py-20 sm:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
            {/* Heading */}
            <div>
              <div className="course-eyebrow mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                  Career Pathways
                </span>
              </div>

              <h2 className="course-split-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
                Turn computing knowledge into possibilities.
              </h2>

              <p className="course-intro mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Computer Science graduates can pursue careers across software,
                technology and digital businesses.
              </p>
            </div>

            {/* Careers */}
            <div>
              <div className="border-t border-gray-200">
                {careerPathways.map((career, index) => (
                  <div
                    key={career}
                    className="career-item group relative grid grid-cols-[52px_1fr] items-center gap-4 border-b border-gray-200 py-6 sm:grid-cols-[70px_1fr] sm:py-7"
                  >
                    <span className="text-xs font-black tracking-[0.18em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-xl font-extrabold tracking-[-0.025em] text-gray-900 transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl lg:text-3xl">
                        {career}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full bg-accent-400 transition-transform duration-300 group-hover:scale-150"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="course-reveal mt-8 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
                The degree also provides a foundation for postgraduate
                education, research and specialised technology certifications.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          06 — WHY STUDY CSE AT STCET
      ===================================================== */}
      <section className="overflow-hidden bg-gray-50">
        <Container className="py-20 sm:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
            {/* Heading */}
            <div>
              <div className="course-eyebrow mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                  Why Study CSE at STCET
                </span>
              </div>

              <h2 className="course-split-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
                A foundation designed for the evolving digital world.
              </h2>
            </div>

            {/* Reasons */}
            <div className="border-t border-gray-200">
              {reasons.map((reason, index) => (
                <div
                  key={reason}
                  className="reason-item group relative grid gap-4 border-b border-gray-200 py-7 sm:grid-cols-[72px_1fr] sm:items-center sm:gap-8 sm:py-8"
                >
                  <span className="text-sm font-black tracking-[0.18em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-lg font-extrabold leading-7 tracking-[-0.015em] text-gray-900 transition-transform duration-300 group-hover:translate-x-1 sm:text-xl sm:leading-8">
                      {reason}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400 transition-transform duration-300 group-hover:scale-150"
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          07 — CLOSING STATEMENT
      ===================================================== */}
      <section className="relative overflow-hidden bg-primary-700 text-white">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-12 select-none text-[12rem] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[18rem] lg:text-[25rem]"
        >
          CSE
        </span>

        <Container className="relative z-10 py-20 sm:py-24 lg:py-32">
          <div className="max-w-5xl">
            <div className="course-eyebrow mb-7 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                Build Your Future
              </span>
            </div>

            <h2 className="course-split-heading max-w-5xl text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Build your foundation in computing.
              <br />
              Create solutions for the digital world.
            </h2>

            <div className="mt-10 flex items-center gap-4 sm:mt-12">
              <span
                aria-hidden="true"
                className="h-1 w-12 bg-accent-400 sm:w-16"
              />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                B.E. Computer Science and Engineering
              </span>
            </div>
          </div>
        </Container>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1 w-full bg-accent-400"
        />
      </section>
    </div>
  );
}
