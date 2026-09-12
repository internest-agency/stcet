"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const reasons = [
  {
    number: "01",
    title: "Strong Foundation in Computing & IT",
    description:
      "Build a strong foundation across core computing and information technologies.",
  },
  {
    number: "02",
    title: "Practical Technology Applications",
    description:
      "Develop practical knowledge by applying technology concepts to real-world problems and applications.",
  },
  {
    number: "03",
    title: "Contemporary Digital Technologies",
    description:
      "Gain exposure to contemporary digital technologies shaping modern organisations and industries.",
  },
  {
    number: "04",
    title: "Application & Problem-Solving Skills",
    description:
      "Develop application development and problem-solving skills to create effective technology solutions.",
  },
  {
    number: "05",
    title: "Broad Career Possibilities",
    description:
      "Build skills that support diverse career opportunities across technology and digital sectors.",
  },
];

export default function ITWhyStudy() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * ==========================================
       * REDUCED MOTION
       * ==========================================
       */

      if (reducedMotion) {
        gsap.set(
          section.querySelectorAll(
            "[data-label-dot], [data-label-text], [data-intro], [data-reason], [data-reason-number], [data-reason-title], [data-reason-description], [data-reason-line]",
          ),
          {
            clearProps: "all",
          },
        );

        return;
      }

      /*
       * ==========================================
       * SECTION LABEL
       * ==========================================
       */

      const label = section.querySelector<HTMLElement>("[data-why-label]");

      if (label) {
        const dot = label.querySelector<HTMLElement>("[data-label-dot]");
        const text = label.querySelector<HTMLElement>("[data-label-text]");

        const labelTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: label,
            start: "top 88%",
            once: true,
          },
        });

        if (dot) {
          labelTimeline.fromTo(
            dot,
            {
              scale: 0,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(2.5)",
            },
          );
        }

        if (text) {
          labelTimeline.fromTo(
            text,
            {
              opacity: 0,
              x: -15,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.3",
          );
        }
      }

      /*
       * ==========================================
       * MAIN HEADING
       * ==========================================
       */

      const heading = section.querySelector<HTMLElement>(".why-study-heading");

      if (heading) {
        const splitHeading = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
        });

        gsap.set(splitHeading.lines, {
          yPercent: 120,
          rotateX: -75,
          transformOrigin: "50% 100%",
        });

        gsap.to(splitHeading.lines, {
          yPercent: 0,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            once: true,
          },
        });
      }

      /*
       * ==========================================
       * INTRO PARAGRAPH
       * ==========================================
       */

      const intro = section.querySelector<HTMLElement>("[data-intro]");

      if (intro) {
        gsap.fromTo(
          intro,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: intro,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      /*
       * ==========================================
       * REASON ITEMS
       * ==========================================
       */

      const reasonItems =
        section.querySelectorAll<HTMLElement>("[data-reason]");

      reasonItems.forEach((item) => {
        const number = item.querySelector<HTMLElement>("[data-reason-number]");

        const title = item.querySelector<HTMLElement>("[data-reason-title]");

        const description = item.querySelector<HTMLElement>(
          "[data-reason-description]",
        );

        const line = item.querySelector<HTMLElement>("[data-reason-line]");

        /*
         * Initial states
         */

        if (number) {
          gsap.set(number, {
            opacity: 0,
            scale: 0.65,
            x: -20,
          });
        }

        if (title) {
          gsap.set(title, {
            opacity: 0,
            x: 35,
          });
        }

        if (description) {
          gsap.set(description, {
            opacity: 0,
            x: 25,
          });
        }

        if (line) {
          gsap.set(line, {
            scaleX: 0,
            transformOrigin: "left center",
          });
        }

        /*
         * Row timeline
         */

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true,
          },
        });

        /*
         * Border
         */

        if (line) {
          timeline.to(
            line,
            {
              scaleX: 1,
              duration: 0.7,
              ease: "power2.out",
            },
            0,
          );
        }

        /*
         * Number
         */

        if (number) {
          timeline.to(
            number,
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 0.65,
              ease: "back.out(1.7)",
            },
            0.05,
          );
        }

        /*
         * Title
         */

        if (title) {
          timeline.to(
            title,
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            0.12,
          );
        }

        /*
         * Description
         */

        if (description) {
          timeline.to(
            description,
            {
              opacity: 1,
              x: 0,
              duration: 0.65,
              ease: "power3.out",
            },
            0.22,
          );
        }
      });
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container>
        <div className="py-14 md:py-18 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 xl:gap-28">
            {/* =========================================
                SECTION INTRODUCTION
            ========================================== */}

            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* Label */}

              <div data-why-label className="mb-5 flex items-center gap-2.5">
                <span
                  data-label-dot
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-accent-400"
                />

                <span
                  data-label-text
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700"
                >
                  Why Study IT
                </span>
              </div>

              {/* Heading */}

              <h2
                className="
                  why-study-heading
                  max-w-lg
                  text-[32px]
                  font-extrabold
                  uppercase
                  leading-[0.96]
                  tracking-[-0.045em]
                  text-primary-700
                  [perspective:800px]
                  sm:text-[40px]
                  lg:text-[48px]
                "
              >
                Learn technology. Apply it intelligently.
              </h2>

              {/* Description */}

              <p
                data-intro
                className="
                  mt-6
                  max-w-md
                  text-[14px]
                  leading-6
                  text-gray-500
                  sm:text-[15px]
                  sm:leading-7
                  lg:mt-8
                  lg:text-[16px]
                  lg:leading-7
                "
              >
                Build a strong foundation in information technology while
                developing practical skills to apply contemporary digital
                technologies and create meaningful solutions.
              </p>
            </div>

            {/* =========================================
                REASONS
            ========================================== */}

            <div className="border-t border-gray-200">
              {reasons.map((reason) => (
                <article
                  key={reason.number}
                  data-reason
                  className="
                    relative
                    grid
                    gap-4
                    border-b
                    border-gray-200
                    py-6
                    sm:grid-cols-[60px_1fr]
                    sm:gap-6
                    sm:py-7
                    lg:grid-cols-[70px_1fr]
                    lg:gap-8
                    lg:py-8
                  "
                >
                  {/* Number */}

                  <span
                    data-reason-number
                    className="
                      inline-block
                      origin-left
                      font-mono
                      text-[11px]
                      font-bold
                      tracking-[0.12em]
                      text-gray-300
                    "
                  >
                    {reason.number}
                  </span>

                  {/* Content */}

                  <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
                    {/* Title */}

                    <h3
                      data-reason-title
                      className="
                        text-[19px]
                        font-extrabold
                        leading-[1.1]
                        tracking-[-0.025em]
                        text-primary-700
                        sm:text-[20px]
                        lg:text-[22px]
                      "
                    >
                      {reason.title}
                    </h3>

                    {/* Description */}

                    <p
                      data-reason-description
                      className="
                        text-[13px]
                        leading-5
                        text-gray-500
                        sm:text-[14px]
                        sm:leading-6
                        lg:text-[15px]
                        lg:leading-7
                      "
                    >
                      {reason.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
