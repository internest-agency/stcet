"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../../ui/Container";
import Breadcrumb from "../../../ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function EEEHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".eee-hero-heading",
      ) as HTMLElement | null;

      const text = sectionRef.current?.querySelector(
        ".eee-hero-text",
      ) as HTMLElement | null;

      const label = sectionRef.current?.querySelector(
        ".eee-hero-label",
      ) as HTMLElement | null;

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            label,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            split.lines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          gsap.fromTo(
            text,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.3,
              ease: "power3.out",
            },
          );
        },
      });

      return () => split.revert();
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-50">
      <Container className="py-10 sm:py-14 lg:py-16">
        <Breadcrumb
          items={[
            {
              label: "Courses",
              href: "/courses",
            },
            {
              label: "Electrical and Electronics Engineering",
            },
          ]}
          className="mb-14 sm:mb-16 lg:mb-20"
        />

        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="eee-hero-label flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                B.E. Electrical and Electronics Engineering
              </span>
            </div>
          </div>

          <div>
            <h1 className="eee-hero-heading max-w-5xl text-4xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-primary-700 sm:text-6xl lg:text-7xl">
              Powering Technology.
              <br />
              Enabling Tomorrow.
            </h1>

            <p className="eee-hero-text mt-8 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Electricity powers modern life—from homes and industries to
              transportation, communication and emerging digital infrastructure.
              Electrical and Electronics Engineering plays a central role in
              designing, controlling and managing the systems that make this
              possible.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
