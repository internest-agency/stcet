"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface InfrastructureHeroProps {
  image?: string;
  imageAlt?: string;
}

export default function InfrastructureHero({
  image = "/images/infrastructure/hero.webp",
  imageAlt = "STCET campus infrastructure",
}: InfrastructureHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

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
      const meta = metaRef.current;

      if (
        !image ||
        !imageInner ||
        !content ||
        !eyebrow ||
        !heading ||
        !description ||
        !meta
      ) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set([eyebrow, heading, description, meta, image, imageInner], {
          clearProps: "all",
        });

        return;
      }

      /* =====================================================
         INITIAL STATE
      ===================================================== */

      gsap.set(eyebrow, {
        opacity: 0,
        y: 18,
      });

      gsap.set(description, {
        opacity: 0,
        y: 24,
      });

      gsap.set(meta, {
        opacity: 0,
        y: 18,
      });

      gsap.set(image, {
        opacity: 0,
        y: 30,
        clipPath: "inset(0 0 100% 0)",
      });

      gsap.set(imageInner, {
        scale: 1.08,
      });

      /* =====================================================
         HEADING SPLIT
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
         HERO TIMELINE
      ===================================================== */

      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      /* IMAGE */

      timeline.to(
        image,
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0.05,
      );

      timeline.to(
        imageInner,
        {
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        },
        0.05,
      );

      /* EYEBROW */

      timeline.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
        },
        0.35,
      );

      /* HEADING */

      timeline.to(
        split.lines,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
        },
        0.42,
      );

      /* DESCRIPTION */

      timeline.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.8,
      );

      /* META */

      timeline.to(
        meta,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        1.0,
      );

      /* =====================================================
         SUBTLE IMAGE PARALLAX
      ===================================================== */

      gsap.to(imageInner, {
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
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
        text-white
      "
    >
      <Container>
        <div
          ref={contentRef}
          className="
            relative
            flex
            min-h-[calc(100svh-80px)]
            flex-col
            justify-end
            pb-8
            pt-24
            sm:pb-10
            sm:pt-28
            lg:min-h-[calc(100svh-88px)]
            lg:pb-14
            lg:pt-32
          "
        >
          {/* =================================================
              IMAGE
          ================================================= */}

          <div
            ref={imageRef}
            className="
              relative
              mb-10
              h-[42svh]
              min-h-[300px]
              w-full
              overflow-hidden
              sm:h-[48svh]
              sm:min-h-[380px]
              lg:absolute
              lg:right-0
              lg:top-14
              lg:mb-0
              lg:h-[68vh]
              lg:w-[58%]
              xl:h-[70vh]
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
                priority
                sizes="
                  (max-width: 639px) 100vw,
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

              {/* EDGE GRADIENT */}

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-primary-800/45
                  via-transparent
                  to-transparent
                  lg:bg-linear-to-l
                  lg:from-primary-800/20
                  lg:via-transparent
                  lg:to-transparent
                "
              />
            </div>
          </div>

          {/* =================================================
              TEXT CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-10
              max-w-3xl
              lg:w-[52%]
              lg:max-w-2xl
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
                  text-white/65
                  sm:text-[11px]
                "
              >
                Infrastructure
              </span>
            </div>

            {/* HEADING */}

            <h1
              ref={headingRef}
              className="
                max-w-3xl
                font-extrabold
                uppercase
                leading-[0.9]
                tracking-[-0.055em]
                text-white
                text-[42px]
                sm:text-[56px]
                lg:text-[68px]
                xl:text-[76px]
                [perspective:900px]
              "
            >
              Infrastructure That Inspires Learning
            </h1>

            {/* DESCRIPTION */}

            <p
              ref={descriptionRef}
              className="
                mt-6
                max-w-xl
                text-[14px]
                leading-6
                text-white/65
                sm:mt-7
                sm:text-[15px]
                sm:leading-7
                lg:mt-8
                lg:text-[17px]
                lg:leading-8
              "
            >
              A thoughtfully designed campus with academic spaces, laboratories
              and student facilities that support learning, exploration and a
              well-rounded college experience.
            </p>

            {/* =================================================
                META / SCROLL INDICATOR
            ================================================= */}

            <div
              ref={metaRef}
              className="
                mt-8
                flex
                items-center
                gap-5
                sm:mt-10
              "
            >
              <div
                className="
                  h-px
                  w-10
                  bg-white/30
                  sm:w-14
                "
              />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white/40
                "
              >
                Explore the campus
              </span>
            </div>
          </div>

          {/* =================================================
              DECORATIVE INDEX
          ================================================= */}

          <div
            className="
              absolute
              bottom-8
              right-0
              hidden
              font-mono
              text-[10px]
              tracking-[0.15em]
              text-white/25
              lg:block
            "
          >
            01 / 01
          </div>
        </div>
      </Container>
    </section>
  );
}
