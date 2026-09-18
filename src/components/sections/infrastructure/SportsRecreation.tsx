"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SportsRecreationProps {
  image?: string;
  imageAlt?: string;
}

export default function SportsRecreation({
  image = "/images/infrastructure/sports-recreation.webp",
  imageAlt = "Students participating in sports and recreational activities at STCET",
}: SportsRecreationProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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
      const footer = footerRef.current;

      if (
        !image ||
        !imageInner ||
        !content ||
        !eyebrow ||
        !heading ||
        !description ||
        !footer
      ) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [image, imageInner, content, eyebrow, heading, description, footer],
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
        y: 24,
      });

      gsap.set(footer, {
        opacity: 0,
        y: 18,
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
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
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
        0.35,
      );

      /* =====================================================
         HEADING
      ===================================================== */

      timeline.to(
        split.lines,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: "power4.out",
        },
        0.42,
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
        0.82,
      );

      /* =====================================================
         FOOTER
      ===================================================== */

      timeline.to(
        footer,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        1.02,
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
        bg-primary-800
        text-white
      "
    >
      {/* ===================================================
          FULL WIDTH IMAGE
      =================================================== */}

      <div
        ref={imageRef}
        className="
          relative
          h-[58svh]
          min-h-[420px]
          w-full
          overflow-hidden
          sm:h-[64svh]
          lg:h-[72svh]
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
            priority={false}
            sizes="100vw"
            className="
              object-cover
            "
          />

          {/* =================================================
              IMAGE OVERLAY
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              bg-black/20
            "
          />

          {/* =================================================
              BOTTOM GRADIENT
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              bg-linear-to-t
              from-primary-800
              via-primary-800/20
              to-transparent
            "
          />

          {/* =================================================
              TOP GRADIENT
          ================================================= */}

          <div
            className="
              absolute
              inset-x-0
              top-0
              h-32
              bg-linear-to-b
              from-black/20
              to-transparent
            "
          />
        </div>

        {/* =================================================
            IMAGE INDEX
        ================================================= */}

        <div
          className="
            absolute
            right-6
            top-6
            flex
            items-center
            gap-3
            sm:right-8
            sm:top-8
            lg:right-12
            lg:top-10
          "
        >
          <span
            className="
              h-px
              w-8
              bg-white/40
              sm:w-12
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
            04
          </span>
        </div>

        {/* =================================================
            IMAGE LABEL
        ================================================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            bg-primary-800
            px-5
            py-3
            sm:px-7
            sm:py-4
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/60
            "
          >
            Student Life
          </span>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <Container>
        <div
          ref={contentRef}
          className="
            relative
            -mt-20
            pb-16
            sm:-mt-24
            sm:pb-20
            lg:-mt-32
            lg:pb-28
          "
        >
          <div
            className="
              max-w-4xl
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
                  text-white/60
                  sm:text-[11px]
                "
              >
                Sports & Recreation
              </span>
            </div>

            {/* HEADING */}

            <h2
              ref={headingRef}
              className="
                max-w-4xl
                font-extrabold
                uppercase
                leading-[0.9]
                tracking-[-0.055em]
                text-white
                text-[40px]
                sm:text-[52px]
                lg:text-[68px]
                xl:text-[76px]
                [perspective:900px]
              "
            >
              Stay Active. Build Teamwork.
            </h2>

            {/* DESCRIPTION */}

            <p
              ref={descriptionRef}
              className="
                mt-6
                max-w-2xl
                text-[14px]
                leading-6
                text-white/60
                sm:mt-7
                sm:text-[15px]
                sm:leading-7
                lg:mt-8
                lg:text-[17px]
                lg:leading-8
              "
            >
              Sports and recreational activities give students opportunities to
              stay active, build teamwork and maintain a healthy balance
              alongside their academic commitments.
            </p>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              ref={footerRef}
              className="
                mt-9
                flex
                items-center
                gap-4
                sm:mt-11
              "
            >
              <span
                className="
                  h-px
                  w-10
                  bg-white/25
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
                Learn · Explore · Grow
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
