"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const missionItems = [
  {
    number: "01",
    text: "Provide quality technical education through innovative teaching, industry-relevant learning and strong academic foundations.",
  },
  {
    number: "02",
    text: "Promote research, innovation, entrepreneurship and lifelong learning among students and faculty.",
  },
  {
    number: "03",
    text: "Foster ethical values, leadership, professional responsibility and a commitment to excellence.",
  },
  {
    number: "04",
    text: "Develop collaborations with industry, academia and society for knowledge exchange, practical learning and sustainable development.",
  },
  {
    number: "05",
    text: "Prepare skilled, adaptable and socially responsible graduates to meet evolving global and local challenges.",
  },
];

export default function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const eyebrow = sectionRef.current?.querySelector(
        ".vision-eyebrow",
      ) as HTMLElement | null;

      const heading = sectionRef.current?.querySelector(
        ".vision-heading",
      ) as HTMLElement | null;

      const visionText = sectionRef.current?.querySelector(
        ".vision-text",
      ) as HTMLElement | null;

      const missionHeading = sectionRef.current?.querySelector(
        ".mission-heading",
      ) as HTMLElement | null;

      const missionItems = gsap.utils.toArray<HTMLElement>(".mission-item");

      // Eyebrow
      if (eyebrow) {
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              eyebrow,
              {
                opacity: 0,
                y: 15,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Vision heading
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

      // Vision statement
      if (visionText) {
        ScrollTrigger.create({
          trigger: visionText,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              visionText,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Mission heading
      if (missionHeading) {
        ScrollTrigger.create({
          trigger: missionHeading,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              missionHeading,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Mission items
      missionItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.06,
                ease: "power3.out",
              },
            );
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-primary-700 text-white"
    >
      <Container className="py-14 sm:py-18 lg:py-20">
        {/* -------------------------------------------------
            SECTION LABEL
        ------------------------------------------------- */}
        <div className="vision-eyebrow mb-12 flex items-center gap-3 sm:mb-16 lg:mb-20">
          <span
            className="h-2 w-2 rounded-full bg-accent-400"
            aria-hidden="true"
          />

          <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
            Our Vision & Mission
          </span>
        </div>

        {/* -------------------------------------------------
            VISION
        ------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20 xl:gap-28">
          {/* Label */}
          <div>
            <h2 className="vision-heading text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-white sm:text-2xl lg:text-5xl uppercase">
              Our
              <br />
              Vision.{" "}
            </h2>
          </div>

          {/* Statement */}
          <div className="vision-text relative">
            {/* Decorative quote */}
            <span
              aria-hidden="true"
              className="absolute -left-5 -top-8 text-[7rem] font-black leading-none text-white/[0.06] sm:-left-8 sm:-top-12 sm:text-[10rem]"
            >
              &ldquo;
            </span>

            <p className="relative max-w-4xl text-2xl font-semibold leading-9 tracking-[-0.02em] text-white sm:text-3xl sm:leading-10 lg:text-3xl lg:leading-[1.3]">
              To be a centre of excellence in technical education, fostering
              knowledge, innovation and ethical values to develop competent
              professionals who contribute meaningfully to society and address
              the challenges of a changing world.
            </p>
            {/* Decorative quote */}
            <span
              aria-hidden="true"
              className="absolute -right-5 -bottom-0 text-[7rem] font-black leading-none text-white/[0.06] sm:-right-0 sm:-bottom-28 sm:text-[10rem]"
            >
              &rdquo;
            </span>
          </div>
        </div>

        {/* -------------------------------------------------
            DIVIDER
        ------------------------------------------------- */}
        <div className="my-20 h-px bg-white/15 sm:my-24 lg:my-32" />

        {/* -------------------------------------------------
            MISSION
        ------------------------------------------------- */}
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="mission-heading">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
                The Mission
              </span>

              <h3 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl uppercase">
                Turning vision into action.
              </h3>
            </div>
          </div>

          {/* Mission list */}
          <div className="border-t border-white/15">
            {missionItems.map((item) => (
              <article
                key={item.number}
                className="mission-item group relative grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[70px_1fr] sm:gap-8 sm:py-8 lg:grid-cols-[80px_1fr]"
              >
                {/* Number */}
                <div>
                  <span className="text-xs font-black tracking-[0.2em] text-white/35 transition-colors duration-300 group-hover:text-accent-400">
                    {item.number}
                  </span>
                </div>

                {/* Mission */}
                <p className="max-w-3xl text-base leading-7 text-white/70 transition-colors duration-300 group-hover:text-white sm:text-lg sm:leading-8">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
