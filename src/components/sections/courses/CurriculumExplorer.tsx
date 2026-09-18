"use client";

import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

/* =========================================================
   TYPES
========================================================= */

export interface CurriculumSlide {
  number: string;
  title: string;
  description: string;
  image: string;
}

interface CurriculumExplorerProps {
  title: string;
  intro: string;
  slides: CurriculumSlide[];
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CurriculumExplorer({
  title,
  intro,
  slides,
}: CurriculumExplorerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const slideTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isChanging, setIsChanging] = useState(false);

  /*
   * Prevent invalid active index when the
   * data changes dynamically.
   */
  const safeActiveIndex =
    slides.length > 0 ? Math.min(activeIndex, slides.length - 1) : 0;

  const activeSlide = slides[safeActiveIndex];

  const totalSlides = String(slides.length).padStart(2, "0");

  /* =========================================================
     SELECT SLIDE
  ========================================================= */

  const selectSlide = useCallback(
    (index: number) => {
      if (slides.length === 0 || index === safeActiveIndex || isChanging) {
        return;
      }

      const image = imageRef.current;
      const content = contentRef.current;

      /*
       * Fallback when animation elements
       * are not available.
       */
      if (!image || !content) {
        setActiveIndex(index);
        return;
      }

      const direction = index > safeActiveIndex ? 1 : -1;

      setIsChanging(true);

      /*
       * Kill any previous slide animation.
       */
      slideTimelineRef.current?.kill();

      const timeline = gsap.timeline({
        onComplete: () => {
          slideTimelineRef.current = null;
          setIsChanging(false);
        },
      });

      slideTimelineRef.current = timeline;

      timeline
        /*
         * -----------------------------------------------------
         * EXIT IMAGE
         * -----------------------------------------------------
         */

        .to(image, {
          opacity: 0,
          y: direction > 0 ? -12 : 12,
          duration: 0.18,
          ease: "power2.in",
        })

        /*
         * -----------------------------------------------------
         * EXIT CONTENT
         * -----------------------------------------------------
         */

        .to(
          content,
          {
            opacity: 0,
            y: direction > 0 ? -6 : 6,
            duration: 0.16,
            ease: "power2.in",
          },
          "<",
        )

        /*
         * -----------------------------------------------------
         * CHANGE ACTIVE SLIDE
         * -----------------------------------------------------
         */

        .call(() => {
          setActiveIndex(index);
        })

        /*
         * -----------------------------------------------------
         * ENTER STARTING POSITIONS
         * -----------------------------------------------------
         */

        .set(image, {
          y: direction > 0 ? 12 : -12,
        })

        .set(content, {
          y: direction > 0 ? 6 : -6,
        })

        /*
         * -----------------------------------------------------
         * ENTER IMAGE
         * -----------------------------------------------------
         */

        .to(image, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        })

        /*
         * -----------------------------------------------------
         * ENTER CONTENT
         * -----------------------------------------------------
         */

        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: "power3.out",
          },
          "<0.04",
        );
    },
    [slides.length, safeActiveIndex, isChanging],
  );

  /* =========================================================
     HEADING ANIMATION
  ========================================================= */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = section.querySelector<HTMLElement>(".curriculum-heading");

      if (!heading || reducedMotion) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(split.lines, {
        yPercent: 105,
      });

      ScrollTrigger.create({
        trigger: heading,
        start: "top 86%",
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
    }, section);

    return () => {
      slideTimelineRef.current?.kill();
      slideTimelineRef.current = null;

      context.revert();
    };
  }, []);

  /* =========================================================
     KEYBOARD NAVIGATION
  ========================================================= */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (slides.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();

      selectSlide(index === slides.length - 1 ? 0 : index + 1);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();

      selectSlide(index === 0 ? slides.length - 1 : index - 1);
    }
  };

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!activeSlide) {
    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container>
        {/* ===================================================
            SECTION INTRO
        =================================================== */}

        <div className="pt-14 sm:pt-18 lg:pt-20">
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[0.95fr_1.05fr]
              lg:items-end
              lg:gap-16
              xl:gap-24
            "
          >
            {/* LEFT */}

            <div>
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-2.5
                  sm:mb-6
                "
              >
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
                  Curriculum
                </span>
              </div>

              <SectionHeading>{title}</SectionHeading>
            </div>

            {/* RIGHT */}

            <div>
              <p
                className="
                  curriculum-intro
                  max-w-xl
                  text-[14px]
                  leading-6
                  text-gray-500
                  sm:text-[15px]
                  sm:leading-7
                  lg:text-[17px]
                  lg:leading-8
                "
              >
                {intro}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            CURRICULUM EXPLORER
        =================================================== */}

        <div
          className="
            my-14
            border-y
            border-gray-200
            bg-white
            sm:my-18
            lg:my-20
          "
        >
          <div
            className="
              grid
              lg:grid-cols-[280px_1fr]
              xl:grid-cols-[320px_1fr]
            "
          >
            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div
              className="
                border-b
                border-gray-200
                lg:border-b-0
                lg:border-r
              "
            >
              {/* NAV HEADER */}

              <div
                className="
                  border-b
                  border-gray-200
                  px-5
                  py-4
                  sm:px-6
                  lg:px-7
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-gray-400
                  "
                >
                  Focus Areas
                </span>
              </div>

              {/* MODULES */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-1
                "
              >
                {slides.map((slide, index) => {
                  const isActive = index === safeActiveIndex;

                  return (
                    <button
                      key={`${slide.number}-${slide.title}`}
                      type="button"
                      onClick={() => selectSlide(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      aria-current={isActive ? "true" : undefined}
                      disabled={isChanging}
                      className={`
                          group
                          relative
                          flex
                          min-h-13.5
                          w-full
                          cursor-pointer
                          items-center
                          gap-4
                          border-b
                          border-gray-100
                          px-5
                          py-3
                          text-left
                          transition-colors
                          duration-300
                          focus:outline-none
                          focus-visible:ring-1
                          focus-visible:ring-inset
                          focus-visible:ring-accent-400
                          sm:px-6
                          lg:px-7
                          ${isActive ? "bg-gray-50" : "hover:bg-gray-50/70"}
                        `}
                    >
                      {/* ACTIVE INDICATOR */}

                      <span
                        aria-hidden="true"
                        className={`
                            absolute
                            bottom-0
                            left-0
                            top-0
                            w-0.5
                            origin-bottom
                            bg-accent-400
                            transition-transform
                            duration-300
                            ${isActive ? "scale-y-100" : "scale-y-0"}
                          `}
                      />

                      {/* NUMBER */}

                      <span
                        className={`
                            w-5
                            shrink-0
                            font-mono
                            text-[10px]
                            font-bold
                            tracking-[0.08em]
                            ${isActive ? "text-accent-400" : "text-gray-300"}
                          `}
                      >
                        {slide.number}
                      </span>

                      {/* TITLE */}

                      <span
                        className={`
                            min-w-0
                            text-[11px]
                            font-bold
                            leading-4
                            transition-colors
                            duration-300
                            sm:text-xs
                            ${
                              isActive
                                ? "text-primary-700"
                                : "text-gray-500 group-hover:text-primary-700"
                            }
                          `}
                      >
                        {slide.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                FEATURED CONTENT
            ================================================= */}

            <div
              className="
                grid
                lg:grid-cols-[0.95fr_1.05fr]
              "
            >
              {/* =================================================
                  IMAGE
              ================================================= */}

              <div
                className="
                  relative
                  aspect-[16/10]
                  overflow-hidden
                  border-b
                  border-gray-200
                  lg:aspect-auto
                  lg:min-h-[500px]
                  lg:border-b-0
                  lg:border-r
                  xl:min-h-[540px]
                "
              >
                <div
                  ref={imageRef}
                  className="
                    absolute
                    inset-0
                    will-change-transform
                  "
                >
                  <Image
                    key={activeSlide.image}
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fill
                    sizes="
                      (max-width: 1023px) 100vw,
                      45vw
                    "
                    className="object-cover"
                  />
                </div>
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div
                ref={contentRef}
                className="
                  flex
                  min-h-[320px]
                  flex-col
                  justify-center
                  p-6
                  sm:p-8
                  lg:min-h-[500px]
                  lg:p-10
                  xl:min-h-[540px]
                  xl:p-14
                "
              >
                {/* MODULE NUMBER */}

                <span
                  className="
                    font-mono
                    text-[10px]
                    font-bold
                    tracking-[0.15em]
                    text-accent-400
                  "
                >
                  MODULE {activeSlide.number}
                </span>

                {/* TITLE */}
                <SectionHeading className="mt-4" as="h3">
                  {activeSlide.title}
                </SectionHeading>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-[14px]
                    leading-6
                    text-gray-500
                    sm:mt-6
                    sm:text-[15px]
                    sm:leading-7
                    lg:text-[16px]
                    lg:leading-8
                  "
                >
                  {activeSlide.description}
                </p>

                {/* =================================================
                    PREVIOUS / COUNTER / NEXT
                ================================================= */}

                <div
                  className="
                    mt-8
                    flex
                    items-center
                    justify-between
                    border-t
                    border-gray-200
                    pt-5
                    sm:mt-10
                    sm:pt-6
                  "
                >
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={isChanging}
                    onClick={() =>
                      selectSlide(
                        safeActiveIndex === 0
                          ? slides.length - 1
                          : safeActiveIndex - 1,
                      )
                    }
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-gray-400
                      transition-colors
                      duration-300
                      hover:text-primary-700
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Previous
                  </button>

                  {/* COUNTER */}

                  <span
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      tracking-[0.12em]
                      text-gray-400
                    "
                  >
                    {activeSlide.number} / {totalSlides}
                  </span>

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={isChanging}
                    onClick={() =>
                      selectSlide(
                        safeActiveIndex === slides.length - 1
                          ? 0
                          : safeActiveIndex + 1,
                      )
                    }
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-gray-400
                      transition-colors
                      duration-300
                      hover:text-primary-700
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
