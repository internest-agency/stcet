"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

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
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [canScrollRight, setCanScrollRight] = useState(false);

  /*
   * =========================================================
   * DRAG STATE
   * =========================================================
   */

  const isDraggingRef = useRef(false);

  const pointerIdRef = useRef<number | null>(null);

  const startXRef = useRef(0);

  const startScrollLeftRef = useRef(0);

  const lastXRef = useRef(0);

  const lastTimeRef = useRef(0);

  const velocityRef = useRef(0);

  const animationFrameRef = useRef<number | null>(null);

  /*
   * =========================================================
   * UPDATE BUTTON STATE
   * =========================================================
   */

  const updateScrollState = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    setCanScrollLeft(carousel.scrollLeft > 2);

    setCanScrollRight(carousel.scrollLeft < maxScroll - 2);
  }, []);

  /*
   * =========================================================
   * STOP INERTIA
   * =========================================================
   */

  const stopInertia = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }

    velocityRef.current = 0;
  }, []);

  /*
   * =========================================================
   * START INERTIA
   * =========================================================
   */

  const startInertia = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    let velocity = velocityRef.current;

    /*
     * Don't start inertia for a very small movement.
     */

    if (Math.abs(velocity) < 0.1) {
      velocityRef.current = 0;
      return;
    }

    const animate = () => {
      const currentCarousel = carouselRef.current;

      if (!currentCarousel) {
        animationFrameRef.current = null;

        return;
      }

      /*
       * Apply velocity.
       */

      currentCarousel.scrollLeft -= velocity;

      /*
       * Friction.
       *
       * Smaller value = longer glide.
       * Larger value = stops faster.
       */

      velocity *= 0.94;

      velocityRef.current = velocity;

      updateScrollState();

      /*
       * Stop at the edges.
       */

      const maxScroll =
        currentCarousel.scrollWidth - currentCarousel.clientWidth;

      if (
        currentCarousel.scrollLeft <= 0 ||
        currentCarousel.scrollLeft >= maxScroll
      ) {
        velocityRef.current = 0;

        animationFrameRef.current = null;

        return;
      }

      /*
       * Continue while there is meaningful velocity.
       */

      if (Math.abs(velocity) > 0.1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        velocityRef.current = 0;

        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateScrollState]);

  /*
   * =========================================================
   * BUTTON SCROLL
   * =========================================================
   */

  const scrollCarousel = useCallback(
    (direction: "left" | "right") => {
      const carousel = carouselRef.current;

      if (!carousel) {
        return;
      }

      stopInertia();

      const card = carousel.querySelector<HTMLElement>(".why-study-card");

      if (!card) {
        return;
      }

      const cardWidth = card.getBoundingClientRect().width;

      const styles = window.getComputedStyle(carousel);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 24;

      const distance = cardWidth + gap;

      carousel.scrollBy({
        left: direction === "right" ? distance : -distance,
        behavior: "smooth",
      });
    },
    [stopInertia],
  );

  /*
   * =========================================================
   * POINTER DOWN
   * =========================================================
   */

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    /*
     * Only respond to the primary mouse button.
     */

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    stopInertia();

    isDraggingRef.current = true;

    pointerIdRef.current = event.pointerId;

    startXRef.current = event.clientX;

    startScrollLeftRef.current = carousel.scrollLeft;

    lastXRef.current = event.clientX;

    lastTimeRef.current = performance.now();

    velocityRef.current = 0;

    carousel.setPointerCapture(event.pointerId);

    carousel.classList.add("is-dragging");
  };

  /*
   * =========================================================
   * POINTER MOVE
   * =========================================================
   */

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (!carousel || !isDraggingRef.current) {
      return;
    }

    /*
     * Make sure this is the pointer
     * that started the drag.
     */

    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    const currentX = event.clientX;

    const currentTime = performance.now();

    /*
     * Distance from drag start.
     */

    const distance = currentX - startXRef.current;

    /*
     * Directly follow the pointer.
     */

    carousel.scrollLeft = startScrollLeftRef.current - distance;

    /*
     * Calculate velocity.
     */

    const deltaX = currentX - lastXRef.current;

    const deltaTime = currentTime - lastTimeRef.current;

    if (deltaTime > 0) {
      const instantVelocity = deltaX / deltaTime;

      /*
       * Smooth the velocity rather than
       * using only the latest movement.
       */

      velocityRef.current = velocityRef.current * 0.65 + instantVelocity * 0.35;
    }

    lastXRef.current = currentX;

    lastTimeRef.current = currentTime;

    updateScrollState();
  };

  /*
   * =========================================================
   * POINTER UP
   * =========================================================
   */

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    isDraggingRef.current = false;

    pointerIdRef.current = null;

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    carousel.classList.remove("is-dragging");

    /*
     * Convert pointer velocity into
     * smooth momentum.
     *
     * The negative value is required
     * because scrollLeft moves opposite
     * to pointer movement.
     */

    velocityRef.current *= 32;

    startInertia();

    updateScrollState();
  };

  /*
   * =========================================================
   * POINTER CANCEL
   * =========================================================
   */

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    isDraggingRef.current = false;

    pointerIdRef.current = null;

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    carousel.classList.remove("is-dragging");

    stopInertia();

    updateScrollState();
  };

  /*
   * =========================================================
   * INTRO ANIMATION
   * =========================================================
   */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const items = section.querySelectorAll<HTMLElement>("[data-intro-item]");

      if (!items.length) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(items, {
          opacity: 1,
          y: 0,
        });

        return;
      }

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  /*
   * =========================================================
   * SCROLL STATE
   * =========================================================
   */

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    const handleResize = () => {
      updateScrollState();
    };

    carousel.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      carousel.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleResize);
    };
  }, [reasons, updateScrollState]);

  /*
   * =========================================================
   * CLEANUP
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section
      ref={sectionRef}
      className="
        overflow-hidden
        bg-gray-100
        text-gray-900
      "
    >
      <Container>
        <div
          className="
            py-16
            sm:py-20
            lg:py-24
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="max-w-5xl">
            {/* Label */}

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
                  text-gray-600
                "
              >
                {label}
              </span>
            </div>

            {/* Heading */}

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

            {/* Description */}

            <p
              data-intro-item
              className="
                mt-5
                max-w-2xl
                text-[14px]
                leading-6
                text-gray-600
                sm:mt-6
                sm:text-[15px]
                sm:leading-7
                lg:text-[16px]
                lg:leading-7
              "
            >
              {intro}
            </p>
          </div>

          {/* =================================================
              CAROUSEL
          ================================================= */}

          <div className="mt-10 sm:mt-12 lg:mt-14">
            {/* Divider */}

            <div
              className="
                mb-6
                h-px
                w-full
                bg-gray-300
              "
            />

            {/* Toolbar */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <p
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-gray-500
                "
              >
                Explore the benefits
              </p>

              {/* Navigation */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                {/* Previous */}

                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous benefit"
                  className="
                    flex
                    size-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-300
                    bg-white
                    text-primary-800
                    transition-all
                    duration-300
                    hover:border-primary-800
                    hover:bg-primary-800
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-30
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

                {/* Next */}

                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  disabled={!canScrollRight}
                  aria-label="Next benefit"
                  className="
                    flex
                    size-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-300
                    bg-white
                    text-primary-800
                    transition-all
                    duration-300
                    hover:border-primary-800
                    hover:bg-primary-800
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-30
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
            </div>

            {/* =================================================
                CAROUSEL VIEWPORT
            ================================================= */}

            <div
              ref={carouselRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="
                why-study-carousel
                flex
                cursor-grab
                select-none
                gap-4
                overflow-x-auto
                overscroll-x-contain
                pb-5
                snap-x
                snap-mandatory
                touch-pan-x
                scrollbar-none
                sm:gap-5
                lg:gap-6
              "
            >
              {reasons.map((reason) => (
                <article
                  key={reason.number}
                  className="
                      why-study-card
                      group
                      relative
                      flex
                      h-[250px]
                      w-[82vw]
                      max-w-[390px]
                      shrink-0
                      snap-start
                      flex-col
                      overflow-hidden
                      border
                      border-gray-300
                      bg-white
                      p-6
                      transition-all
                      duration-300
                      ease-out
                      hover:border-primary-800
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
                  {/* Accent */}

                  <span
                    aria-hidden="true"
                    className="
                        absolute
                        left-0
                        top-0
                        h-[3px]
                        w-20
                        bg-accent-400
                        transition-all
                        duration-300
                        group-hover:w-32
                      "
                  />

                  {/* Number */}

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

                  {/* Content */}

                  <div className="mt-auto">
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

                    <p
                      className="
                          mt-3
                          max-w-[370px]
                          text-[13px]
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

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-gray-400
                "
              >
                Drag or swipe to explore
              </span>

              <span
                className="
                  text-[11px]
                  font-medium
                  text-gray-400
                "
              >
                {reasons.length} benefits
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* =====================================================
          SCROLLBAR
      ===================================================== */}

      <style>{`
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        .why-study-carousel {
          -webkit-overflow-scrolling: touch;
        }

        .why-study-carousel.is-dragging {
          scroll-snap-type: none;
          cursor: grabbing !important;
        }

        .why-study-carousel.is-dragging
          .why-study-card {
          cursor: grabbing;
        }

        .why-study-card {
          -webkit-user-drag: none;
        }
      `}</style>
    </section>
  );
}
