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

export interface LaboratoryItem {
  number: string;
  title: string;
  description: string;
  image: string;
}

interface InteractiveLaboratoryExplorerProps {
  title?: string;
  intro?: string;
  laboratories?: LaboratoryItem[];
}

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultLaboratories: LaboratoryItem[] = [
  {
    number: "01",
    title: "Computer Science & IT Labs",
    description:
      "Programming, computing and technology-based practical learning.",
    image: "/images/infrastructure/laboratories/computer-science-it.webp",
  },
  {
    number: "02",
    title: "AI & ML Labs",
    description:
      "Practical exposure to artificial intelligence, machine learning and emerging technologies.",
    image: "/images/infrastructure/laboratories/ai-ml.webp",
  },
  {
    number: "03",
    title: "Electronics & Communication Labs",
    description:
      "Hands-on learning in electronics, communication systems and embedded technologies.",
    image: "/images/infrastructure/laboratories/ece.webp",
  },
  {
    number: "04",
    title: "Electrical & Electronics Labs",
    description:
      "Practical learning in electrical systems, circuits and engineering applications.",
    image: "/images/infrastructure/laboratories/eee.webp",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function InteractiveLaboratoryExplorer({
  title = "Explore the spaces where engineering comes to life.",
  intro = "STCET's laboratories give students opportunities to experiment, observe and apply engineering concepts through practical learning.",
  laboratories = defaultLaboratories,
}: InteractiveLaboratoryExplorerProps) {
  /* =========================================================
     REFS
  ========================================================= */

  const sectionRef = useRef<HTMLElement>(null);

  const explorerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const slideTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const pendingDirectionRef = useRef<1 | -1>(1);

  const hasMountedRef = useRef(false);

  /* =========================================================
     STATE
  ========================================================= */

  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  /* =========================================================
     SAFE INDEX
  ========================================================= */

  const safeActiveIndex =
    laboratories.length > 0
      ? Math.min(activeIndex, laboratories.length - 1)
      : 0;

  const activeLaboratory = laboratories[safeActiveIndex];

  const totalLabs = String(laboratories.length).padStart(2, "0");

  /* =========================================================
     SELECT LABORATORY
  ========================================================= */

  const selectLaboratory = useCallback(
    (index: number) => {
      if (
        laboratories.length === 0 ||
        index === safeActiveIndex ||
        isChanging
      ) {
        return;
      }

      const image = imageRef.current;
      const content = contentRef.current;

      if (!image || !content) {
        pendingDirectionRef.current = index > safeActiveIndex ? 1 : -1;

        setActiveIndex(index);
        return;
      }

      /* =====================================================
         DIRECTION
      ===================================================== */

      const direction: 1 | -1 = index > safeActiveIndex ? 1 : -1;

      pendingDirectionRef.current = direction;

      setIsChanging(true);

      /* =====================================================
         KILL CURRENT TIMELINE
      ===================================================== */

      slideTimelineRef.current?.kill();

      /* =====================================================
         CURRENT CONTENT
      ===================================================== */

      const number = content.querySelector<HTMLElement>(".laboratory-number");

      const title = content.querySelector<HTMLElement>(".laboratory-title");

      const description = content.querySelector<HTMLElement>(
        ".laboratory-description",
      );

      const animatedContent = [number, title, description].filter(
        (element): element is HTMLElement => Boolean(element),
      );

      /* =====================================================
         SOFT EXIT
      ===================================================== */

      const exitX = direction > 0 ? -18 : 18;

      const timeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },

        onComplete: () => {
          slideTimelineRef.current = null;
        },
      });

      slideTimelineRef.current = timeline;

      /* TEXT EXIT */

      if (animatedContent.length > 0) {
        timeline.to(animatedContent, {
          opacity: 0.2,
          x: exitX,
          duration: 0.3,
          stagger: 0.035,
          ease: "power2.out",
        });
      }

      /* IMAGE EXIT */

      timeline.to(
        image,
        {
          opacity: 0.45,
          x: direction > 0 ? -20 : 20,
          scale: 1.015,
          duration: 0.42,
          ease: "power2.inOut",
        },
        "<0.04",
      );

      /* =====================================================
         UPDATE REACT STATE

         The NEW CONTENT animation is intentionally NOT
         started here.

         React must render activeLaboratory first.
      ===================================================== */

      timeline.call(() => {
        setActiveIndex(index);
      });
    },
    [laboratories.length, safeActiveIndex, isChanging],
  );

  /* =========================================================
     NEW CONTENT ENTRANCE

     Runs AFTER activeLaboratory has rendered.
  ========================================================= */

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const image = imageRef.current;
    const content = contentRef.current;

    if (!image || !content || !activeLaboratory) {
      setIsChanging(false);
      return;
    }

    const direction = pendingDirectionRef.current;

    /* =====================================================
       NEW ELEMENTS
    ===================================================== */

    const number = content.querySelector<HTMLElement>(".laboratory-number");

    const title = content.querySelector<HTMLElement>(".laboratory-title");

    const description = content.querySelector<HTMLElement>(
      ".laboratory-description",
    );

    slideTimelineRef.current?.kill();

    /* =====================================================
       PREPARE IMAGE
    ===================================================== */

    gsap.set(image, {
      opacity: 0.45,
      x: direction > 0 ? 20 : -20,
      scale: 1.015,
    });

    /* =====================================================
       PREPARE CONTENT
    ===================================================== */

    if (number) {
      gsap.set(number, {
        opacity: 0,
        x: direction > 0 ? 12 : -12,
      });
    }

    if (title) {
      gsap.set(title, {
        opacity: 0,
        x: direction > 0 ? 18 : -18,
      });
    }

    if (description) {
      gsap.set(description, {
        opacity: 0,
        x: direction > 0 ? 14 : -14,
      });
    }

    /* =====================================================
       ENTER TIMELINE
    ===================================================== */

    const timeline = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },

      onComplete: () => {
        slideTimelineRef.current = null;

        setIsChanging(false);

        gsap.set(image, {
          opacity: 1,
          x: 0,
          scale: 1,
        });

        if (number) {
          gsap.set(number, {
            opacity: 1,
            x: 0,
          });
        }

        if (title) {
          gsap.set(title, {
            opacity: 1,
            x: 0,
          });
        }

        if (description) {
          gsap.set(description, {
            opacity: 1,
            x: 0,
          });
        }
      },
    });

    slideTimelineRef.current = timeline;

    /* IMAGE */

    timeline.to(image, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
    });

    /* NUMBER */

    if (number) {
      timeline.to(
        number,
        {
          opacity: 1,
          x: 0,
          duration: 0.42,
          ease: "power3.out",
        },
        "-=0.48",
      );
    }

    /* TITLE */

    if (title) {
      timeline.to(
        title,
        {
          opacity: 1,
          x: 0,
          duration: 0.52,
          ease: "power4.out",
        },
        "-=0.28",
      );
    }

    /* DESCRIPTION */

    if (description) {
      timeline.to(
        description,
        {
          opacity: 1,
          x: 0,
          duration: 0.48,
          ease: "power3.out",
        },
        "-=0.28",
      );
    }

    return () => {
      timeline.kill();
    };
  }, [activeIndex, activeLaboratory]);

  /* =========================================================
     ENTRANCE ANIMATIONS
  ========================================================= */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = headingRef.current;
      const intro = introRef.current;
      const explorer = explorerRef.current;
      const navigation = navigationRef.current;
      const modules = modulesRef.current;
      const featured = featuredRef.current;
      const image = imageRef.current;
      const controls = controlsRef.current;

      if (
        !heading ||
        !intro ||
        !explorer ||
        !navigation ||
        !modules ||
        !featured ||
        !image ||
        !controls
      ) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            heading,
            intro,
            explorer,
            navigation,
            modules,
            featured,
            image,
            controls,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      /* =====================================================
         INITIAL STATES
      ===================================================== */

      gsap.set(intro, {
        opacity: 0,
        y: 20,
      });

      gsap.set(explorer, {
        opacity: 0,
        y: 32,
      });

      gsap.set(navigation, {
        opacity: 0,
        x: -20,
      });

      gsap.set(featured, {
        opacity: 0,
        x: 20,
      });

      gsap.set(image, {
        scale: 1.06,
      });

      gsap.set(controls, {
        opacity: 0,
        y: 12,
      });

      /* =====================================================
         HEADING
      ===================================================== */

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      gsap.set(split.lines, {
        yPercent: 105,
      });

      /* =====================================================
         MAIN TIMELINE
      ===================================================== */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      /* HEADING */

      timeline.to(
        split.lines,
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out",
        },
        0,
      );

      /* INTRO */

      timeline.to(
        intro,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        0.22,
      );

      /* EXPLORER */

      timeline.to(
        explorer,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
        },
        0.3,
      );

      /* NAVIGATION */

      timeline.to(
        navigation,
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        0.5,
      );

      /* FEATURED */

      timeline.to(
        featured,
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.55,
      );

      /* IMAGE */

      timeline.to(
        image,
        {
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
        },
        0.5,
      );

      /* CONTROLS */

      timeline.to(
        controls,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        },
        0.8,
      );
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
    if (laboratories.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();

      selectLaboratory(index === laboratories.length - 1 ? 0 : index + 1);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();

      selectLaboratory(index === 0 ? laboratories.length - 1 : index - 1);
    }
  };

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!activeLaboratory) {
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
        py-20
        sm:py-24
        lg:py-28
      "
    >
      <Container>
        {/* =================================================
            SECTION INTRO
        ================================================= */}

        <div
          className="
            grid
            gap-7
            lg:grid-cols-[0.95fr_1.05fr]
            lg:items-end
            lg:gap-16
            xl:gap-24
          "
        >
          {/* LEFT */}

          <div ref={headingRef}>
            <div
              className="
                mb-5
                flex
                items-center
                gap-3
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
                  tracking-[0.22em]
                  text-primary-700
                  sm:text-[11px]
                "
              >
                Laboratory Facilities
              </span>
            </div>

            <SectionHeading as="h2" className="max-w-2xl">
              {title}
            </SectionHeading>
          </div>

          {/* RIGHT */}

          <p
            ref={introRef}
            className="
              max-w-xl
              text-[14px]
              leading-6
              text-gray-500
              sm:text-[15px]
              sm:leading-7
              lg:text-[16px]
              lg:leading-8
            "
          >
            {intro}
          </p>
        </div>

        {/* =================================================
            EXPLORER
        ================================================= */}

        <div
          ref={explorerRef}
          className="
            my-12
            overflow-hidden
            border-y
            border-gray-200
            bg-white
            sm:my-16
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
                  Laboratory Areas
                </span>
              </div>

              {/* MODULE LIST */}

              <div
                ref={modulesRef}
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-1
                "
              >
                {laboratories.map((laboratory, index) => {
                  const isActive = index === safeActiveIndex;

                  return (
                    <button
                      key={`${laboratory.number}-${laboratory.title}`}
                      type="button"
                      onClick={() => selectLaboratory(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      aria-current={isActive ? "true" : undefined}
                      disabled={isChanging}
                      className={`
                          laboratory-module
                          group
                          relative
                          flex
                          min-h-14
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
                        {laboratory.number}
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
                        {laboratory.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                FEATURED AREA
            ================================================= */}

            <div
              ref={featuredRef}
              className="
                grid
                lg:grid-cols-[1fr_1fr]
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
                  bg-gray-100
                  lg:aspect-auto
                  lg:min-h-[520px]
                  lg:border-b-0
                  lg:border-r
                  xl:min-h-[560px]
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
                    key={activeLaboratory.image}
                    src={activeLaboratory.image}
                    alt={activeLaboratory.title}
                    fill
                    sizes="
                      (max-width: 1023px) 100vw,
                      42vw
                    "
                    className="
                      object-cover
                    "
                  />

                  {/* IMAGE OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/5
                    "
                  />

                  {/* IMAGE NUMBER */}

                  <div
                    className="
                      absolute
                      left-5
                      top-5
                      flex
                      items-center
                      gap-3
                      sm:left-7
                      sm:top-7
                    "
                  >
                    <span
                      className="
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-[0.15em]
                        text-white/70
                      "
                    >
                      {activeLaboratory.number}
                    </span>

                    <span
                      className="
                        h-px
                        w-8
                        bg-white/40
                      "
                    />
                  </div>

                  {/* IMAGE LABEL */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      bg-primary-800
                      px-5
                      py-3
                      sm:px-6
                      sm:py-4
                    "
                  >
                    <span
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-white/65
                      "
                    >
                      Practical Learning
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div
                ref={contentRef}
                className="
                  flex
                  min-h-[340px]
                  flex-col
                  justify-center
                  overflow-hidden
                  p-6
                  sm:p-8
                  lg:min-h-[520px]
                  lg:p-10
                  xl:min-h-[560px]
                  xl:p-14
                "
              >
                {/* NUMBER */}

                <span
                  className="
                    laboratory-number
                    font-mono
                    text-[10px]
                    font-bold
                    tracking-[0.15em]
                    text-accent-400
                  "
                >
                  LABORATORY {activeLaboratory.number}
                </span>

                {/* TITLE */}

                <div className="laboratory-title">
                  <SectionHeading as="h3" className="mt-4 max-w-xl">
                    {activeLaboratory.title}
                  </SectionHeading>
                </div>

                {/* DESCRIPTION */}

                <p
                  className="
                    laboratory-description
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
                  {activeLaboratory.description}
                </p>

                {/* =================================================
                    FIXED CONTROLS
                ================================================= */}

                <div
                  ref={controlsRef}
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
                      selectLaboratory(
                        safeActiveIndex === 0
                          ? laboratories.length - 1
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
                    {activeLaboratory.number} / {totalLabs}
                  </span>

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={isChanging}
                    onClick={() =>
                      selectLaboratory(
                        safeActiveIndex === laboratories.length - 1
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
