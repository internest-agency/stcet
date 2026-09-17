"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseSlide = {
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  year?: string;
  label?: string;
  href?: string;
};

const slides: ShowcaseSlide[] = [
  {
    number: "01",
    category: "Computer Science",
    title: "Programming & Computational Thinking",
    description:
      "Master core logic, problem-solving techniques, and fundamental programming concepts to build a strong computing foundation.",
    image: "/images/courses/cse/programming.webp",
    year: "2026–27",
    label: "Core Programming",
  },
  {
    number: "02",
    category: "Computer Science",
    title: "Data Structures & Algorithms",
    description:
      "Learn essential data organization and algorithmic strategies to solve complex problems efficiently and write optimized code.",
    image: "/images/courses/cse/data-structures.webp",
    year: "2026–27",
    label: "Algorithms",
  },
  {
    number: "03",
    category: "Computer Science",
    title: "Object-Oriented Programming",
    description:
      "Understand modern software design using object-oriented principles like encapsulation, inheritance, polymorphism, and abstraction.",
    image: "/images/courses/cse/object-oriented-programming.webp",
    year: "2026–27",
    label: "Software Design",
  },
  {
    number: "04",
    category: "Computer Science",
    title: "Database Management Systems",
    description:
      "Explore relational databases, SQL, data modeling, and query processing to manage and secure organizational data.",
    image: "/images/courses/cse/database-management.webp",
    year: "2026–27",
    label: "Data Management",
  },
  {
    number: "05",
    category: "Computer Science",
    title: "Operating Systems",
    description:
      "Gain insight into resource management, process scheduling, memory allocations, and file systems driving modern computing devices.",
    image: "/images/courses/cse/operating-systems.webp",
    year: "2026–27",
    label: "System Architecture",
  },
  {
    number: "06",
    category: "Computer Science",
    title: "Computer Networks",
    description:
      "Discover network architecture, routing protocols, data communication, and distributed system fundamentals.",
    image: "/images/courses/cse/computer-networks.webp",
    year: "2026–27",
    label: "Networking",
  },
  {
    number: "07",
    category: "Computer Science",
    title: "Software Engineering",
    description:
      "Apply agile methodologies, system design principles, testing frameworks, and software development lifecycles.",
    image: "/images/courses/cse/software-engineering.webp",
    year: "2026–27",
    label: "Development Lifecycle",
  },
  {
    number: "08",
    category: "Computer Science",
    title: "Web & Application Development",
    description:
      "Design and build responsive front-end interfaces, robust backend APIs, and scalable mobile application experiences.",
    image: "/images/courses/cse/web-development.webp",
    year: "2026–27",
    label: "App Development",
  },
  {
    number: "09",
    category: "Computer Science",
    title: "Cloud Computing",
    description:
      "Deploy, scale, and manage distributed infrastructure using virtualized environments and modern cloud services.",
    image: "/images/courses/cse/cloud-computing.webp",
    year: "2026–27",
    label: "Cloud Architecture",
  },
  {
    number: "10",
    category: "Computer Science",
    title: "Cybersecurity",
    description:
      "Study network security, cryptography, threat mitigation, and defensive mechanisms to protect digital infrastructure.",
    image: "/images/courses/cse/cybersecurity.webp",
    year: "2026–27",
    label: "Information Security",
  },
  {
    number: "11",
    category: "Computer Science",
    title: "Artificial Intelligence & Emerging Technologies",
    description:
      "Explore machine learning, neural networks, intelligent systems, and cutting-edge innovations transforming industry paradigms.",
    image: "/images/courses/cse/artificial-intelligence.webp",
    year: "2026–27",
    label: "AI & Innovation",
  },
];

const TOTAL_SLIDES = slides.length;
const TOTAL_SLIDES_LABEL = String(TOTAL_SLIDES).padStart(2, "0");
const SCROLL_PER_SLIDE = 1.15;

const ARTICLE_START_X = 50;
const ARTICLE_START_Y = 50;
const ARTICLE_TRIGGER_PROGRESS = 0.5;
const ARTICLE_ANIMATION_DISTANCE = 0.35;
const ARTICLE_OPACITY = 0.5;

