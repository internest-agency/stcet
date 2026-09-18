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
  /* =========================================================
     REFS
  ========================================================= */

  const sectionRef = useRef<HTMLElement>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const introRef = useRef<HTMLParagraphElement>(null);

  const explorerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const slideTimelineRef = useRef<gsap.core.Timeline | null>(null);

  /* =========================================================
     STATE
  ========================================================= */

  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  /* =========================================================
     SAFE ACTIVE INDEX
  ========================================================= */

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

      if (!image || !content) {
        setActiveIndex(index);
        return;
      }

      /*
       * Determine direction.
       *
       * Forward:
       * old content exits left
       * new content enters from right
       *
       * Backward:
       * old content exits right
       * new content enters from left
       */
      const direction = index > safeActiveIndex ? 1 : -1;

      setIsChanging(true);

      /*
       * Kill any running slide animation.
       */
      slideTimelineRef.current?.kill();

      /* =====================================================
         CONTENT ELEMENTS

         IMPORTANT:
         The bottom navigation controls are deliberately
         NOT included here.

         They must remain completely stationary when
         changing modules.
      ===================================================== */

      const moduleNumber = content.querySelector<HTMLElement>(
        ".curriculum-module-number",
      );

      const title = content.querySelector<HTMLElement>(
        ".curriculum-module-title",
      );

      const description = content.querySelector<HTMLElement>(
        ".curriculum-module-description",
      );

      /*
       * Only these elements participate in the
       * directional slide transition.
       *
       * Previous / Counter / Next are intentionally
       * excluded.
       */
      const animatedContent = [moduleNumber, title, description].filter(
        (element): element is HTMLElement => Boolean(element),
      );

      /* =====================================================
         TIMELINE
      ===================================================== */

      const timeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },

        onComplete: () => {
          slideTimelineRef.current = null;
          setIsChanging(false);
        },
      });

      slideTimelineRef.current = timeline;

      /* =====================================================
         EXIT CURRENT CONTENT
      ===================================================== */

      const exitX = direction > 0 ? -36 : 36;

      if (animatedContent.length > 0) {
        timeline.to(animatedContent, {
          opacity: 0,
          x: exitX,
          duration: 0.24,
          stagger: 0.025,
          ease: "power2.in",
        });
      }

      /* =====================================================
         EXIT IMAGE
      ===================================================== */

      timeline.to(
        image,
        {
          opacity: 0,
          x: direction > 0 ? -50 : 50,
          scale: 1.035,
          duration: 0.34,
          ease: "power2.inOut",
        },
        "<0.02",
      );

      /* =====================================================
         CHANGE ACTIVE SLIDE
      ===================================================== */

      timeline.call(() => {
        setActiveIndex(index);
      });

      /* =====================================================
         PREPARE NEW IMAGE
      ===================================================== */

      timeline.set(image, {
        opacity: 0,
        x: direction > 0 ? 50 : -50,
        scale: 1.06,
      });

      /* =====================================================
         PREPARE NEW CONTENT

         Navigation controls are NOT touched.
      ===================================================== */

      if (moduleNumber) {
        timeline.set(moduleNumber, {
          opacity: 0,
          x: direction > 0 ? 20 : -20,
        });
      }

      if (title) {
        timeline.set(title, {
          opacity: 0,
          x: direction > 0 ? 32 : -32,
        });
      }

      if (description) {
        timeline.set(description, {
          opacity: 0,
          x: direction > 0 ? 22 : -22,
        });
      }

      /* =====================================================
         ENTER IMAGE
      ===================================================== */

      timeline.to(image, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.62,
        ease: "power3.out",
      });

      /* =====================================================
         ENTER MODULE NUMBER
      ===================================================== */

      if (moduleNumber) {
        timeline.to(
          moduleNumber,
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power3.out",
          },
          "-=0.42",
        );
      }

      /* =====================================================
         ENTER TITLE
      ===================================================== */

      if (title) {
        timeline.to(
          title,
          {
            opacity: 1,
            x: 0,
            duration: 0.46,
            ease: "power4.out",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         ENTER DESCRIPTION
      ===================================================== */

      if (description) {
        timeline.to(
          description,
          {
            opacity: 1,
            x: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          "-=0.24",
        );
      }

      /*
       * IMPORTANT:
       *
       * There is intentionally NO animation here for
       * .curriculum-module-controls.
       *
       * Previous / Counter / Next remain fixed.
       */
    },
    [slides.length, safeActiveIndex, isChanging],
  );

  /* =========================================================
     ENTRANCE / SCROLL ANIMATIONS
  ========================================================= */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * Target the actual SectionHeading.
       */
      const heading = section.querySelector<HTMLElement>(".curriculum-heading");

      const introElement = introRef.current;

      const explorer = explorerRef.current;
      const navigation = navigationRef.current;
      const modules = modulesRef.current;
      const featured = featuredRef.current;
      const image = imageRef.current;
      const content = contentRef.current;
      const controls = controlsRef.current;

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            heading,
            introElement,
            explorer,
            navigation,
            modules,
            featured,
            image,
            content,
            controls,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      /* =====================================================
         HEADING
      ===================================================== */

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
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
              overwrite: true,
            });
          },
        });
      }

      /* =====================================================
         INTRO
      ===================================================== */

      if (introElement) {
        gsap.set(introElement, {
          opacity: 0,
          y: 20,
        });

        ScrollTrigger.create({
          trigger: introElement,
          start: "top 88%",
          once: true,

          onEnter: () => {
            gsap.to(introElement, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: 0.12,
            });
          },
        });
      }

      /* =====================================================
         CURRICULUM EXPLORER
      ===================================================== */

      if (explorer) {
        gsap.set(explorer, {
          opacity: 0,
          y: 36,
        });

        ScrollTrigger.create({
          trigger: explorer,
          start: "top 84%",
          once: true,

          onEnter: () => {
            gsap.to(explorer, {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power4.out",
            });
          },
        });
      }

      /* =====================================================
         LEFT NAVIGATION
      ===================================================== */

      if (navigation) {
        gsap.set(navigation, {
          opacity: 0,
          x: -24,
        });

        ScrollTrigger.create({
          trigger: navigation,
          start: "top 82%",
          once: true,

          onEnter: () => {
            gsap.to(navigation, {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: 0.1,
            });
          },
        });
      }

      /* =====================================================
         MODULE LIST
      ===================================================== */

      if (modules) {
        const moduleItems = Array.from(
          modules.querySelectorAll<HTMLElement>(".curriculum-module"),
        );

        if (moduleItems.length > 0) {
          gsap.set(moduleItems, {
            opacity: 0,
            x: -12,
          });

          ScrollTrigger.create({
            trigger: modules,
            start: "top 82%",
            once: true,

            onEnter: () => {
              gsap.to(moduleItems, {
                opacity: 1,
                x: 0,
                duration: 0.42,
                stagger: 0.055,
                ease: "power3.out",
                delay: 0.18,
              });
            },
          });
        }
      }

      /* =====================================================
         FEATURED AREA
      ===================================================== */

      if (featured) {
        gsap.set(featured, {
          opacity: 0,
          x: 24,
        });

        ScrollTrigger.create({
          trigger: featured,
          start: "top 82%",
          once: true,

          onEnter: () => {
            gsap.to(featured, {
              opacity: 1,
              x: 0,
              duration: 0.75,
              ease: "power3.out",
              delay: 0.14,
            });
          },
        });
      }

      /* =====================================================
         IMAGE INITIAL REVEAL
      ===================================================== */

      if (image) {
        gsap.set(image, {
          scale: 1.08,
        });

        ScrollTrigger.create({
          trigger: image,
          start: "top 82%",
          once: true,

          onEnter: () => {
            gsap.to(image, {
              scale: 1,
              duration: 1.15,
              ease: "power3.out",
              delay: 0.08,
            });
          },
        });
      }

      /* =====================================================
         CONTENT
      ===================================================== */

      if (content) {
        /*
         * Keep the content container fixed.
         *
         * Individual content elements are responsible
         * for module-change animation.
         */
        gsap.set(content, {
          opacity: 1,
          x: 0,
          y: 0,
        });
      }

      /* =====================================================
         CONTROLS INITIAL REVEAL

         This animation happens only when the section
         first enters the viewport.

         It will NOT run during module changes.
      ===================================================== */

      if (controls) {
        gsap.set(controls, {
          opacity: 0,
          y: 12,
        });

        ScrollTrigger.create({
          trigger: controls,
          start: "top 92%",
          once: true,

          onEnter: () => {
            gsap.to(controls, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power3.out",
              delay: 0.2,
            });
          },
        });
      }
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
    <section
      ref={sectionRef}
      className="
        overflow-hidden
        bg-gray-50
      "
    >
      <Container>
        {/* ===================================================
            SECTION INTRO
        =================================================== */}

        <div className="pt-14 sm:pt-18 lg:pt-20">
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[2fr_1fr]
              lg:items-center
              lg:gap-16
              xl:gap-24
            "
          >
            {/* =================================================
                LEFT
            ================================================= */}

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

              {/* =================================================
                  HEADING
              ================================================= */}

              <SectionHeading as="h2" className="curriculum-heading">
                {title}
              </SectionHeading>
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div>
              <p
                ref={introRef}
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
          ref={explorerRef}
          className="
            mt-6
            mb-14
            border-y
            border-gray-200
            bg-white
            sm:mb-18
            lg:mb-20
            will-change-transform
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
                LEFT NAVIGATION
            ================================================= */}

            <div
              ref={navigationRef}
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
                  Course Modules
                </span>
              </div>

              {/* MODULES */}

              <div
                ref={modulesRef}
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
                        curriculum-module
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
                          transition-colors
                          duration-300
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
              ref={featuredRef}
              className="
                grid
                xl:grid-cols-[1.3fr_1.05fr]
                will-change-transform
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
                    className="
                      object-cover
                    "
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
                  overflow-hidden
                  p-6
                  sm:p-8
                  lg:min-h-[500px]
                  lg:p-10
                  xl:min-h-[540px]
                  xl:p-14
                "
              >
                {/* TITLE */}

                <div className="curriculum-module-title">
                  <SectionHeading className="mt-4" as="h3">
                    {activeSlide.title}
                  </SectionHeading>
                </div>

                {/* DESCRIPTION */}

                <p
                  className="
                    curriculum-module-description
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
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
