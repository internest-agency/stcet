"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* =========================================================
   TYPES
========================================================= */

export interface CareerGroup {
  number: string;
  title: string;
  roles: string[];
  image: string;
}

interface CareerPathwaysProps {
  careerTitle: string;
  careerIntro: string;
  careerGroups: CareerGroup[];
}

/* =========================================================
   CAREER CARD
========================================================= */

function CareerCard({
  group,
  isDecorative = false,
}: {
  group: CareerGroup;
  isDecorative?: boolean;
}) {
  return (
    <article
      tabIndex={isDecorative ? -1 : undefined}
      aria-hidden={isDecorative ? true : undefined}
      className="
        career-marquee-card
        group
        relative
        aspect-4/3
        w-75
        shrink-0
        overflow-hidden
        bg-gray-950
        transition-transform
        duration-500
        ease-out
        hover:-translate-y-1
        hover:shadow-2xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent-400
        focus-visible:ring-offset-2
        sm:w-90
        lg:w-125
        xl:w-135
      "
    >
      {/* IMAGE */}

      <Image
        src={group.image}
        alt={isDecorative ? "" : group.title}
        fill
        sizes="
          (max-width: 640px) 300px,
          (max-width: 1024px) 360px,
          500px
        "
        draggable={false}
        className="
          pointer-events-none
          object-cover
          transition-transform
          duration-1000
          ease-out
          group-hover:scale-[1.06]
        "
      />

      {/* IMAGE READABILITY GRADIENT */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-linear-to-b
          from-black/5
          via-black/10
          to-black/90
        "
      />

      {/* BOTTOM GRADIENT */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-1/2
          bg-linear-to-t
          from-black/80
          to-transparent
        "
      />

      {/* CARD CONTENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-10
          p-5
          sm:p-6
          lg:p-7
        "
      >
        {/* LABEL */}

        <div className="mb-3 flex items-center gap-3">
          <span
            className="
              font-mono
              text-[10px]
              font-bold
              tracking-[0.16em]
              text-accent-400
            "
          >
            {group.number}
          </span>

          <span className="h-px w-7 bg-white/30" />

          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/55
            "
          >
            Career Pathway
          </span>
        </div>

        {/* TITLE */}

        <h3
          className="
            max-w-107.5
            text-[24px]
            font-extrabold
            uppercase
            leading-[0.98]
            tracking-[-0.04em]
            text-white
            transition-transform
            duration-500
            ease-out
            group-hover:translate-x-1
            sm:text-[28px]
            lg:text-[34px]
          "
        >
          {group.title}
        </h3>

        {/* ROLES */}

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {group.roles.map((role) => (
            <span
              key={role}
              className="
                text-[11px]
                font-medium
                leading-5
                text-white/65
                sm:text-xs
              "
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CareerPathways({
  careerTitle,
  careerIntro,
  careerGroups,
}: CareerPathwaysProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const marqueeRef = useRef<HTMLDivElement>(null);

  /*
   * =======================================================
   * MARQUEE ENGINE
   * =======================================================
   */

  const positionRef = useRef(0);

  const firstSetWidthRef = useRef(0);

  const animationFrameRef = useRef<number | null>(null);

  const lastFrameTimeRef = useRef<number | null>(null);

  const autoSpeedRef = useRef(-45);

  const isInViewportRef = useRef(true);

  const isDraggingRef = useRef(false);

  const isArrowAnimatingRef = useRef(false);

  /*
   * =======================================================
   * DRAG STATE
   * =======================================================
   */

  const pointerIdRef = useRef<number | null>(null);

  const dragStartXRef = useRef(0);

  const dragStartPositionRef = useRef(0);

  const lastPointerXRef = useRef(0);

  const lastPointerTimeRef = useRef(0);

  const velocityRef = useRef(0);

  const inertiaFrameRef = useRef<number | null>(null);

  /*
   * =======================================================
   * UI STATE
   * =======================================================
   */

  const [isDragging, setIsDragging] = useState(false);

  /*
   * =======================================================
   * NORMALIZE POSITION
   * =======================================================
   *
   * Keeps the duplicated marquee seamless.
   *
   * Example:
   *
   * 0
   * -500
   * -1000
   * then loops back to
   * 0
   *
   * without a visible jump.
   */

  const normalizePosition = useCallback((value: number) => {
    const width = firstSetWidthRef.current;

    if (!width) {
      return value;
    }

    let normalized = value % width;

    if (normalized > 0) {
      normalized -= width;
    }

    return normalized;
  }, []);

  /*
   * =======================================================
   * SET POSITION
   * =======================================================
   */

  const setPosition = useCallback(
    (value: number) => {
      const marquee = marqueeRef.current;

      if (!marquee) {
        return;
      }

      const normalized = normalizePosition(value);

      positionRef.current = normalized;

      gsap.set(marquee, {
        x: normalized,
      });
    },
    [normalizePosition],
  );

  /*
   * =======================================================
   * STOP INERTIA
   * =======================================================
   */

  const stopInertia = useCallback(() => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);

      inertiaFrameRef.current = null;
    }

    velocityRef.current = 0;
  }, []);

  /*
   * =======================================================
   * AUTO MARQUEE LOOP
   * =======================================================
   */

  const startMarquee = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    lastFrameTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const marquee = marqueeRef.current;

      if (!marquee) {
        animationFrameRef.current = null;

        return;
      }

      const previousTime = lastFrameTimeRef.current ?? currentTime;

      const delta = Math.min(currentTime - previousTime, 50);

      lastFrameTimeRef.current = currentTime;

      /*
       * Only move automatically when:
       *
       * - visible
       * - not dragging
       * - not using arrow
       */

      if (
        isInViewportRef.current &&
        !isDraggingRef.current &&
        !isArrowAnimatingRef.current
      ) {
        const movement = (autoSpeedRef.current * delta) / 1000;

        setPosition(positionRef.current + movement);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [setPosition]);

  /*
   * =======================================================
   * STOP MARQUEE LOOP
   * =======================================================
   */

  const stopMarquee = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }

    lastFrameTimeRef.current = null;
  }, []);

  /*
   * =======================================================
   * INERTIA
   * =======================================================
   */

  const startInertia = useCallback(() => {
    stopInertia();

    let velocity = velocityRef.current;

    /*
     * Convert pointer velocity
     * into visual momentum.
     */

    velocity *= 1.25;

    /*
     * Ignore tiny movement.
     */

    if (Math.abs(velocity) < 0.05) {
      velocityRef.current = 0;

      return;
    }

    const animate = () => {
      if (isDraggingRef.current || isArrowAnimatingRef.current) {
        inertiaFrameRef.current = null;

        return;
      }

      /*
       * Apply velocity.
       */

      setPosition(positionRef.current + velocity);

      /*
       * Friction.
       */

      velocity *= 0.94;

      velocityRef.current = velocity;

      if (Math.abs(velocity) > 0.05) {
        inertiaFrameRef.current = requestAnimationFrame(animate);
      } else {
        velocityRef.current = 0;

        inertiaFrameRef.current = null;
      }
    };

    inertiaFrameRef.current = requestAnimationFrame(animate);
  }, [setPosition, stopInertia]);

  /*
   * =======================================================
   * ARROW NAVIGATION
   * =======================================================
   */

  const moveMarquee = useCallback(
    (direction: "left" | "right") => {
      stopInertia();

      isArrowAnimatingRef.current = true;

      const card = marqueeRef.current?.querySelector<HTMLElement>(
        ".career-marquee-card",
      );

      if (!card) {
        isArrowAnimatingRef.current = false;

        return;
      }

      const styles = marqueeRef.current
        ? window.getComputedStyle(marqueeRef.current)
        : null;

      const gap = styles ? parseFloat(styles.columnGap) || 16 : 16;

      const distance = card.getBoundingClientRect().width + gap;

      const target =
        direction === "left"
          ? positionRef.current - distance
          : positionRef.current + distance;

      const normalizedTarget = normalizePosition(target);

      const current = positionRef.current;

      /*
       * Use a relative movement so
       * the arrow never causes a
       * visible backwards jump.
       */

      let difference = normalizedTarget - current;

      const width = firstSetWidthRef.current;

      if (width) {
        if (difference > width / 2) {
          difference -= width;
        }

        if (difference < -width / 2) {
          difference += width;
        }
      }

      const finalTarget = current + difference;

      gsap.to(
        { value: current },
        {
          value: finalTarget,
          duration: 0.7,
          ease: "power3.out",

          onUpdate: function () {
            setPosition(this.targets()[0].value);
          },

          onComplete: () => {
            isArrowAnimatingRef.current = false;

            /*
             * Continue automatic marquee.
             */

            lastFrameTimeRef.current = performance.now();
          },
        },
      );
    },
    [normalizePosition, setPosition, stopInertia],
  );

  /*
   * =======================================================
   * POINTER DOWN
   * =======================================================
   */

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    /*
     * Only primary mouse button.
     */

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const marquee = marqueeRef.current;

    if (!marquee) {
      return;
    }

    /*
     * Stop all competing movement.
     */

    stopInertia();

    isArrowAnimatingRef.current = false;

    isDraggingRef.current = true;

    setIsDragging(true);

    pointerIdRef.current = event.pointerId;

    dragStartXRef.current = event.clientX;

    dragStartPositionRef.current = positionRef.current;

    lastPointerXRef.current = event.clientX;

    lastPointerTimeRef.current = performance.now();

    velocityRef.current = 0;

    marquee.setPointerCapture(event.pointerId);
  };

  /*
   * =======================================================
   * POINTER MOVE
   * =======================================================
   */

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    const currentX = event.clientX;

    const currentTime = performance.now();

    /*
     * Distance from initial
     * pointer position.
     */

    const distance = currentX - dragStartXRef.current;

    /*
     * Move exactly with the
     * pointer.
     */

    setPosition(dragStartPositionRef.current + distance);

    /*
     * Calculate velocity.
     */

    const deltaX = currentX - lastPointerXRef.current;

    const deltaTime = currentTime - lastPointerTimeRef.current;

    if (deltaTime > 0) {
      const instantVelocity = deltaX / deltaTime;

      /*
       * Smooth velocity.
       */

      velocityRef.current = velocityRef.current * 0.7 + instantVelocity * 0.3;
    }

    lastPointerXRef.current = currentX;

    lastPointerTimeRef.current = currentTime;
  };

  /*
   * =======================================================
   * POINTER UP
   * =======================================================
   */

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const marquee = marqueeRef.current;

    if (!marquee) {
      return;
    }

    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    isDraggingRef.current = false;

    setIsDragging(false);

    pointerIdRef.current = null;

    if (marquee.hasPointerCapture(event.pointerId)) {
      marquee.releasePointerCapture(event.pointerId);
    }

    /*
     * Give the drag some momentum.
     */

    velocityRef.current *= 28;

    startInertia();
  };

  /*
   * =======================================================
   * POINTER CANCEL
   * =======================================================
   */

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const marquee = marqueeRef.current;

    if (!marquee) {
      return;
    }

    isDraggingRef.current = false;

    setIsDragging(false);

    pointerIdRef.current = null;

    if (marquee.hasPointerCapture(event.pointerId)) {
      marquee.releasePointerCapture(event.pointerId);
    }

    stopInertia();
  };

  /*
   * =======================================================
   * GSAP INTRO + VISIBILITY
   * =======================================================
   */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const marquee = marqueeRef.current;

    if (!section || !marquee) {
      return;
    }

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * =================================================
       * REDUCED MOTION
       * =================================================
       */

      if (reducedMotion) {
        const elements = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll(
            `
                    [data-career-label],
                    [data-career-heading],
                    [data-career-intro],
                    [data-career-marquee]
                  `,
          ),
        );

        if (elements.length) {
          gsap.set(elements, {
            clearProps: "all",
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateX: 0,
          });
        }

        return;
      }

      /*
       * ===============================================
       * CAREER LABEL
       * ===============================================
       */

      const careerLabel = section.querySelector<HTMLElement>(
        "[data-career-label]",
      );

      if (careerLabel) {
        const dot = careerLabel.querySelector<HTMLElement>("[data-career-dot]");

        const text = careerLabel.querySelector<HTMLElement>(
          "[data-career-label-text]",
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: careerLabel,
            start: "top 90%",
            once: true,
          },
        });

        if (dot) {
          timeline.fromTo(
            dot,
            {
              scale: 0,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: "back.out(2.5)",
            },
          );
        }

        if (text) {
          timeline.fromTo(
            text,
            {
              opacity: 0,
              x: -15,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.55,
              ease: "power3.out",
            },
            "-=0.25",
          );
        }
      }

      /*
       * ===============================================
       * CAREER HEADING
       * ===============================================
       */

      const careerHeading = section.querySelector<HTMLElement>(
        "[data-career-heading]",
      );

      if (careerHeading) {
        const split = SplitText.create(careerHeading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        gsap.set(split.lines, {
          yPercent: 110,
          rotateX: -65,
          transformOrigin: "50% 100%",
        });

        gsap.to(split.lines, {
          yPercent: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: careerHeading,
            start: "top 84%",
            once: true,
          },
        });
      }

      /*
       * ===============================================
       * INTRO
       * ===============================================
       */

      const careerIntroElement = section.querySelector<HTMLElement>(
        "[data-career-intro]",
      );

      if (careerIntroElement) {
        gsap.fromTo(
          careerIntroElement,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: careerIntroElement,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      /*
       * ===============================================
       * MARQUEE REVEAL
       * ===============================================
       */

      const marqueeWrapper = section.querySelector<HTMLElement>(
        "[data-career-marquee]",
      );

      if (marqueeWrapper) {
        gsap.fromTo(
          marqueeWrapper,
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: marqueeWrapper,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      /*
       * ===============================================
       * CARD ENTRANCE
       * ===============================================
       */

      const cards = Array.from(
        section.querySelectorAll<HTMLElement>(".career-marquee-card"),
      );

      if (cards.length) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            scale: 0.94,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: marquee,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      /*
       * ===============================================
       * VIEWPORT VISIBILITY
       * ===============================================
       */

      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",

        onEnter: () => {
          isInViewportRef.current = true;
        },

        onEnterBack: () => {
          isInViewportRef.current = true;
        },

        onLeave: () => {
          isInViewportRef.current = false;
        },

        onLeaveBack: () => {
          isInViewportRef.current = false;
        },
      });

      /*
       * ===============================================
       * START MARQUEE
       * ===============================================
       */

      requestAnimationFrame(() => {
        const width = marquee.scrollWidth / 2;

        firstSetWidthRef.current = width;

        if (width > 0) {
          startMarquee();
        }
      });
    }, section);

    return () => {
      context.revert();
    };
  }, [startMarquee]);

  /*
   * =======================================================
   * CLEANUP
   * =======================================================
   */

  useEffect(() => {
    return () => {
      stopMarquee();
      stopInertia();
    };
  }, [stopMarquee, stopInertia]);

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <div ref={sectionRef}>
      <section className="overflow-hidden bg-gray-50">
        <Container>
          <div className="pb-6 pt-14 sm:pt-18 lg:pt-20">
            {/* HEADER */}

            <div
              className="
                grid
                gap-6
                lg:grid-cols-[2fr_1fr]
                lg:items-center
                lg:gap-20
                xl:gap-28
              "
            >
              {/* LEFT */}

              <div>
                <div
                  data-career-label
                  className="
                    mb-5
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    data-career-dot
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
                    data-career-label-text
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-primary-700
                    "
                  >
                    Career Pathways
                  </span>
                </div>

                <div data-career-heading>
                  <SectionHeading as="h2">{careerTitle}</SectionHeading>
                </div>
              </div>

              {/* RIGHT */}

              <p
                data-career-intro
                className="
                  max-w-xl
                  text-[14px]
                  leading-6
                  text-gray-500
                  sm:text-[15px]
                  sm:leading-7
                  lg:text-[16px]
                  lg:leading-7
                "
              >
                {careerIntro}
              </p>
            </div>
          </div>
        </Container>

        {/* ===================================================
            MARQUEE
        =================================================== */}

        <div
          data-career-marquee
          className="
            relative
            w-full
            overflow-hidden
            border-y
            border-gray-200
            pb-14
            sm:pb-18
            lg:pb-20
          "
        >
          {/* =================================================
              ARROW BUTTONS
          ================================================= */}

          <div
            className="
              absolute
              right-5
              top-5
              z-30
              flex
              gap-2
              sm:right-8
              sm:top-6
              lg:right-10
              lg:top-7
            "
          >
            {/* LEFT */}

            <button
              type="button"
              aria-label="Previous career pathway"
              onClick={() => moveMarquee("right")}
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                border
                border-primary-800/20
                bg-white/90
                text-primary-800
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-primary-800
                hover:bg-primary-800
                hover:text-white
                active:scale-95
                sm:size-11
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* RIGHT */}

            <button
              type="button"
              aria-label="Next career pathway"
              onClick={() => moveMarquee("left")}
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                border
                border-primary-800/20
                bg-white/90
                text-primary-800
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-primary-800
                hover:bg-primary-800
                hover:text-white
                active:scale-95
                sm:size-11
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* =================================================
              DRAG AREA
          ================================================= */}

          <div
            ref={marqueeRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`
              flex
              w-max
              gap-4
              py-5
              select-none
              touch-pan-y
              ${isDragging ? "cursor-grabbing" : "cursor-grab"}
              sm:gap-5
              sm:py-6
            `}
          >
            {[...careerGroups, ...careerGroups].map((group, index) => (
              <CareerCard
                key={`${group.number}-${index}`}
                group={group}
                isDecorative={index >= careerGroups.length}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
