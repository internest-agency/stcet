"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

import Image from "next/image";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const trainingAreas = [
  {
    number: "01",
    title: "Aptitude & Logical Reasoning",
    description:
      "Building quantitative, analytical and problem-solving abilities.",
    image: "/images/placements/icons/critical-thinking.png",
  },
  {
    number: "02",
    title: "Communication Skills",
    description:
      "Developing spoken English, presentation and professional communication.",
    image: "/images/placements/icons/communication.png",
  },
  {
    number: "03",
    title: "Technical Skill Development",
    description:
      "Strengthening core technical knowledge relevant to students' chosen disciplines.",
    image: "/images/placements/icons/skills.png",
  },
  {
    number: "04",
    title: "Programming & Coding",
    description:
      "Developing coding ability and computational problem-solving skills.",
    image: "/images/placements/icons/web-programming.png",
  },
  {
    number: "05",
    title: "Resume & Profile Building",
    description:
      "Helping students present their skills, projects and achievements effectively.",
    image: "/images/placements/icons/curriculum-vitae.png",
  },
  {
    number: "06",
    title: "Group Discussions & Interviews",
    description:
      "Preparing students for different stages of recruitment processes.",
    image: "/images/placements/icons/interview.png",
  },
  {
    number: "07",
    title: "Soft Skills & Professional Skills",
    description:
      "Developing teamwork, leadership, workplace etiquette and professional confidence.",
    image: "/images/placements/icons/problem-solving-skills.png",
  },
  {
    number: "08",
    title: "Career Awareness",
    description:
      "Helping students understand career options, industry expectations and opportunities for higher studies.",
    image: "/images/placements/icons/success.png",
  },
];

