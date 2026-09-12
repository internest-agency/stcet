"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function EEEOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".eee-overview-heading",
      ) as HTMLElement | null;

      const paragraphs = sectionRef.current?.querySelectorAll(
        ".eee-overview-content",
      );

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            split.lines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          gsap.fromTo(
            paragraphs,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              delay: 0.25,
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
    <section ref={sectionRef} className="bg-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Programme Overview
              </span>
            </div>

            <h2 className="eee-overview-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Engineering
              <br />
              Powering
              <br />
              Possibilities.
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="eee-overview-content text-lg font-medium leading-8 text-gray-700 sm:text-2xl sm:leading-9">
              The B.E. Electrical and Electronics Engineering programme at STCET
              provides students with a strong foundation in electrical systems,
              electronics, power technologies, control systems and automation.
            </p>

            <p className="eee-overview-content mt-8 border-t border-gray-200 pt-8 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The programme combines fundamental engineering principles with
              contemporary applications, preparing students to understand and
              develop systems that generate, transmit, control and efficiently
              use electrical energy.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
