"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import Breadcrumb from "../../ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger);

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const image = imageRef.current;
      const eyebrow = eyebrowRef.current;
      const heading = headingRef.current;
      const description = descriptionRef.current;
      const action = actionRef.current;
      const counter = counterRef.current;

      if (
        !image ||
        !eyebrow ||
        !heading ||
        !description ||
        !action ||
        !counter
      ) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set([image, eyebrow, heading, description, action, counter], {
          clearProps: "all",
        });

        return;
      }

      /* ---------------------------------------------
         INITIAL STATES
      --------------------------------------------- */

      gsap.set(image, {
        scale: 1.08,
      });

      gsap.set(eyebrow, {
        opacity: 0,
        y: 20,
      });

      gsap.set(heading, {
        opacity: 0,
        y: 45,
      });

      gsap.set(description, {
        opacity: 0,
        y: 25,
      });

      gsap.set(action, {
        opacity: 0,
        y: 20,
      });

      gsap.set(counter, {
        opacity: 0,
        x: 20,
      });

      /* ---------------------------------------------
         INTRO ANIMATION
      --------------------------------------------- */

      const timeline = gsap.timeline({
        delay: 0.1,
      });

      timeline.to(
        image,
        {
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        },
        0,
      );

      timeline.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.2,
      );

      timeline.to(
        heading,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power4.out",
        },
        0.3,
      );

      timeline.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0.65,
      );

      timeline.to(
        action,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.85,
      );

      timeline.to(
        counter,
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.9,
      );

      /* ---------------------------------------------
         IMAGE PARALLAX
      --------------------------------------------- */

      gsap.to(image, {
        yPercent: 5,
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

  const handleExplore = () => {
    const target = document.getElementById("application");

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-[680px]
        h-[100svh]
        overflow-hidden
        bg-primary-800
      "
    >
      {/* =====================================================
          DESKTOP RIGHT IMAGE
      ===================================================== */}

      <div
        ref={imageRef}
        className="
          absolute
          inset-0
        "
      >
        <Image
          src="/images/contact/contact-hero.webp"
          alt="STCET campus"
          fill
          priority
          sizes="52vw"
          className="
            object-cover
            object-center
            will-change-transform
          "
        />

        {/* Image edge gradient */}

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-linear-to-r
            from-primary-800
            via-primary-800/80
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MOBILE IMAGE
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          lg:hidden
        "
      >
        <Image
          src="/images/infrastructure/hero.webp"
          alt="STCET campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-primary-800/70
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-linear-to-t
            from-primary-800
            via-primary-800/60
            to-primary-800/20
          "
        />
      </div>

      {/* =====================================================
          LEFT CONTENT AREA
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          items-center
          lg:w-[52%]
        "
      >
        {/* angled transition to image */}

        <div
          aria-hidden="true"
          className="
            absolute
            right-[-80px]
            top-0
            bottom-0
            hidden
            lg:block
          "
        />

        <Container>
          <div
            className="
              relative
              z-20
              max-w-[720px]

              px-0
              pt-24
              pb-20

              sm:pt-28

              lg:pr-10
              xl:pr-16
            "
          >
            <Breadcrumb
              items={[
                {
                  label: "Contact Us",
                },
              ]}
              className="text-white/80 my-6"
            />

            {/* =================================================
                HEADING
            ================================================= */}

            <SectionHeading as="h1" className="text-white">
              Let’s Start a Conversation.
            </SectionHeading>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p
              ref={descriptionRef}
              className="
                text-gray-300
                mt-7
                max-w-[530px]
                sm:mt-8"
            >
              Have questions about admissions, programmes, campus facilities or
              student life? Our team is here to help you find the information
              you need and guide you through the next step.
            </p>

            {/* =================================================
                EXPLORE
            ================================================= */}

            <button
              ref={actionRef}
              type="button"
              onClick={handleExplore}
              className="
                group
                mt-8
                flex
                items-center
                gap-4

                sm:mt-10
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/35
                  text-white
                  transition-all
                  duration-300

                  group-hover:border-accent-400
                  group-hover:bg-accent-400
                  group-hover:text-primary-800
                "
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="
                    h-3.5
                    w-3.5
                    transition-transform
                    duration-300
                    group-hover:translate-y-0.5
                  "
                >
                  <path
                    d="M10 4V16M5 11L10 16L15 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/65
                  transition-colors
                  duration-300
                  group-hover:text-white
                "
              >
                Get in Touch
              </span>
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