export default function CareerReadiness() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  /*
   * =========================================================
   * CAROUSEL BUTTON STATE
   * =========================================================
   */

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
   * UPDATE CAROUSEL STATE
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
     * Ignore extremely small movement.
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
       * Move the carousel using velocity.
       */

      currentCarousel.scrollLeft -= velocity;

      /*
       * Friction.
       *
       * 0.94 gives a smooth natural glide.
       */

      velocity *= 0.94;

      velocityRef.current = velocity;

      updateScrollState();

      /*
       * Stop when reaching either edge.
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
       * Continue the momentum animation.
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

      const card = carousel.querySelector<HTMLElement>(".career-slide");

      if (!card) {
        return;
      }

      const cardWidth = card.getBoundingClientRect().width;

      const styles = window.getComputedStyle(carousel);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 8;

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
     * Only use the primary mouse button.
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

    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    const currentX = event.clientX;

    const currentTime = performance.now();

    /*
     * Distance from where dragging started.
     */

    const distance = currentX - startXRef.current;

    /*
     * Move the native carousel.
     */

    carousel.scrollLeft = startScrollLeftRef.current - distance;

    /*
     * Calculate current velocity.
     */

    const deltaX = currentX - lastXRef.current;

    const deltaTime = currentTime - lastTimeRef.current;

    if (deltaTime > 0) {
      const instantVelocity = deltaX / deltaTime;

      /*
       * Smooth the velocity calculation.
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
     * Convert drag velocity into
     * momentum.
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
      const eyebrow = section.querySelector<HTMLElement>(".career-eyebrow");

      const heading = section.querySelector<HTMLElement>(".career-heading");

      const intro = section.querySelector<HTMLElement>(".career-intro");

      if (!eyebrow || !heading || !intro) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set([eyebrow, heading, intro], {
          opacity: 1,
          y: 0,
        });

        return;
      }

      gsap.set([eyebrow, heading, intro], {
        opacity: 0,
        y: 30,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      timeline
        .to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.3",
        )
        .to(
          intro,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45",
        );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  /*
   * =========================================================
   * CAROUSEL STATE
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
  }, [updateScrollState]);

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
        bg-primary-800
        py-14
        sm:py-16
        lg:py-20
      "
    >
      {/* =====================================================
          SECTION INTRO
      ===================================================== */}

      <Container>
        <div className="mb-12">
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[0.6fr_1.4fr]
              lg:gap-20
            "
          >
            {/* Label */}

            <div>
              <div
                className="
                  career-eyebrow
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-accent-400
                  "
                />

                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-gray-400
                  "
                >
                  Career Readiness
                </span>
              </div>
            </div>

            {/* Heading */}

            <div>
              <SectionHeading
                as="h2"
                className="
                  career-heading
                  text-white
                "
              >
                Building Career{" "}
                <span className="text-accent-400">Readiness</span>
              </SectionHeading>

              <p
                className="
                  career-intro
                  mt-7
                  max-w-2xl
                  text-base
                  leading-7
                  text-white/80
                  sm:text-lg
                  sm:leading-8
                "
              >
                Placement preparation begins well before the final year.
                Students are encouraged to progressively develop the technical,
                analytical and interpersonal skills expected in today's
                workplace.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* =====================================================
          TRAINING CAROUSEL
      ===================================================== */}

      <Container>
        <div className="relative">
          {/* Carousel controls */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-end
              gap-2
            "
          >
            {/* Previous */}

            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              aria-label="Previous training area"
              className="
                flex
                size-11
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-white/10
                text-white
                transition-all
                duration-300
                hover:border-accent-400
                hover:bg-accent-400
                hover:text-primary-800
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
              aria-label="Next training area"
              className="
                flex
                size-11
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-white/10
                text-white
                transition-all
                duration-300
                hover:border-accent-400
                hover:bg-accent-400
                hover:text-primary-800
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

          {/* =================================================
              CAROUSEL
          ================================================= */}

          <div
            ref={carouselRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className="
              career-carousel
              flex
              cursor-grab
              select-none
              gap-2
              overflow-x-auto
              overscroll-x-contain
              pb-5
              snap-x
              snap-mandatory
              touch-pan-x
              scrollbar-none
            "
          >
            {trainingAreas.map((item) => (
              <article
                key={item.number}
                className="
                    career-slide
                    group
                    flex
                    h-auto
                    min-h-[330px]
                    w-[82vw]
                    max-w-lg
                    shrink-0
                    snap-start
                    items-center
                    border-r
                    border-gray-200
                    bg-gray-50
                    px-7
                    py-8
                    sm:min-h-[350px]
                    sm:w-[62vw]
                    sm:px-10
                    sm:py-10
                    lg:min-h-[390px]
                    lg:w-[540px]
                    lg:px-16
                    lg:py-12
                  "
              >
                <div className="career-slide-content max-w-2xl">
                  {/* Icon */}

                  <div className="mb-6">
                    <Image
                      src={item.image}
                      width={56}
                      height={56}
                      alt=""
                      draggable={false}
                      className="
                          h-14
                          w-14
                          object-contain
                        "
                    />
                  </div>

                  {/* Heading */}

                  <SectionHeading
                    as="h3"
                    className="
                        career-slide-heading
                      "
                  >
                    {item.title}
                  </SectionHeading>

                  {/* Description */}

                  <p
                    className="
                        mt-5
                        max-w-xl
                        text-base
                        leading-7
                        text-gray-600
                      "
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Drag hint */}

          <div
            className="
              mt-3
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-white/40
              "
            >
              Drag or swipe to explore
            </span>

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-white/40
              "
            >
              {trainingAreas.length} areas
            </span>
          </div>
        </div>
      </Container>

      {/* =====================================================
          CAROUSEL CSS
      ===================================================== */}

      <style>{`
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        .career-carousel {
          -webkit-overflow-scrolling: touch;
        }

        .career-carousel.is-dragging {
          scroll-snap-type: none;
          cursor: grabbing !important;
        }

        .career-carousel.is-dragging
          .career-slide {
          cursor: grabbing;
        }

        .career-slide {
          -webkit-user-drag: none;
        }
      `}</style>
    </section>
  );
}
