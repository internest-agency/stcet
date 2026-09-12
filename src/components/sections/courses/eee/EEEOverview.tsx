"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function EEEOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = section.querySelector<HTMLElement>(".overview-heading");
      const content = section.querySelector<HTMLElement>(".overview-content");

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        if (reducedMotion) {
          gsap.set(split.lines, { clearProps: "all" });
        } else {
          gsap.set(split.lines, { yPercent: 105 });

          ScrollTrigger.create({
            trigger: heading,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(split.lines, {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              });
            },
          });
        }
      }

      if (content && !reducedMotion) {
        gsap.fromTo(
          content,
          {
            y: 20,
          },
          {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: content,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container>
        <div className="py-14 sm:py-18 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:gap-24">
            {/* Heading */}
            <div>
              <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400 sm:h-2 sm:w-2"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700">
                  About the Programme
                </span>
              </div>

              <h2
                className="
                  overview-heading
                  max-w-2xl
                  text-[32px]
                  font-extrabold
                  uppercase
                  leading-[0.98]
                  tracking-[-0.045em]
                  text-primary-700
                  sm:text-[40px]
                  lg:text-[48px]
                "
              >
                Powering Technology. Enabling Tomorrow.
              </h2>
            </div>

            {/* Content */}
            <div className="overview-content">
              <p className="text-[14px] leading-6 text-gray-500 sm:text-[15px] sm:leading-7 lg:text-[17px] lg:leading-8">
                Electricity powers modern life—from homes and industries to
                transportation, communication and emerging digital
                infrastructure. Electrical and Electronics Engineering plays a
                central role in designing, controlling and managing the systems
                that make this possible.
              </p>

              <p className="mt-5 text-[14px] leading-6 text-gray-500 sm:mt-6 sm:text-[15px] sm:leading-7 lg:text-[17px] lg:leading-8">
                The{" "}
                <strong className="font-extrabold text-primary-700">
                  B.E. Electrical and Electronics Engineering
                </strong>{" "}
                programme at STCET provides students with a strong foundation in
                electrical systems, electronics, power technologies, control
                systems and automation.
              </p>

              <p className="mt-5 text-[14px] leading-6 text-gray-500 sm:mt-6 sm:text-[15px] sm:leading-7 lg:text-[17px] lg:leading-8">
                The programme combines fundamental engineering principles with
                contemporary applications, preparing students to understand and
                develop systems that generate, transmit, control and efficiently
                use electrical energy.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
