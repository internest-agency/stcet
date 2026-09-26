"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function EngineeringLaboratories() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const elements = section.querySelectorAll(".lab-reveal");

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 35,
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
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-primary-800 py-14 sm:py-18 lg:py-20"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="lab-reveal mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                Engineering Laboratories
              </span>
            </div>

            <SectionHeading as="h2" className="lab-reveal text-white">
              Learn. Experiment. Build.
            </SectionHeading>

            <p className="lab-reveal mt-8 max-w-lg text-[14px] leading-6 text-white/55 sm:text-[15px] sm:leading-7">
              Engineering is best understood by connecting concepts with
              application. STCET&apos;s laboratories give students opportunities
              to experiment, observe and apply what they learn within their
              respective disciplines.
            </p>
          </div>

          <div className="lab-reveal relative aspect-[1.25/0.8] overflow-hidden">
            <Image
              src="/images/infrastructure/engineering-labs.webp"
              alt="Engineering laboratory"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute right-6 top-6 max-w-[100px]">
              <p className="text-[8px] font-bold uppercase leading-4 tracking-[0.18em] text-white/60">
                Practical
                <br />
                Learning
                <br />
                Real Impact
              </p>

              <div className="mt-3 h-px w-8 bg-accent-400" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
