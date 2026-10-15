"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FaQuoteRight } from "react-icons/fa";
import {
  FaGraduationCap,
  FaLightbulb,
  FaAward,
  FaHeart,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

const trustPillars = [
  {
    number: "01",
    title: "Quality",
    description:
      "We are committed to maintaining high standards and creating meaningful learning experiences that contribute to the academic and personal development of students.",
    icon: FaGraduationCap,
    tag: "Learning Standards",
  },
  {
    number: "02",
    title: "Opportunity",
    description:
      "We believe in expanding access to quality higher education, enabling students to pursue their aspirations, build confidence and realise their potential.",
    icon: FaLightbulb,
    tag: "Access & Growth",
  },
  {
    number: "03",
    title: "Excellence",
    description:
      "We continually strive to learn, improve and raise our standards across our educational initiatives, creating an environment that encourages continuous growth.",
    icon: FaAward,
    tag: "Continuous Progress",
  },
  {
    number: "04",
    title: "Values",
    description:
      "We aim to nurture responsible, disciplined and confident individuals who uphold strong values and contribute positively to their professions and society.",
    icon: FaHeart,
    tag: "Character & Purpose",
  },
];

export default function OurTrust() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const eyebrow = section.querySelector(".trust-eyebrow");
      const heading = section.querySelector(".trust-heading");
      const intro = section.querySelector(".trust-intro");
      const cards = gsap.utils.toArray<HTMLElement>(".trust-pillar");
      const statement = section.querySelector(".institution-statement");

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      if (eyebrow) {
        gsap.from(eyebrow, {
          y: 15,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: eyebrow,
            start: "top 90%",
            once: true,
          },
        });
      }

      let split: ReturnType<typeof SplitText.create> | undefined;

      if (heading) {
        split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        gsap.from(split.lines, {
          yPercent: 100,
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            once: true,
          },
        });
      }

      if (intro) {
        gsap.from(intro, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: intro,
            start: "top 90%",
            once: true,
          },
        });
      }

      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cards[0],
          start: "top 85%",
          once: true,
        },
      });

      if (statement) {
        gsap.from(statement, {
          y: 25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statement,
            start: "top 88%",
            once: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
      aria-labelledby="trust-heading"
    >
      <Container>
        {/* INTRO */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <div className="trust-eyebrow mb-6 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary-700">
                Our Trust
              </span>
            </div>

            <SectionHeading as="h2">
              Four pillars.
              <br />
              <span className="text-accent-400">One purpose.</span>
            </SectionHeading>
          </div>

          <div className="trust-intro lg:border-l lg:border-primary-900/15 lg:pb-1 lg:pl-8">
            <p className="max-w-2xl text-base leading-8 text-gray-600 sm:text-lg sm:leading-9">
              The Trust oversees four educational institutions across the
              southern districts of Tamil Nadu. Our approach is guided by a
              commitment to quality, opportunity, excellence and values.
            </p>
          </div>
        </div>

        {/* PILLAR CARDS */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.number}
                className="trust-pillar group relative isolate flex min-h-[310px] flex-col overflow-hidden border border-primary-900/10 bg-[#F7F8FA] p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-primary-900/[0.07] sm:min-h-[330px] sm:p-8 lg:p-10"
              >
                {/* Card header */}
                <div className="flex h-12 w-12 items-center justify-center rounded border border-primary-900/10 bg-white text-xl text-primary-700 transition-all duration-300 group-hover:border-accent-400/40 group-hover:bg-accent-400 group-hover:text-white">
                  <Icon aria-hidden="true" />
                </div>

                {/* Card content */}
                <div className="mt-9 flex-1">
                  <SectionHeading
                    as="h3"
                    customSize={true}
                    className="text-2xl"
                  >
                    {pillar.title}
                  </SectionHeading>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                    {pillar.description}
                  </p>
                </div>

                {/* Card footer */}
                <div className="mt-8 border-t uppercase text-gray-400 border-primary-900/10 pt-5">
                  {pillar.tag}
                </div>
              </article>
            );
          })}
        </div>

        {/* CLOSING STATEMENT */}
        <div className="institution-statement group relative mt-12 overflow-hidden rounded-2xl bg-primary-900 px-6 py-9 sm:mt-16 sm:px-10 sm:py-12 lg:mt-20 lg:px-14 lg:py-14">
          {/* Background graphic */}
          <FaQuoteRight
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-5 text-[140px] text-white/[0.04] sm:text-[200px] lg:text-[250px]"
          />

          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-1 bg-accent-400"
          />

          <div className="relative grid gap-7 lg:grid-cols-[190px_1fr] lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                  STCET
                </span>
              </div>

              <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                Our Approach
              </span>
            </div>

            <div>
              <p className="max-w-4xl text-xl font-semibold leading-8 tracking-tight text-white sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10">
                Our institution is committed to creating a learning environment
                where students can develop the knowledge, skills and confidence
                required to navigate an evolving engineering landscape and build
                meaningful futures.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="h-[2px] w-10 bg-accent-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Learn · Innovate · Grow
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
