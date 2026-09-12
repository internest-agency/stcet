"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FaCircleArrowRight } from "react-icons/fa6";

import Container from "./Container";
import Button from "./Button";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CourseCallToActionProps {
  heading: ReactNode;
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: string;
  actionTitle?: string;
  actionDescription?: string;
}

export default function CourseCallToAction({
  heading,
  eyebrow = "Take the next step",
  actionLabel = "Enquire Now",
  actionHref = "/enquire-now",
  actionTitle = "Ready to begin?",
  actionDescription = "Explore your opportunities",
}: CourseCallToActionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(section.querySelectorAll("[data-cta-animate]"), {
          clearProps: "all",
        });

        return;
      }

      const heading = section.querySelector<HTMLElement>("[data-cta-heading]");

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
        });

        gsap.set(split.lines, {
          yPercent: 100,
        });

        gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            once: true,
          },
        });
      }

      const action = section.querySelector<HTMLElement>("[data-cta-action]");

      if (action) {
        gsap.fromTo(
          action,
          {
            opacity: 0,
            x: 25,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: action,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-100 text-primary-700"
    >
      <Container>
        <div className="py-8 sm:py-10 lg:py-12">
          <div className="relative overflow-hidden">
            <div className="grid items-center gap-7 pl-5 sm:pl-7 lg:grid-cols-[1fr_auto] lg:gap-12 lg:pl-8">
              {/* Statement */}
              <div>
                <div data-cta-animate className="mb-3 flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-700/40">
                    {eyebrow}
                  </span>
                </div>

                <h2
                  data-cta-heading
                  className="
                    max-w-3xl
                    overflow-hidden
                    text-[25px]
                    font-extrabold
                    uppercase
                    leading-[1.02]
                    tracking-[-0.045em]
                    text-primary-700
                    sm:text-[32px]
                    lg:text-[38px]
                  "
                >
                  {heading}
                </h2>
              </div>

              {/* Action */}
              <div
                data-cta-action
                className="
                  flex
                  items-center
                  gap-5
                  lg:border-l
                  lg:border-gray-200
                  lg:pl-10
                "
              >
                <div className="hidden text-right sm:block">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-primary-700/35">
                    {actionTitle}
                  </span>

                  <span className="mt-1 block text-[11px] text-primary-700/55">
                    {actionDescription}
                  </span>
                </div>

                <Button
                  href={actionHref}
                  variant="accent"
                  size="md"
                  rightIcon={<FaCircleArrowRight />}
                >
                  {actionLabel}
                </Button>
              </div>
            </div>

            {/* Decorative corner */}
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-0
                right-0
                h-16
                w-16
                border-l
                border-t
                border-primary-700/5
              "
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
