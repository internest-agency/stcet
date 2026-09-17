"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";
import Breadcrumb from "../../ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function PlacementHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".placement-hero-heading",
      ) as HTMLElement | null;

      const eyebrow = sectionRef.current?.querySelector(
        ".placement-hero-eyebrow",
      ) as HTMLElement | null;

      const description = sectionRef.current?.querySelector(
        ".placement-hero-description",
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
            eyebrow,
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
            description,
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
      <Container className="pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        <Breadcrumb
          items={[{ label: "Placement & Training Cell" }]}
          className="mb-14 sm:mb-16 lg:mb-20"
        />

        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="placement-hero-eyebrow flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Placement & Training Cell
              </span>
            </div>
          </div>

          <div>
            <h1 className="placement-hero-heading max-w-5xl text-4xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-primary-700 sm:text-5xl lg:text-6xl">
              Preparing Students
              <br />
              for Careers.
              <br />
              Connecting Talent
              <br />
              with Opportunity.
            </h1>

            <p className="placement-hero-description mt-8 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The{" "}
              <strong>
                Placement Cell at S. Thangapazham College of Engineering and
                Technology
              </strong>{" "}
              works towards preparing students for the transition from college
              to the professional world.
            </p>

            <p className="placement-hero-description mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              As a new institution, our focus is on building a strong foundation
              for career development through{" "}
              <strong>
                industry awareness, employability training, skill development
                and meaningful interactions with recruiters and professionals
              </strong>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
