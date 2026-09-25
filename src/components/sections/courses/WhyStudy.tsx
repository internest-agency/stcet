"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export interface WhyStudyReason {
  number: string;
  title: string;
  description: string;
}

interface WhyStudyHorizontalProps {
  label: string;
  heading: string;
  intro: string;
  reasons: WhyStudyReason[];
}

export default function WhyStudyHorizontal({
  label,
  heading,
  intro,
  reasons,
}: WhyStudyHorizontalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (!section || !viewport || !track) return;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * ==================================================
       * HEADER HEIGHT
       * ==================================================
       */

      const getHeaderHeight = () => {
        const header = document.querySelector<HTMLElement>("header");

        return header?.getBoundingClientRect().height ?? 0;
      };

      /*
       * ==================================================
       * INTRO ANIMATION
       * ==================================================
       */

      if (!reducedMotion) {
        const introItems =
          section.querySelectorAll<HTMLElement>("[data-intro-item]");

        gsap.fromTo(
          introItems,
          {
            y: 24,
          },
          {
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      /*
       * ==================================================
       * HORIZONTAL DISTANCE
       * ==================================================
       */

      const getDistance = () => {
        const viewportWidth = viewport.getBoundingClientRect().width;

        const trackWidth = track.scrollWidth;

        return Math.max(0, trackWidth - viewportWidth);
      };

      /*
       * ==================================================
       * REDUCED MOTION
       * ==================================================
       */

      if (reducedMotion) {
        gsap.set(track, {
          x: 0,
          clearProps: "transform",
        });

        if (progress) {
          gsap.set(progress, {
            scaleX: 1,
          });
        }

        return;
      }

      /*
       * ==================================================
       * HORIZONTAL CAROUSEL
       * ==================================================
       *
       * Only the carousel track moves.
       *
       * Cards themselves are never faded or scaled.
       */

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),

        ease: "none",

        scrollTrigger: {
          /*
           * Use the carousel itself as the trigger.
           * The section should NOT trigger the pin.
           */
          trigger: viewport,

          /*
           * Start pinning when the TOP of the carousel
           * reaches 30% from the top of the viewport.
           */
          start: "top 30%",

          /*
           * Scroll for the complete horizontal distance.
           */
          end: () => {
            const distance = getDistance();

            return `+=${distance}`;
          },

          /*
           * Pin the entire section while the carousel
           * moves horizontally.
           */
          pin: section,

          pinSpacing: true,

          scrub: 1,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (!progress) return;

            gsap.set(progress, {
              scaleX: self.progress,
            });
          },
        },
      });

      void horizontalTween;

      /*
       * ==================================================
       * REFRESH
       * ==================================================
       */

      const refresh = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", refresh);

      /*
       * Refresh after initial layout.
       */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      /*
       * Refresh again after fonts/images/layout settle.
       */

      const refreshTimeout = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      /*
       * ==================================================
       * CLEANUP
       * ==================================================
       */

      return () => {
        window.removeEventListener("resize", refresh);

        window.clearTimeout(refreshTimeout);
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-[calc(100svh-80px)]
        overflow-hidden
        bg-gray-100
        text-gray-900
      "
    >
      <Container className="relative z-10">
        <div
          className="
            flex
            min-h-[calc(100svh-80px)]
            flex-col
            py-10
            sm:py-12
            lg:py-14
          "
        >
          {/* =================================================
              HEADING AREA
              ================================================= */}

          <div
            className="
              shrink-0
              lg:max-w-5xl
            "
          >
            {/* ---------------------------------------------
                LABEL
                --------------------------------------------- */}

            <div
              data-intro-item
              className="
                mb-4
                flex
                items-center
                gap-3
                sm:mb-5
              "
            >
              <span
                className="
                  h-2
                  w-2
                  shrink-0
                  rounded-full
                  bg-accent-500
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-gray-600
                "
              >
                {label}
              </span>
            </div>

            {/* ---------------------------------------------
                HEADING
                --------------------------------------------- */}

            <div data-intro-item>
              <SectionHeading
                as="h2"
                className="
                  max-w-4xl
                  !text-primary-800
                "
              >
                {heading}
              </SectionHeading>
            </div>

            {/* ---------------------------------------------
                INTRO
                --------------------------------------------- */}

            <p
              data-intro-item
              className="
                mt-5
                max-w-2xl
                text-[14px]
                font-medium
                leading-6
                text-gray-700
                sm:mt-6
                sm:text-[15px]
                sm:leading-7
                lg:text-[16px]
              "
            >
              {intro}
            </p>
          </div>

          {/* =================================================
              CAROUSEL AREA
              ================================================= */}

          <div className="mt-8">
            {/* ---------------------------------------------
                DIVIDER
                --------------------------------------------- */}

            <div
              className="
                mb-6
                h-px
                w-full
                bg-gray-300
              "
            />

            {/* ---------------------------------------------
                CAROUSEL VIEWPORT
                --------------------------------------------- */}

            <div
              ref={viewportRef}
              className="
                relative
                w-full
                overflow-visible
              "
            >
              {/* -----------------------------------------
                  CAROUSEL TRACK
                  ----------------------------------------- */}

              <div
                ref={trackRef}
                className="
                  flex
                  w-max
                  gap-4
                  pr-[20vw]
                  will-change-transform
                  sm:gap-5
                  sm:pr-[15vw]
                  lg:gap-6
                  lg:pr-[10vw]
                "
              >
                {reasons.map((reason) => (
                  <article
                    key={reason.number}
                    className="
                      group
                      relative
                      flex
                      h-[250px]
                      w-[78vw]
                      max-w-[390px]
                      shrink-0
                      flex-col
                      overflow-hidden

                      border
                      border-gray-300

                      bg-white

                      p-6

                      shadow-[0_8px_30px_rgba(15,23,42,0.05)]

                      transition-[background-color,border-color,box-shadow]
                      duration-300
                      ease-out

                      hover:bg-primary-800
                      hover:shadow-[0_14px_40px_rgba(15,23,42,0.10)]

                      sm:h-[285px]
                      sm:w-[55vw]
                      sm:max-w-[430px]
                      sm:p-7

                      lg:h-[305px]
                      lg:w-[430px]
                      lg:p-8
                    "
                  >
                    {/* -----------------------------------
                        TOP ACCENT LINE
                        ----------------------------------- */}

                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        h-[3px]
                        w-20
                        bg-accent-400

                        transition-[width,background-color]
                        duration-300
                        ease-out
                      "
                    />

                    {/* -----------------------------------
                        NUMBER
                        ----------------------------------- */}

                    <div>
                      <span
                        className="
                          font-mono
                          text-[11px]
                          font-bold
                          tracking-[0.16em]
                          text-primary-700

                          transition-colors
                          duration-300

                          group-hover:text-white
                        "
                      >
                        {reason.number}
                      </span>
                    </div>

                    {/* -----------------------------------
                        CONTENT
                        ----------------------------------- */}

                    <div className="mt-auto">
                      {/* Title */}

                      <h3
                        className="
                          max-w-[360px]
                          text-[23px]
                          font-extrabold
                          leading-[1.08]
                          tracking-[-0.025em]
                          text-primary-800

                          transition-colors
                          duration-300

                          group-hover:text-white

                          sm:text-[26px]

                          lg:text-[29px]
                        "
                      >
                        {reason.title}
                      </h3>

                      {/* Description */}

                      <p
                        className="
                          mt-3
                          max-w-[370px]
                          text-[13px]
                          font-medium
                          leading-5
                          text-gray-600

                          transition-colors
                          duration-300

                          group-hover:text-white/90

                          sm:mt-4
                          sm:text-[14px]
                          sm:leading-6
                        "
                      >
                        {reason.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* =================================================
                PROGRESS
                ================================================= */}

            <div className="mt-6 sm:mt-7">
              {/* Progress track */}

              <div
                className="
                  relative
                  h-[2px]
                  w-full
                  overflow-hidden
                  bg-gray-300
                "
              >
                <div
                  ref={progressRef}
                  className="
                    absolute
                    inset-y-0
                    left-0
                    w-full
                    origin-left
                    scale-x-0
                    bg-primary-700
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
