"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import Breadcrumb from "../../ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ScholarshipsHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".scholarships-hero-heading",
      );

      if (!heading) return;

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
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power4.out",
            },
          );
        },
      });

      gsap.fromTo(
        ".scholarships-hero-copy",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.25,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".scholarships-hero-label",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-50">
      <Container className="py-16 sm:py-20 lg:py-28">
        <Breadcrumb
          items={[
            {
              label: "Scholarships & Fee Support",
            },
          ]}
          className="mb-14"
        />

        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="scholarships-hero-label">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
                Scholarships & Fee Support
              </span>
            </div>

            <div className="mt-8 hidden h-px w-20 bg-accent-400 lg:block" />
          </div>

          <div>
            <h1 className="scholarships-hero-heading max-w-4xl text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.045em] text-primary-700 sm:text-5xl lg:text-6xl xl:text-7xl">
              Supporting
              <br />
              Your Engineering
              <br />
              Journey.
            </h1>

            <div className="scholarships-hero-copy mt-8 max-w-3xl">
              <p className="text-lg leading-8 text-gray-600 sm:text-xl sm:leading-9">
                Students at STCET may be eligible for a range of{" "}
                <strong className="font-bold text-gray-800">
                  Government of Tamil Nadu, Government of India and AICTE
                  scholarship and fee-support schemes
                </strong>
                , subject to the applicable eligibility criteria.
              </p>
            </div>
          </div>
        </div>
      </Container>

      <div className="h-1 w-full bg-accent-400" />
    </section>
  );
}
