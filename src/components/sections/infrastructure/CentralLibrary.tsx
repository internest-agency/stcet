"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CentralLibraryProps {
  image?: string;
  imageAlt?: string;
}

const resources = [
  {
    number: "01",
    title: "Engineering Textbooks",
  },
  {
    number: "02",
    title: "Reference Materials",
  },
  {
    number: "03",
    title: "Academic Journals",
  },
  {
    number: "04",
    title: "Reading & Study Spaces",
  },
];

export default function CentralLibrary({
  image = "/images/infrastructure/central-library.webp",
  imageAlt = "Central Library at STCET",
}: CentralLibraryProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const image = imageRef.current;
      const imageInner = imageInnerRef.current;
      const content = contentRef.current;
      const eyebrow = eyebrowRef.current;
      const heading = headingRef.current;
      const description = descriptionRef.current;
      const resourcesElement = resourcesRef.current;

      if (
        !image ||
        !imageInner ||
        !content ||
        !eyebrow ||
        !heading ||
        !description ||
        !resourcesElement
      ) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            image,
            imageInner,
            content,
            eyebrow,
            heading,
            description,
            resourcesElement,
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

      gsap.set(image, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      });

      gsap.set(imageInner, {
        scale: 1.08,
      });

      gsap.set(eyebrow, {
        opacity: 0,
        y: 16,
      });

      gsap.set(description, {
        opacity: 0,
        y: 20,
      });

      const resourceItems = Array.from(
        resourcesElement.querySelectorAll<HTMLElement>(".library-resource"),
      );

      if (resourceItems.length > 0) {
        gsap.set(resourceItems, {
          opacity: 0,
          y: 16,
        });
      }

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
          start: "top 72%",
          once: true,
        },
      });

      /* =====================================================
         IMAGE
      ===================================================== */

      timeline.to(
        image,
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power4.out",
        },
        0,
      );

      timeline.to(
        imageInner,
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        },
        0,
      );

      /* =====================================================
         EYEBROW
      ===================================================== */

      timeline.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.28,
      );

      /* =====================================================
         HEADING
      ===================================================== */

      timeline.to(
        split.lines,
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.35,
      );

      /* =====================================================
         DESCRIPTION
      ===================================================== */

      timeline.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        0.68,
      );

      /* =====================================================
         RESOURCES
      ===================================================== */

      if (resourceItems.length > 0) {
        timeline.to(
          resourceItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.82,
        );
      }

      /* =====================================================
         IMAGE PARALLAX
      ===================================================== */

      gsap.to(imageInner, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-white
        py-20
        sm:py-24
        lg:py-32
      "
    >
      <Container>
        {/* ===================================================
            MAIN LAYOUT
        =================================================== */}

        <div
          className="
            grid
            gap-12
            lg:grid-cols-[1.12fr_0.88fr]
            lg:items-center
            lg:gap-16
            xl:gap-24
          "
        >
          {/* =================================================
              IMAGE
          ================================================= */}

          <div
            ref={imageRef}
            className="
              relative
              order-1
              aspect-[4/3]
              overflow-hidden
              bg-gray-100
              sm:aspect-[16/10]
              lg:aspect-[1.08/1]
            "
          >
            <div
              ref={imageInnerRef}
              className="
                absolute
                inset-0
                will-change-transform
              "
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="
                  (max-width: 1023px) 100vw,
                  58vw
                "
                className="
                  object-cover
                "
              />

              {/* SUBTLE OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-black/5
                "
              />

              {/* BOTTOM GRADIENT */}

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-primary-800/25
                  via-transparent
                  to-transparent
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
                Central Library
              </span>
            </div>

            {/* IMAGE INDEX */}

            <div
              className="
                absolute
                right-5
                top-5
                flex
                items-center
                gap-3
                sm:right-7
                sm:top-7
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-white/40
                "
              />

              <span
                className="
                  font-mono
                  text-[10px]
                  font-bold
                  tracking-[0.15em]
                  text-white/70
                "
              >
                03
              </span>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            ref={contentRef}
            className="
              order-2
              lg:pl-2
              xl:pl-4
            "
          >
            {/* EYEBROW */}

            <div
              ref={eyebrowRef}
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
                Central Library
              </span>
            </div>

            {/* HEADING */}

            <div ref={headingRef}>
              <SectionHeading as="h2" className="max-w-xl">
                A Space for Knowledge and Independent Learning
              </SectionHeading>
            </div>

            {/* DESCRIPTION */}

            <p
              ref={descriptionRef}
              className="
                mt-7
                max-w-xl
                text-[14px]
                leading-6
                text-gray-500
                sm:mt-8
                sm:text-[15px]
                sm:leading-7
                lg:text-[16px]
                lg:leading-8
              "
            >
              The library provides students with academic resources that
              complement classroom learning and support independent study.
            </p>

            {/* =================================================
                RESOURCES
            ================================================= */}

            <div
              ref={resourcesRef}
              className="
                mt-9
                border-t
                border-gray-200
                sm:mt-11
              "
            >
              {resources.map((resource) => (
                <div
                  key={resource.number}
                  className="
                    library-resource
                    group
                    flex
                    items-center
                    gap-5
                    border-b
                    border-gray-200
                    py-4
                    sm:py-5
                  "
                >
                  {/* NUMBER */}

                  <span
                    className="
                      w-6
                      shrink-0
                      font-mono
                      text-[10px]
                      font-bold
                      tracking-[0.12em]
                      text-gray-300
                      transition-colors
                      duration-300
                      group-hover:text-accent-400
                    "
                  >
                    {resource.number}
                  </span>

                  {/* TITLE */}

                  <span
                    className="
                      flex-1
                      text-[12px]
                      font-bold
                      text-primary-700
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      sm:text-[13px]
                    "
                  >
                    {resource.title}
                  </span>

                  {/* INDICATOR */}

                  <span
                    aria-hidden="true"
                    className="
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-gray-200
                      transition-colors
                      duration-300
                      group-hover:bg-accent-400
                    "
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
