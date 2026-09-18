"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface EngineeringLaboratoriesProps {
  image?: string;
  imageAlt?: string;
}

export default function EngineeringLaboratories({
  image = "/images/infrastructure/engineering-labs.webp",
  imageAlt = "Engineering laboratory at STCET",
}: EngineeringLaboratoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);

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
      const statement = statementRef.current;

      if (
        !image ||
        !imageInner ||
        !content ||
        !eyebrow ||
        !heading ||
        !description ||
        !statement
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
            statement,
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
        clipPath: "inset(0 0 100% 0)",
      });

      gsap.set(imageInner, {
        scale: 1.08,
      });

      gsap.set(eyebrow, {
        opacity: 0,
        y: 18,
      });

      gsap.set(description, {
        opacity: 0,
        y: 22,
      });

      gsap.set(statement, {
        opacity: 0,
        y: 20,
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
          start: "top 70%",
          once: true,
        },
      });

      /* =====================================================
         IMAGE REVEAL
      ===================================================== */

      timeline.to(
        image,
        {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.05,
          ease: "power4.out",
        },
        0,
      );

      timeline.to(
        imageInner,
        {
          scale: 1,
          duration: 1.5,
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
        0.3,
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
        0.38,
      );

      /* =====================================================
         DESCRIPTION
      ===================================================== */

      timeline.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.7,
      );

      /* =====================================================
         STATEMENT
      ===================================================== */

      timeline.to(
        statement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0.9,
      );

      /* =====================================================
         SUBTLE IMAGE PARALLAX
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
        bg-primary-800
        py-20
        text-white
        sm:py-24
        lg:py-32
      "
    >
      <Container>
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
              bg-primary-700
              sm:aspect-[16/10]
              lg:aspect-[1.05/1]
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

              {/* IMAGE OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-black/10
                "
              />

              {/* BOTTOM GRADIENT */}

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-primary-800/40
                  via-transparent
                  to-transparent
                "
              />
            </div>

            {/* IMAGE INDEX */}

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
                  text-white/60
                "
              >
                02
              </span>

              <span
                className="
                  h-px
                  w-8
                  bg-white/30
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
                  text-white/60
                "
              >
                Engineering Laboratories
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
                  text-white/55
                  sm:text-[11px]
                "
              >
                Engineering Laboratories
              </span>
            </div>

            {/* HEADING */}

            <div ref={headingRef}>
              <SectionHeading
                as="h2"
                className="
                  !text-white
                  max-w-xl
                "
              >
                Learn. Experiment. Build.
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
                text-white/60
                sm:mt-8
                sm:text-[15px]
                sm:leading-7
                lg:text-[16px]
                lg:leading-8
              "
            >
              Engineering is best understood by connecting concepts with
              application. STCET&apos;s laboratories give students opportunities
              to experiment, observe and apply what they learn within their
              respective disciplines.
            </p>

            {/* =================================================
                KEY STATEMENT
            ================================================= */}

            <div
              ref={statementRef}
              className="
                mt-9
                border-t
                border-white/15
                pt-6
                sm:mt-11
                sm:pt-7
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
                <span
                  className="
                    mt-1.5
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-accent-400
                  "
                />

                <p
                  className="
                    max-w-md
                    text-[12px]
                    font-medium
                    leading-5
                    text-white/45
                    sm:text-[13px]
                    sm:leading-6
                  "
                >
                  Practical learning connects engineering concepts with
                  observation, experimentation and real-world application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
