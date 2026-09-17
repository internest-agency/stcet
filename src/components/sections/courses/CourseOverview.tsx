"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

export interface OverviewParagraph {
  content: React.ReactNode;
}

interface CourseOverviewProps {
  label?: string;
  heading: string;
  paragraphs: OverviewParagraph[];
  keyStatement?: React.ReactNode;
}

export default function CourseOverview({
  label = "About the Programme",
  heading,
  paragraphs,
  keyStatement,
}: CourseOverviewProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingElement =
        section.querySelector<HTMLElement>(".overview-heading");

      const content = section.querySelector<HTMLElement>(".overview-content");

      /*
       * ==========================================
       * HEADING ANIMATION
       * ==========================================
       */

      if (headingElement) {
        const split = SplitText.create(headingElement, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        if (reducedMotion) {
          gsap.set(split.lines, {
            clearProps: "all",
          });
        } else {
          gsap.set(split.lines, {
            yPercent: 105,
          });

          ScrollTrigger.create({
            trigger: headingElement,
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

      /*
       * ==========================================
       * CONTENT ANIMATION
       * ==========================================
       */

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
            {/* ==========================================
                HEADING
                ========================================== */}

            <div>
              {/* Section Label */}
              <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                <span
                  aria-hidden="true"
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-accent-400
                    sm:h-2
                    sm:w-2
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-primary-700
                  "
                >
                  {label}
                </span>
              </div>

              {/* Heading */}
              <SectionHeading as="h2">{heading}</SectionHeading>
            </div>

            {/* ==========================================
                CONTENT
                ========================================== */}

            <div className="overview-content">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="
                    text-[14px]
                    leading-6
                    text-gray-500
                    sm:text-[15px]
                    sm:leading-7
                    lg:text-[17px]
                    lg:leading-8
                    mb-5
                  "
                >
                  {paragraph.content}
                </p>
              ))}

              {/* ==========================================
                  KEY STATEMENT
                  ========================================== */}

              {keyStatement && (
                <div
                  className="
                    mt-7
                    border-t
                    border-gray-200
                    pt-6
                    sm:mt-8
                    sm:pt-7
                  "
                >
                  <p
                    className="
                      max-w-2xl
                      text-[15px]
                      font-bold
                      leading-6
                      tracking-[-0.01em]
                      text-primary-700
                      sm:text-[16px]
                      sm:leading-7
                      lg:text-[18px]
                      lg:leading-8
                    "
                  >
                    {keyStatement}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
