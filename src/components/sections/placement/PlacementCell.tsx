"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const focusAreas = [
  {
    title: "Industry Awareness",
    description:
      "Helping students understand industry expectations, workplace trends and emerging career opportunities.",
  },
  {
    title: "Employability Training",
    description:
      "Developing the skills and confidence students need to approach professional opportunities.",
  },
  {
    title: "Skill Development",
    description:
      "Strengthening technical, analytical, communication and professional skills.",
  },
  {
    title: "Industry Interaction",
    description:
      "Creating opportunities for students to engage with recruiters, professionals and industry experts.",
  },
];

export default function PlacementCell() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const reveals = Array.from(
        section.querySelectorAll<HTMLElement>(".placement-reveal"),
      );

      const focusItems = Array.from(
        section.querySelectorAll<HTMLElement>(".focus-item"),
      );

      gsap.set(reveals, {
        opacity: 0,
        y: 35,
      });

      gsap.set(focusItems, {
        opacity: 0,
        y: 30,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      timeline.to(
        reveals,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power4.out",
        },
        0,
      );

      timeline.to(
        focusItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power4.out",
        },
        0.3,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white py-14 sm:py-18 lg:py-20"
    >
      <Container>
        {/* Introduction */}
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Label */}
          <div className="placement-reveal">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                02 — Placement Cell
              </span>

              <span className="h-px w-10 bg-primary-800/15" />
            </div>
          </div>

          {/* Content */}
          <div>
            <SectionHeading as="h2" className="placement-reveal max-w-4xl">
              Building a Strong Foundation for Career Development
            </SectionHeading>

            <p className="placement-reveal mt-7 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
              The Placement Cell at S. Thangapazham College of Engineering and
              Technology works towards preparing students for the transition
              from college to the professional world.
            </p>

            <p className="placement-reveal mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              As a new institution, our focus is on building a strong foundation
              for career development through industry awareness, employability
              training, skill development and meaningful interactions with
              recruiters and professionals.
            </p>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="border-t border-primary-800/10 mt-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className="focus-item group border-b border-primary-800/10 py-8 sm:px-7 sm:py-10 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <SectionHeading as="h3">{area.title}</SectionHeading>

                <p className="mt-4 leading-6 text-gray-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