export default function RotatingShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const contentViewportRef = useRef<HTMLDivElement>(null);
  const contentTrackRef = useRef<HTMLDivElement>(null);
  const contentItemsRef = useRef<(HTMLElement | null)[]>([]);
  const contentInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const activeIndexRef = useRef(0);
  const isFlippingRef = useRef(false);
  const flipTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const flipImage = useCallback((nextIndex: number, direction: 1 | -1) => {
    const frame = frameRef.current;
    const imageInner = imageInnerRef.current;

    if (!frame || !imageInner) return;

    // Kill any running flip animation
    flipTimelineRef.current?.kill();
    isFlippingRef.current = true;

    // Set continuous rotation targets (Coin Spin)
    // Forward scroll = Spin Left (-180deg), Backward scroll = Spin Right (180deg)
    const targetAngle = direction > 0 ? -180 : 180;
    const halfAngle = targetAngle / 2; // -90 or 90 (Edge-on view)

    const timeline = gsap.timeline({
      onComplete: () => {
        // Quietly reset rotation back to 0deg without visual jump after completion
        gsap.set(frame, { rotateY: 0 });
        isFlippingRef.current = false;
      },
    });

    flipTimelineRef.current = timeline;

    timeline
      // Stage 1: Spin to edge-on (0 to +/-90 deg) with a subtle coin-toss scale pulse
      .to(frame, {
        rotateY: halfAngle,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
      })
      // Stage 2: Swap slide content when card is perfectly edge-on to the camera
      .call(() => {
        setActiveIndex(nextIndex);
      })
      // Stage 3: Complete the continuous flip in the SAME direction (+/-90 to +/-180 deg)
      .to(frame, {
        rotateY: targetAngle,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const showcase = showcaseRef.current;
    const frame = frameRef.current;
    const contentViewport = contentViewportRef.current;
    const contentTrack = contentTrackRef.current;
    const progressLine = progressLineRef.current;
    const progressBar = progressBarRef.current;

    if (!section || !showcase || !frame || !contentViewport || !contentTrack) {
      return;
    }

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(frame, {
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      });

      if (!prefersReducedMotion) {
        gsap.fromTo(
          ".showcase-heading",
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          frame,
          {
            opacity: 0,
            y: 25,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power4.out",
            scrollTrigger: {
              trigger: showcase,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      contentInnerRefs.current.forEach((inner) => {
        if (!inner) return;

        if (prefersReducedMotion) {
          gsap.set(inner, { x: 0, y: 0, opacity: 1 });
          return;
        }

        gsap.set(inner, {
          x: ARTICLE_START_X,
          y: ARTICLE_START_Y,
          opacity: ARTICLE_OPACITY,
        });
      });

      if (prefersReducedMotion) return;

      ScrollTrigger.create({
        trigger: showcase,
        start: "top 100px",
        end: () =>
          `+=${window.innerHeight * (TOTAL_SLIDES - 1) * SCROLL_PER_SLIDE}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;

          const viewportHeight = contentViewport.clientHeight;
          const totalTravel = viewportHeight * (TOTAL_SLIDES - 1);
          const trackY = progress * totalTravel;

          gsap.set(contentTrack, { y: -trackY });

          contentItemsRef.current.forEach((article, index) => {
            const inner = contentInnerRefs.current[index];
            if (!article || !inner) return;

            const articleStart = index / (TOTAL_SLIDES - 1);
            const entranceStart =
              articleStart - ARTICLE_TRIGGER_PROGRESS / (TOTAL_SLIDES - 1);
            const entranceEnd =
              entranceStart + ARTICLE_ANIMATION_DISTANCE / (TOTAL_SLIDES - 1);

            let entranceProgress = gsap.utils.mapRange(
              entranceStart,
              entranceEnd,
              0,
              1,
              progress,
            );
            entranceProgress = gsap.utils.clamp(0, 1, entranceProgress);
            const easeProgress = gsap.parseEase("power2.out")(entranceProgress);

            const x = gsap.utils.interpolate(ARTICLE_START_X, 0, easeProgress);
            const y = gsap.utils.interpolate(ARTICLE_START_Y, 0, easeProgress);
            const opacity = gsap.utils.interpolate(0.5, 1, easeProgress);

            gsap.set(inner, { x, y, opacity });
          });

          const rawIndex = progress * (TOTAL_SLIDES - 1);
          const closestIndex = Math.min(
            TOTAL_SLIDES - 1,
            Math.max(0, Math.round(rawIndex)),
          );
          const currentIndex = activeIndexRef.current;

          if (closestIndex !== currentIndex) {
            const direction = closestIndex > currentIndex ? 1 : -1;
            activeIndexRef.current = closestIndex;
            flipImage(closestIndex, direction);
          }

          if (progressLine) {
            gsap.set(progressLine, {
              scaleX: progress,
              transformOrigin: "left center",
            });
          }

          if (progressBar) {
            gsap.set(progressBar, {
              scaleY: progress,
              transformOrigin: "top center",
            });
          }
        },

        onLeaveBack: () => {
          activeIndexRef.current = 0;
          setActiveIndex(0);
          flipTimelineRef.current?.kill();
          gsap.set(contentTrack, { y: 0 });

          contentInnerRefs.current.forEach((inner) => {
            if (!inner) return;
            gsap.set(inner, {
              x: ARTICLE_START_X,
              y: ARTICLE_START_Y,
              opacity: ARTICLE_OPACITY,
            });
          });
        },
      });
    }, sectionRef);

    return () => {
      flipTimelineRef.current?.kill();
      ctx.revert();
    };
  }, [flipImage]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 lg:py-20 bg-primary-800 text-white"
    >
      <Container className="relative z-10">
        <div
          className="
            showcase-heading
            grid
            gap-5
            pt-14
            pb-10
            sm:pt-16
            lg:grid-cols-[1fr_1.5fr]
            lg:gap-16
            lg:pt-20
            xl:grid-cols-[1fr_1.5fr]
            xl:gap-20
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 sm:text-xs">
                Discover STCET
              </span>
            </div>
            <div className="mt-5 hidden h-px w-14 bg-accent-400 lg:block" />
          </div>

          <div>
            <h2
              className="
                max-w-3xl
                text-3xl
                font-extrabold
                uppercase
                leading-[1.02]
                tracking-[-0.04em]
                text-white
                sm:text-4xl
                lg:text-[2.65rem]
                xl:text-5xl
              "
            >
              Explore Our
              <br />
              Learning Environment.
            </h2>
          </div>
        </div>

        <div
          ref={showcaseRef}
          className="
            relative
            flex
            min-h-[calc(100svh-100px)]
            flex-col
            justify-center
            py-6
            sm:py-8
            lg:min-h-[calc(100svh-160px)]
            lg:py-5
          "
        >
          <div
            className="
              grid
              items-center
              gap-8
              lg:grid-cols-[1.1fr_0.9fr]
              lg:gap-12
              xl:grid-cols-[1.15fr_0.85fr]
              xl:gap-16
              2xl:gap-24
            "
          >
            <div className="relative flex min-w-0 items-center justify-center">
              <div
                ref={frameRef}
                className="
                  relative
                  z-10
                  h-[min(62svh,470px)]
                  w-full
                  max-w-[420px]
                  shrink-0
                  sm:h-[min(65svh,520px)]
                  sm:max-w-[460px]
                  lg:h-[min(68svh,540px)]
                  lg:max-w-[500px]
                  xl:h-[min(70svh,580px)]
                  xl:max-w-[540px]
                "
                style={{
                  perspective: "1400px",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  className="
                    relative
                    h-full
                    w-full
                    overflow-hidden
                    rounded-[1.5rem]
                    border
                    border-white/20
                    bg-white/[0.055]
                    p-2
                    sm:rounded-[1.65rem]
                    sm:p-2.5
                    lg:rounded-[1.8rem]
                    lg:p-3
                  "
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[0.9rem] bg-primary-900 sm:rounded-[1rem]">
                    <div
                      ref={imageInnerRef}
                      className="absolute inset-0"
                      style={{ willChange: "transform" }}
                    >
                      <Image
                        src={activeSlide.image}
                        alt={activeSlide.label ?? activeSlide.title}
                        fill
                        priority
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 540px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-primary-900/85 via-primary-900/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-[8px]">
                              {activeSlide.category}
                            </span>
                            <p className="mt-1 text-[10px] font-bold text-white sm:mt-1.5 sm:text-xs">
                              {activeSlide.label}
                            </p>
                          </div>
                          <span className="text-[9px] font-black tracking-[0.15em] text-accent-400 sm:text-[10px]">
                            {activeSlide.number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="relative h-36 w-px xl:h-40">
                  <div className="absolute inset-0 bg-white/10" />
                  <div
                    ref={progressBarRef}
                    className="absolute left-0 top-0 h-full w-px origin-top bg-accent-400"
                    style={{ transform: "scaleY(0)" }}
                  />
                </div>
                <div className="mt-4 space-y-2.5">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.number}
                      className={`flex items-center gap-3 transition-colors duration-300 ${
                        activeIndex === index ? "text-white" : "text-white/25"
                      }`}
                    >
                      <span className="text-[8px] font-bold tracking-[0.15em]">
                        {slide.number}
                      </span>
                      {activeIndex === index && (
                        <span className="h-px w-5 bg-accent-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={contentViewportRef}
              className="
                relative
                h-[330px]
                overflow-visible
                sm:h-[360px]
                lg:h-[420px]
                xl:h-[450px]
              "
            >
              <div
                ref={contentTrackRef}
                className="flex flex-col will-change-transform"
              >
                {slides.map((slide, index) => (
                  <article
                    key={slide.number}
                    ref={(element) => {
                      contentItemsRef.current[index] = element;
                    }}
                    className="
                      flex
                      h-[330px]
                      shrink-0
                      flex-col
                      justify-center
                      overflow-visible
                      py-5
                      sm:h-[360px]
                      lg:h-[420px]
                      xl:h-[450px]
                    "
                  >
                    <div
                      ref={(element) => {
                        contentInnerRefs.current[index] = element;
                      }}
                      className="relative w-full"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400 sm:text-xs">
                          {slide.category}
                        </span>
                        <span>-</span>
                        <span className="text-[8px] font-bold tracking-[0.15em] text-white/30 sm:text-[10px]">
                          {slide.number} / {TOTAL_SLIDES_LABEL}
                        </span>
                      </div>

                      <h3 className="mt-4 max-w-xl text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-white sm:mt-5 sm:text-3xl lg:text-[2.65rem] xl:text-5xl">
                        {slide.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                        {slide.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
