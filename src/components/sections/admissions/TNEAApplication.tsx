"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import { FaCircleCheck } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

export interface TNEAStep {
  number: string;
  navTitle: string;
  title: string;
  description: string;
  points: string[];
  image?: string;
  imageLabel?: string;
}

interface TNEAApplicationProps {
  initialSteps?: TNEAStep[];
}

export default function TNEAApplication({
  initialSteps,
}: TNEAApplicationProps = {}) {
  const stepList = initialSteps ?? [];

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const stepIndex =
    stepList.length > 0
      ? Math.min(Math.max(activeIndex, 0), stepList.length - 1)
      : 0;

  const activeStep = stepList[stepIndex];

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const heading = headingRef.current;
      const intro = introRef.current;
      const nav = navRef.current;
      const image = imageRef.current;

      const navItems = Array.from(
        section.querySelectorAll<HTMLElement>(".tnea-nav-item"),
      );

      const line = section.querySelector<HTMLElement>(".tnea-progress-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      if (heading) {
        gsap.set(heading, {
          opacity: 0,
          y: 35,
        });

        tl.to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          0,
        );
      }

      if (intro) {
        gsap.set(intro, {
          opacity: 0,
          y: 25,
        });

        tl.to(
          intro,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.15,
        );
      }

      if (nav) {
        gsap.set(nav, {
          opacity: 0,
          x: -25,
        });

        tl.to(
          nav,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          0.25,
        );
      }

      if (image) {
        gsap.set(image, {
          opacity: 0,
          x: 30,
          scale: 0.97,
        });

        tl.to(
          image,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out",
          },
          0.3,
        );
      }

      if (line) {
        gsap.set(line, {
          scaleY: 0,
          transformOrigin: "top center",
        });

        tl.to(
          line,
          {
            scaleY: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          0.35,
        );
      }

      gsap.set(navItems, {
        opacity: 0,
        y: 12,
      });

      tl.to(
        navItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        },
        0.45,
      );
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const image = imageRef.current;

    if (!content || !image) return;

    const context = gsap.context(() => {
      const title = content.querySelector<HTMLElement>(".tnea-step-title");
      const description = content.querySelector<HTMLElement>(
        ".tnea-step-description",
      );
      const points = Array.from(
        content.querySelectorAll<HTMLElement>(".tnea-step-point"),
      );
      const imageElement = image.querySelector<HTMLElement>(".tnea-step-image");
      const stepNumber = content.querySelector<HTMLElement>(
        ".tnea-active-number",
      );

      gsap.set([title, description, ...points, stepNumber].filter(Boolean), {
        opacity: 0,
        y: 20,
      });

      if (imageElement) {
        gsap.set(imageElement, {
          opacity: 0,
          scale: 1.04,
        });
      }

      const tl = gsap.timeline();

      if (stepNumber) {
        tl.to(
          stepNumber,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
          },
          0,
        );
      }

      if (title) {
        tl.to(
          title,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power4.out",
          },
          0.08,
        );
      }

      if (description) {
        tl.to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.18,
        );
      }

      if (points.length) {
        tl.to(
          points,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.055,
            ease: "power3.out",
          },
          0.25,
        );
      }

      if (imageElement) {
        tl.to(
          imageElement,
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power4.out",
          },
          0,
        );
      }
    });

    return () => context.revert();
  }, [stepIndex]);

  if (!activeStep) {
    return null;
  }

  const activeImage =
    activeStep.image || "/images/admissions/tnea/01-registration.webp";

  const handleStepChange = (index: number) => {
    if (index === stepIndex) return;

    setActiveIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id="tnea-journey"
      className="overflow-hidden bg-gray-50 py-20 sm:py-24 lg:py-32"
    >
      <Container>
        {/* Header */}
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-primary-800/60">
              TNEA Step-by-Step
            </p>
            <SectionHeading as="h2">
              Your TNEA Journey Step by Step
            </SectionHeading>
          </div>

          <div className="flex items-end">
            <p
              ref={introRef}
              className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg"
            >
              Follow the TNEA application process from registration to reporting
              at the college. Select each stage to understand what happens at
              every step.
            </p>
          </div>
        </div>

        {/* Main Stepper */}
        <div className="mt-8 lg:mt-16">
          <div className="grid gap-12 grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-8">
            {/* Step Navigation */}
            <div ref={navRef} className="relative">
              <div className="relative flex gap-4 justify-between overflow-x-auto pb-2 lg:block lg:overflow-hidden lg:pb-0">
                {/* Vertical progress line */}
                <div className="absolute left-[13px] top-5 hidden h-[calc(100%-40px)] w-px bg-primary-800/10 lg:block">
                  <div className="tnea-progress-line h-full w-full origin-top bg-primary-800/30" />
                </div>
                {stepList.map((step, index) => {
                  const isActive = index === stepIndex;

                  return (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => handleStepChange(index)}
                      className={`tnea-nav-item cursor-pointer group relative flex shrink-0 items-center gap-4 text-left transition-all duration-300 lg:mb-5 lg:w-full ${
                        isActive
                          ? "text-primary-800"
                          : "text-gray-400 hover:text-primary-800"
                      }`}
                    >
                      {/* Number */}
                      <span
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                          isActive
                            ? "border-accent-400 bg-accent-400 text-white"
                            : "border-gray-300 bg-gray-50 text-gray-400 group-hover:border-accent-400 group-hover:text-accent-400"
                        }`}
                      >
                        {step.number}
                      </span>

                      {/* Label */}
                      <span
                        className={`whitespace-nowrap font-semibold text-sm uppercase tracking-[0.12em] transition-all duration-300 lg:whitespace-normal ${
                          isActive
                            ? "translate-x-1 font-semibold text-accent-400"
                            : "group-hover:translate-x-1 group-hover:text-accent-400"
                        }`}
                      >
                        {step.navTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Step Content */}
            <div className="min-w-0">
              <div ref={contentRef} className="min-w-0" key={activeIndex}>
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:gap-10">
                  {/* Text */}
                  <div className="flex flex-col justify-center">
                    <div className="tnea-active-number mb-5 text-sm uppercase tracking-[0.18em] text-primary-800/50">
                      {activeStep.number} /{" "}
                      {String(stepList.length).padStart(2, "0")}
                    </div>

                    <SectionHeading as="h3">{activeStep.title}</SectionHeading>

                    <p className="tnea-step-description mt-6 max-w-xl text-gray-600">
                      {activeStep.description}
                    </p>

                    <div className="mt-8 space-y-4">
                      {activeStep.points.map((point, index) => (
                        <div
                          key={`${activeStep.number}-${index}`}
                          className="tnea-step-point flex items-start gap-3"
                        >
                          <span className="text-base mt-1.5 text-accent-400">
                            <FaCircleCheck />
                          </span>
                          <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  <div
                    ref={imageRef}
                    className="relative overflow-hidden rounded-[2px] bg-gray-200"
                  >
                    <div className="tnea-step-image relative aspect-4/3 lg:h-full w-full overflow-hidden">
                      <Image
                        src={activeImage}
                        alt={activeStep.title}
                        fill
                        sizes="(max-width: 1280px) 100vw, 50vw"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-primary-800/30 via-transparent to-transparent" />

                      <div className="absolute bottom-5 left-5">
                        <span className="inline-flex bg-white/95 px-4 py-2 text-xs uppercase tracking-[0.14em] text-primary-800 backdrop-blur-sm">
                          {activeStep.imageLabel || "TNEA Application"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-12 border-t border-primary-800/10 pt-8 sm:mt-14 lg:mt-16">
                <div className="flex items-center gap-4">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() => handleStepChange(stepIndex - 1)}
                    disabled={stepIndex === 0}
                    aria-label="Previous step"
                    className="group inline-flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full border border-gray-300 bg-white text-primary-800 transition-all duration-300 group-hover:border-primary-800 group-hover:bg-primary-800 group-hover:text-white">
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
                    </span>
                    <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-primary-800 transition-colors duration-300 group-hover:text-accent-400 sm:inline">
                      Previous
                    </span>
                  </button>

                  {/* Progress indicators */}
                  <div
                    className="flex flex-1 items-center justify-center gap-2"
                    aria-label="TNEA steps"
                  >
                    {stepList.map((step, index) => (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() => handleStepChange(index)}
                        aria-label={`Go to step ${step.number}: ${step.title}`}
                        aria-current={index === stepIndex ? "step" : undefined}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === stepIndex
                            ? "w-8 bg-primary-800"
                            : "w-2 bg-gray-300 hover:bg-primary-800/40"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() => handleStepChange(stepIndex + 1)}
                    disabled={stepIndex === stepList.length - 1}
                    aria-label="Next step"
                    className="group inline-flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-primary-800 transition-colors duration-300 group-hover:text-accent-400 sm:inline">
                      Next
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-gray-300 bg-white text-primary-800 transition-all duration-300 group-hover:border-primary-800 group-hover:bg-primary-800 group-hover:text-white">
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
                    </span>
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
