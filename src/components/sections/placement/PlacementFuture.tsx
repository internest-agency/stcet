"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const outcomes = [
  {
    number: "01",
    title: "Discover",
    description: "Discover their strengths.",
  },
  {
    number: "02",
    title: "Build",
    description: "Build relevant skills.",
  },
  {
    number: "03",
    title: "Gain",
    description: "Gain practical exposure.",
  },
  {
    number: "04",
    title: "Develop",
    description: "Develop professional confidence.",
  },
  {
    number: "05",
    title: "Pursue",
    description: "Pursue the right career opportunities.",
  },
];

export default function PlacementFuture() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".placement-future-heading",
      ) as HTMLElement | null;

      const items = sectionRef.current?.querySelectorAll(".future-outcome");

      const statement = sectionRef.current?.querySelector(
        ".future-statement",
      ) as HTMLElement | null;

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
            statement,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.2,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            items,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              delay: 0.35,
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
    <section ref={sectionRef} className="bg-primary-700 text-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Preparing for the Future
              </span>
            </div>

            <h2 className="placement-future-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Preparing
              <br />
              For The
              <br />
              Future.
            </h2>
          </div>

          <div>
            <div className="future-statement max-w-3xl">
              <p className="text-lg font-medium leading-8 text-white sm:text-2xl sm:leading-9">
                Our objective is not simply to prepare students for a placement
                process, but to help them become{" "}
                <strong>career-ready professionals</strong>.
              </p>

              <p className="mt-8 border-t border-white/15 pt-8 text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Through continuous training and guidance, the Placement Cell
                seeks to help students:
              </p>
            </div>

            <div className="mt-8 border-t border-white/15">
              {outcomes.map((item) => (
                <div
                  key={item.number}
                  className="future-outcome group flex items-center gap-5 border-b border-white/15 py-6"
                >
                  <span className="w-8 shrink-0 text-xs font-bold text-accent-400">
                    {item.number}
                  </span>

                  <span className="text-xl font-extrabold text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                    {item.title}
                  </span>

                  <span className="ml-auto hidden text-sm text-white/50 sm:block">
                    {item.description}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-accent-400 transition-all duration-400 group-hover:w-8"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="h-1 w-full bg-accent-400" />
    </section>
  );
}
