"use client";

import Image from "next/image";
import { GraduationCap, Lightbulb, Settings2, Users } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const pillars = [
  {
    title: "Quality Technical Education",
    description: "Strong academic foundation with experienced faculty.",
    icon: GraduationCap,
  },
  {
    title: "Innovation",
    description: "Encouraging ideas, creativity and research.",
    icon: Lightbulb,
  },
  {
    title: "Industry-Oriented Learning",
    description: "Curriculum aligned with industry needs.",
    icon: Settings2,
  },
  {
    title: "Ethical Values",
    description: "Building responsible and value-driven engineers.",
    icon: Users,
  },
];

export default function WhySTCET() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-stcet-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".why-stcet-image",
        { opacity: 0, scale: 1.04 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-gray-100 py-14 sm:py-18 lg:py-20"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div className="why-stcet-content">
            <div className="mb-5 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                Why STCET
              </span>
            </div>

            <SectionHeading as="h2">Shape Your Future at STCET</SectionHeading>

            <p className="mt-5 max-w-2xl text-[14px] leading-6 text-gray-600 sm:text-[15px]">
              A learning environment that combines academic excellence,
              innovation, industry readiness and ethical values to shape
              future-ready engineers.
            </p>

            <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-primary-800">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[16px] leading-normal font-bold uppercase text-primary-800">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-gray-800">{pillar.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="why-stcet-image relative h-full overflow-hidden">
            <Image
              src="/images/admissions/why-stcet.webp"
              alt="STCET campus"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
