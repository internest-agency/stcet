"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger, MorphSVGPlugin);

interface OpportunityAreasProps {
  title: string;
  data: string[];
}

export default function OpportunityAreas({
  title,
  data,
}: OpportunityAreasProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const curvePath = section.querySelector<SVGPathElement>(
        ".opportunity-curve-path",
      );

      const heading = section.querySelector<HTMLElement>(
        ".opportunity-heading",
      );

      const items = Array.from(
        section.querySelectorAll<HTMLElement>(".opportunity-item"),
      );

      if (!curvePath) return;

      /*
       * =========================================================
       * CURVE SWIPE PATHS
       * =========================================================
       */

      const initialPath = "M 0 0 H 100 V 100 H 0 Z";

      const finalPath = "M 0 -25 V -25 Q 50 -55 100 -25 V -25 Z";

      /*
       * Initial state:
       * Gray covers the complete section.
       */

      gsap.set(curvePath, {
        attr: {
          d: initialPath,
        },
      });

      /*
       * =========================================================
       * REDUCED MOTION
       * =========================================================
       */

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(curvePath, {
          attr: {
            d: finalPath,
          },
        });

        gsap.set(items, {
          opacity: 1,
          y: 0,
        });

        if (heading) {
          gsap.set(heading, {
            opacity: 1,
          });
        }

        return;
      }

      /*
       * =========================================================
       * HEADING SPLIT
       * =========================================================
       */

      let headingSplit: SplitText | null = null;

      if (heading) {
        headingSplit = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        gsap.set(headingSplit.lines, {
          yPercent: 100,
        });
      }

      /*
       * =========================================================
       * OPPORTUNITY ITEMS
       * =========================================================
       */

      gsap.set(items, {
        opacity: 0,
        y: 20,
      });

      /*
       * =========================================================
       * CURVE SWIPE ON SCROLL
       * =========================================================
       */

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,

        onEnter: () => {
          const timeline = gsap.timeline();

          /*
           * -----------------------------------------------------
           * SINGLE SMOOTH CURVE SWIPE
           * -----------------------------------------------------
           *
           * Starts with a short delay.
           * Starts fast.
           * Gradually slows down towards the end.
           */

          timeline.to(curvePath, {
            duration: 1.5,
            delay: 0.3,
            morphSVG: finalPath,
            ease: "power4.out",
          });

          /*
           * -----------------------------------------------------
           * HEADING REVEAL
           * -----------------------------------------------------
           */

          if (headingSplit) {
            timeline.to(
              headingSplit.lines,
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              },
              "-=0.65",
            );
          }

          /*
           * -----------------------------------------------------
           * DATA REVEAL
           * -----------------------------------------------------
           */

          timeline.to(
            items,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: "power3.out",
            },
            "-=0.45",
          );
        },
      });

      /*
       * =========================================================
       * HOVER ANIMATIONS
       * =========================================================
       */

      items.forEach((item) => {
        const number = item.querySelector<HTMLElement>(".opportunity-number");

        const title = item.querySelector<HTMLElement>(".opportunity-title");

        const underline = item.querySelector<HTMLElement>(
          ".opportunity-underline",
        );

        const handleEnter = () => {
          if (number) {
            gsap.to(number, {
              color: "var(--color-accent-400)",
              duration: 0.25,
              ease: "power2.out",
            });
          }

          if (title) {
            gsap.to(title, {
              x: 4,
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
          }

          if (underline) {
            gsap.to(underline, {
              width: "100%",
              duration: 0.45,
              ease: "power3.out",
            });
          }
        };

        const handleLeave = () => {
          if (number) {
            gsap.to(number, {
              color: "rgba(255,255,255,0.3)",
              duration: 0.25,
              ease: "power2.out",
            });
          }

          if (title) {
            gsap.to(title, {
              x: 0,
              color: "rgba(255,255,255,0.75)",
              duration: 0.3,
              ease: "power2.out",
            });
          }

          if (underline) {
            gsap.to(underline, {
              width: "0%",
              duration: 0.4,
              ease: "power3.out",
            });
          }
        };

        item.addEventListener("mouseenter", handleEnter);

        item.addEventListener("mouseleave", handleLeave);
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-primary-800
        text-white
      "
    >
      {/* =======================================================
          GRAY BACKGROUND / CURVE SWIPE
          ======================================================= */}

      <svg
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          h-full
          w-full
        "
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="opportunity-curve-path"
          d="M 0 0 H 100 V 100 H 0 Z"
          fill="#6b7280"
        />
      </svg>

      {/* =======================================================
          CONTENT
          ======================================================= */}

      <Container
        className="
          relative
          z-10
          py-14
          sm:py-16
          md:py-18
          lg:py-20
        "
      >
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-20
            xl:gap-24
          "
        >
          {/* =================================================
              LEFT CONTENT
              ================================================= */}

          <div
            className="
              lg:sticky
              lg:top-28
              lg:self-start
            "
          >
            {/* Eyebrow */}

            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="
                  h-2
                  w-2
                  shrink-0
                  rounded-full
                  bg-accent-400
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-white/60
                  sm:text-xs
                "
              >
                Opportunity Areas
              </span>
            </div>

            {/* Dynamic Title */}
            <SectionHeading as="h2" className="text-white">
              {title}
            </SectionHeading>

            {/* Accent line */}

            <div
              className="
                mt-7
                h-px
                w-12
                bg-accent-400
              "
            />
          </div>

          {/* =================================================
              RIGHT DATA
              ================================================= */}

          <div
            className="
              border-t
              border-white/15
            "
          >
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
              "
            >
              {data.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="
                    opportunity-item
                    group
                    relative
                    flex
                    min-h-19.5
                    items-center
                    gap-4
                    border-b
                    border-white/15
                    px-0
                    py-5
                    sm:min-h-22
                    sm:px-5
                    sm:py-6
                    lg:px-6
                  "
                >
                  {/* Number */}

                  <span
                    className="
                      opportunity-number
                      w-7
                      shrink-0
                      font-mono
                      text-[10px]
                      font-bold
                      tracking-[0.12em]
                      text-white/30
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}

                  <span
                    className="
                      opportunity-title
                      min-w-0
                      text-[14px]
                      font-bold
                      leading-5
                      text-white/75
                      sm:text-[15px]
                      sm:leading-6
                      lg:text-[16px]
                    "
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
