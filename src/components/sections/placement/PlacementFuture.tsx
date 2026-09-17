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
    const section = sectionRef.current;

    if (!section) return;

    const splitInstances: SplitText[] = [];

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = section.querySelector<HTMLElement>(
        ".placement-future-heading",
      );

      const statement = section.querySelector<HTMLElement>(".future-statement");

      const items = Array.from(
        section.querySelectorAll<HTMLElement>(".future-outcome"),
      );

      /*
       * ============================================================
       * REDUCED MOTION
       * ============================================================
       */

      if (reducedMotion) {
        gsap.set(
          [heading, statement, ...items].filter(
            (element): element is HTMLElement => element !== null,
          ),
          {
            clearProps: "all",
          },
        );

        return;
      }

      /*
       * ============================================================
       * HEADING REVEAL
       * ============================================================
       */

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        splitInstances.push(split);

        gsap.set(split.lines, {
          yPercent: 100,
        });

        gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 84%",
            once: true,
          },
        });
      }

      /*
       * ============================================================
       * STATEMENT REVEAL
       * ============================================================
       */

      if (statement) {
        gsap.set(statement, {
          opacity: 0,
          y: 20,
        });

        gsap.to(statement, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statement,
            start: "top 88%",
            once: true,
          },
        });
      }

      /*
       * ============================================================
       * OUTCOME ITEMS
       * ============================================================
       */

      if (items.length) {
        gsap.set(items, {
          opacity: 0,
          y: 20,
        });

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: items[0],
            start: "top 88%",
            once: true,
          },
        });
      }
    }, section);

    return () => {
      splitInstances.forEach((split) => {
        split.revert();
      });

      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary-700 text-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          {/* =========================================================
              INTRO
          ========================================================== */}

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Preparing for the Future
              </span>
            </div>

            <h2 className="placement-future-heading max-w-md perspective-[900px] font-black uppercase leading-[1.05] tracking-[-0.04em] text-white text-[32px] sm:text-[40px] lg:text-[48px]">
              Preparing For The Future.
            </h2>
          </div>

          {/* =========================================================
              CONTENT
          ========================================================== */}

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

            {/* =======================================================
                OUTCOMES
            ======================================================== */}

            <div className="mt-8 border-t border-white/15">
              {outcomes.map((item) => (
                <div
                  key={item.number}
                  className="
                    future-outcome
                    group
                    flex
                    items-center
                    gap-5
                    border-b
                    border-white/15
                    px-4
                    py-6
                    transition-colors
                    duration-300
                    hover:bg-white/3
                  "
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
                    className="
                      h-px
                      w-0
                      shrink-0
                      bg-accent-400
                      transition-all
                      duration-400
                      group-hover:w-8
                    "
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom accent */}
      <div aria-hidden="true" className="h-1 w-full bg-accent-400" />
    </section>
  );
}
