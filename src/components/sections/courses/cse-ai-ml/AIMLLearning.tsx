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

gsap.registerPlugin(SplitText, ScrollTrigger);

type ShowcaseSlide = {
  number: string;
  title: string;
  description: string;
  image: string;
};

const slides: ShowcaseSlide[] = [
  {
    number: "01",
    title: "Programming & Computational Thinking",
    description:
      "Build a strong foundation in programming and computational thinking while developing the logical and problem-solving skills required for intelligent computing.",
    image: "/images/courses/ai-ml/learning/programming.webp",
  },
  {
    number: "02",
    title: "Data Structures & Algorithms",
    description:
      "Understand how data can be organised, processed and analysed while developing efficient algorithms for solving computational problems.",
    image: "/images/courses/ai-ml/learning/data-structures.webp",
  },
  {
    number: "03",
    title: "Database Management",
    description:
      "Learn how data is stored, organised, managed and retrieved through database concepts and technologies.",
    image: "/images/courses/ai-ml/learning/database-management.webp",
  },
  {
    number: "04",
    title: "Computer Networks & Operating Systems",
    description:
      "Develop an understanding of the systems and networks that support modern computing, communication and intelligent applications.",
    image: "/images/courses/ai-ml/learning/computer-networks.webp",
  },
  {
    number: "05",
    title: "Artificial Intelligence",
    description:
      "Explore the fundamental concepts of artificial intelligence and understand how intelligent systems can process information and support decision-making.",
    image: "/images/courses/ai-ml/learning/artificial-intelligence.webp",
  },
  {
    number: "06",
    title: "Machine Learning",
    description:
      "Learn how machines can learn from data, identify patterns and develop models that support prediction and intelligent decision-making.",
    image: "/images/courses/ai-ml/learning/machine-learning.webp",
  },
  {
    number: "07",
    title: "Data Analytics & Pattern Recognition",
    description:
      "Explore data analytics and pattern recognition techniques to discover meaningful relationships and insights from data.",
    image:
      "/images/courses/ai-ml/learning/data-analytics-pattern-recognition.webp",
  },
  {
    number: "08",
    title: "Deep Learning & Neural Networks",
    description:
      "Understand neural networks and deep learning approaches used to develop intelligent systems capable of learning from complex data.",
    image: "/images/courses/ai-ml/learning/deep-learning-neural-networks.webp",
  },
  {
    number: "09",
    title: "Natural Language Processing",
    description:
      "Explore how computers can process, understand and work with human language to build intelligent language-based applications.",
    image: "/images/courses/ai-ml/learning/natural-language-processing.webp",
  },
  {
    number: "10",
    title: "Computer Vision",
    description:
      "Learn how computer systems can process and interpret visual information to support intelligent applications and automated solutions.",
    image: "/images/courses/ai-ml/learning/computer-vision.webp",
  },
];

const TOTAL = String(slides.length).padStart(2, "0");

export default function CSEAILearning() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const slideTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const activeSlide = slides[activeIndex];

  const selectSlide = useCallback(
    (index: number) => {
      if (index === activeIndex || isChanging) return;

      const image = imageRef.current;
      const content = contentRef.current;

      if (!image || !content) {
        setActiveIndex(index);
        return;
      }

      const direction = index > activeIndex ? 1 : -1;

      setIsChanging(true);

      slideTimelineRef.current?.kill();

      const timeline = gsap.timeline({
        onComplete: () => {
          slideTimelineRef.current = null;
          setIsChanging(false);
        },
      });

      slideTimelineRef.current = timeline;

      timeline
        .to(image, {
          opacity: 0,
          y: direction > 0 ? -12 : 12,
          duration: 0.18,
          ease: "power2.in",
        })
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
        .call(() => {
          setActiveIndex(index);
        })
        .set(image, {
          y: direction > 0 ? 12 : -12,
        })
        .set(content, {
          y: direction > 0 ? 6 : -6,
        })
        .to(image, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        })
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
    [activeIndex, isChanging],
  );

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
    }, sectionRef);

    return () => {
      slideTimelineRef.current?.kill();
      slideTimelineRef.current = null;

      context.revert();
    };
  }, []);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();

      selectSlide(index === slides.length - 1 ? 0 : index + 1);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();

      selectSlide(index === 0 ? slides.length - 1 : index - 1);
    }
  };

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container>
        {/* Section intro */}
        <div className="pt-14 sm:pt-18 lg:pt-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16 xl:gap-24">
            <div>
              <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400 sm:h-2 sm:w-2"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700">
                  What You Will Learn
                </span>
              </div>

              <h2
                className="
                  curriculum-heading
                  max-w-2xl
                  text-[32px]
                  font-extrabold
                  uppercase
                  leading-[0.98]
                  tracking-[-0.045em]
                  text-primary-700
                  sm:text-[40px]
                  lg:text-[48px]
                "
              >
                Build your foundation in intelligent computing.
              </h2>
            </div>

            <div>
              <p className="curriculum-intro max-w-xl text-[14px] leading-6 text-gray-500 sm:text-[15px] sm:leading-7 lg:text-[17px] lg:leading-8">
                The programme builds a strong foundation in areas such as
                programming, artificial intelligence, machine learning, data
                analytics, deep learning, natural language processing and
                computer vision.
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum explorer */}
        <div className="my-14 border-y border-gray-200 bg-white sm:my-18 lg:my-20">
          <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
            {/* Navigation */}
            <div className="border-b border-gray-200 lg:border-b-0 lg:border-r">
              <div className="border-b border-gray-200 px-5 py-4 sm:px-6 lg:px-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Course Modules
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                {slides.map((slide, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={slide.number}
                      type="button"
                      onClick={() => selectSlide(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      aria-current={isActive ? "true" : undefined}
                      disabled={isChanging}
                      className={`
                        group
                        relative
                        flex
                        min-h-[54px]
                        w-full
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

            {/* Featured content */}
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              {/* Image */}
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
                  className="absolute inset-0 will-change-transform"
                >
                  <Image
                    key={activeSlide.image}
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
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
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-accent-400">
                  MODULE {activeSlide.number}
                </span>

                <h3
                  className="
                    mt-5
                    max-w-xl
                    text-[28px]
                    font-extrabold
                    uppercase
                    leading-[1]
                    tracking-[-0.04em]
                    text-primary-700
                    sm:text-[34px]
                    lg:text-[40px]
                    xl:text-[46px]
                  "
                >
                  {activeSlide.title}
                </h3>

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

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5 sm:mt-10 sm:pt-6">
                  <button
                    type="button"
                    disabled={isChanging}
                    onClick={() =>
                      selectSlide(
                        activeIndex === 0 ? slides.length - 1 : activeIndex - 1,
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

                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-gray-400">
                    {activeSlide.number} / {TOTAL}
                  </span>

                  <button
                    type="button"
                    disabled={isChanging}
                    onClick={() =>
                      selectSlide(
                        activeIndex === slides.length - 1 ? 0 : activeIndex + 1,
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
