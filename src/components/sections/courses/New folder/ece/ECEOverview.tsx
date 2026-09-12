"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function ECEOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(".overview-heading");
      const content = section.querySelector(".overview-content");

      if (heading) {
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
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              },
            );
          },
        });
      }

      if (content) {
        ScrollTrigger.create({
          trigger: content,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              content,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );
          },
        });
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-white">
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                About the Programme
              </span>
            </div>

            <h2 className="overview-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
              Connecting electronics, communication and computing.
            </h2>
          </div>

          {/* Content */}
          <div className="overview-content max-w-3xl lg:pt-8">
            <p className="text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              From smartphones and communication networks to satellites,
              healthcare equipment, automobiles and intelligent devices,
              electronics and communication technologies are transforming the
              way the world connects and functions.
            </p>

            <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The{" "}
              <strong className="font-extrabold text-gray-900">
                B.E. Electronics and Communication Engineering
              </strong>{" "}
              programme at STCET combines electronics, communication, computing
              and signal technologies to prepare students for a broad range of
              technological applications.
            </p>

            <p className="mt-6 border-l-2 border-accent-400 pl-5 text-lg font-bold leading-8 text-primary-700 sm:text-xl sm:leading-9">
              Students develop an understanding of how electronic systems are
              designed, how information is processed and transmitted, and how
              hardware and software work together to create connected systems.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
