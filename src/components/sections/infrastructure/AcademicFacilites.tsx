"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    number: "01",
    title: "Spacious Classrooms",
    image: "/images/infrastructure/academic/classrooms.webp",
  },
  {
    number: "02",
    title: "Technology-Enabled Learning Spaces",
    image: "/images/infrastructure/academic/technology-learning.webp",
  },
  {
    number: "03",
    title: "Department Laboratories",
    image: "/images/infrastructure/academic/department-labs.webp",
  },
  {
    number: "04",
    title: "Seminar & Discussion Spaces",
    image: "/images/infrastructure/academic/seminar.webp",
  },
];

export default function AcademicFacilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const heading = section.querySelector(".academic-heading");
      const intro = section.querySelector(".academic-intro");
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>(".academic-card"),
      );

      gsap.fromTo(
        [heading, intro],
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50 py-14 sm:py-18 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-800/45">
                Academic Facilities
              </span>
            </div>

            <SectionHeading className="academic-heading" as="h2">
              Learning Spaces Built for Better Education
            </SectionHeading>

            <p className="academic-intro mt-6 max-w-xl text-gray-700">
              Our academic spaces provide a focused environment for teaching,
              interaction and academic engagement.
            </p>
          </div>

          <div className="lg:pb-1">
            <p className="mb-4 font-bold text-gray-800">Facilities include:</p>

            <ul className="space-y-3">
              {facilities.map((facility) => (
                <li key={facility.number} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-accent-400" />
                  {facility.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {facilities.map((facility) => (
            <article key={facility.number} className="academic-card group">
              <div className="relative aspect-[1.25/1] overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="pt-4">
                <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-accent-500">
                  {facility.number}
                </span>

                <h3 className="mt-2 text-[13px] font-bold leading-5 text-primary-800">
                  {facility.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
