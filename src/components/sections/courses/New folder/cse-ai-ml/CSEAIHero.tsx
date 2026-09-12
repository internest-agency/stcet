"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";
import Breadcrumb from "../../../ui/Breadcrumb";

gsap.registerPlugin(SplitText);

export default function CSEAIHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const eyebrow = section.querySelector(".course-eyebrow");
      const heading = section.querySelector(".course-heading");
      const tagline = section.querySelector(".course-tagline");
      const programme = section.querySelector(".course-programme");

      if (!eyebrow || !heading || !tagline || !programme) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.fromTo(
        eyebrow,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
      )
        .fromTo(
          programme,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          0.1,
        )
        .fromTo(
          split.lines,
          {
            yPercent: 100,
          },
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          0.2,
        )
        .fromTo(
          tagline,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          0.55,
        );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-800 text-white"
    >
      {/* Decorative AI text */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-16 select-none text-[13rem] font-black leading-none tracking-[-0.1em] text-white/[0.035] sm:text-[19rem] lg:-top-24 lg:text-[29rem]"
      >
        AI
      </span>

      <Container className="relative z-10 pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32">
        <Breadcrumb
          items={[
            {
              label: "Courses",
              href: "/courses",
            },
            {
              label: "Computer Science and Engineering (AI/ML)",
            },
          ]}
          className="mb-14 [&_a]:text-white/60 [&_span]:text-white/80"
        />

        <div className="max-w-6xl">
          <div className="course-eyebrow mb-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent-400"
            />

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
              B.E. Programme
            </span>
          </div>

          <p className="course-programme mb-5 text-sm font-bold uppercase tracking-[0.16em] text-white/50 sm:text-base">
            Computer Science and Engineering
          </p>

          <h1 className="course-heading max-w-6xl text-4xl font-extrabold uppercase leading-[0.96] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Artificial Intelligence
            <br />
            &amp; Machine Learning
          </h1>

          <div className="course-tagline mt-10 flex items-center gap-4 sm:mt-12">
            <span
              aria-hidden="true"
              className="h-px w-14 bg-accent-400 sm:w-20"
            />

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 sm:text-base">
              Engineering Intelligence. Creating Possibilities.
            </span>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-full bg-accent-400"
      />
    </section>
  );
}
