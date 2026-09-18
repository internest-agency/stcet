"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CampusFutureSectionProps {
  image?: string;
  imageAlt?: string;
}

export default function CampusFutureSection({
  image = "/images/infrastructure/campus.webp",
  imageAlt = "STCET campus",
}: CampusFutureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);

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
      const paragraphs = paragraphsRef.current;
      const index = indexRef.current;

      if (
        !image ||
        !imageInner ||
        !content ||
        !eyebrow ||
        !heading ||
        !paragraphs ||
        !index
      ) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [image, imageInner, content, eyebrow, heading, paragraphs, index],
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

      gsap.set(paragraphs, {
        opacity: 0,
        y: 22,
      });

      gsap.set(index, {
        opacity: 0,
        x: -12,
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
         MAIN REVEAL
      ===================================================== */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      /* IMAGE */

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

      /* EYEBROW */

      timeline.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.35,
      );

      /* HEADING */

      timeline.to(
        split.lines,
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.4,
      );

      /* PARAGRAPHS */

      timeline.to(
        paragraphs,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.72,
      );

      /* INDEX */

      timeline.to(
        index,
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
        },
        0.9,
      );

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
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.82fr_1.18fr]
            lg:items-center
            lg:gap-16
            xl:grid-cols-[0.78fr_1.22fr]
            xl:gap-24
          "
        >
          {/* =================================================
              LEFT — CONTENT
          ================================================= */}

          <div
            ref={contentRef}
            className="
              relative
              order-2
              lg:order-1
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
                The Campus
              </span>
            </div>

            {/* HEADING */}

            <div ref={headingRef}>
              <SectionHeading
                as="h2"
                className="
                  max-w-xl
                "
              >
                A Campus Designed for the Future
              </SectionHeading>
            </div>

            {/* PARAGRAPHS */}

            <div
              ref={paragraphsRef}
              className="
                mt-7
                max-w-xl
                space-y-5
                text-[14px]
                leading-6
                text-gray-500
                sm:mt-8
                sm:space-y-6
                sm:text-[15px]
                sm:leading-7
                lg:text-[16px]
                lg:leading-8
              "
            >
              <p>
                Our campus brings together academic spaces, laboratories and
                student facilities in an environment designed to make college
                life productive and engaging.
              </p>

              <p>
                From classrooms and laboratories to spaces for study,
                interaction and recreation, the campus is planned to support
                students throughout their academic journey.
              </p>
            </div>

            {/* SECTION INDEX */}

            <div
              className="
                mt-9
                flex
                items-center
                gap-4
                sm:mt-11
              "
            >
              <span
                ref={indexRef}
                className="
                  font-mono
                  text-[10px]
                  font-bold
                  tracking-[0.15em]
                  text-gray-300
                "
              >
                01
              </span>

              <span
                className="
                  h-px
                  w-10
                  bg-gray-200
                  sm:w-14
                "
              />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-gray-400
                "
              >
                Campus Overview
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT — IMAGE
          ================================================= */}

          <div
            ref={imageRef}
            className="
              relative
              order-1
              aspect-[4/3]
              overflow-hidden
              bg-gray-100
              lg:order-2
              lg:aspect-[1.12/1]
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

              {/* SUBTLE IMAGE OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-black/5
                "
              />
            </div>

            {/* IMAGE LABEL */}

            <div
              className="
                absolute
                bottom-0
                left-0
                bg-white
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
                  text-primary-700
                "
              >
                STCET Campus
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
