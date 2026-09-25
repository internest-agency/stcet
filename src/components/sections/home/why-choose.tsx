"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "../../ui/Container";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const cards = [
    {
      title: "Accreditation",
      description: "AICTE Approved & Anna University Affiliated",
    },
    {
      title: "Curriculum",
      description: "Industry-Oriented & Future-Ready Curriculum",
    },
    {
      title: "Faculty",
      description: "Experienced and Dedicated Faculty",
    },
    {
      title: "Learning",
      description: "Student-Centric Learning Environment",
    },
    {
      title: "Laboratories",
      description: "Modern Laboratories & Practical Learning",
    },
    {
      title: "Placements",
      description: "Placement Training from eraly on",
    },
    {
      title: "Career Readiness",
      description: "Personality Development & Career Readiness Programmes",
    },
    {
      title: "Entrepreneurship",
      description: "Innovation & Entrepreneurship Support",
    },
    {
      title: "Technology",
      description: "Exposure to Emerging Technologies",
    },
    {
      title: "Holistic Development",
      description: "Value-Based Education & Holistic Developement",
    },
    {
      title: "Opportunities",
      description:
        "Opportunities for Projects, Clubs, Competitors & Leadership",
    },
    {
      title: "Campus Facilities",
      description:
        "Supportive Campus Facilities for a Complete College Experience",
    },
    {
      title: "Our Approach",
      description:
        "At STCET we prepare the students to discover their potentials, embrace opportunities and build a successful future.",
    },
  ];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      const stickyElement = sectionRef.current?.querySelector(
        ".lg:sticky",
      ) as HTMLElement | null;

      if (stickyElement) {
        console.log("Sticky Element found");
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: stickyElement,
        });
      } else {
        console.log("Sticky Element not found!");
      }

      /*
       * ========================================
       * SECTION HEADING
       * ========================================
       */

      const heading = sectionRef.current?.querySelector(
        ".why-heading",
      ) as HTMLElement | null;

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,

          onEnter: () => {
            gsap.fromTo(
              split.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power4.out",
              },
            );
          },
        });
      }

      /*
       * ========================================
       * INTRODUCTION
       * ========================================
       */

      const intro = sectionRef.current?.querySelector(
        ".why-intro",
      ) as HTMLElement | null;

      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          start: "top 90%",
          once: true,

          onEnter: () => {
            gsap.fromTo(
              intro,
              {
                y: 25,
              },
              {
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );
          },
        });
      }

      /*
       * ========================================
       * CARDS
       * ========================================
       */

      const cards = gsap.utils.toArray<HTMLElement>(".why-card");

      ScrollTrigger.create({
        trigger: ".why-cards",
        start: "top 85%",
        once: true,

        onEnter: () => {
          /*
           * Card entrance
           *
           * We only animate transform here.
           * Cards remain visible even if animation
           * does not execute.
           */
          gsap.fromTo(
            cards,
            {
              y: 45,
            },
            {
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
            },
          );

          /*
           * Numbers
           */
          const numbers = sectionRef.current?.querySelectorAll(".why-number");

          if (numbers) {
            gsap.fromTo(
              numbers,
              {
                y: 20,
              },
              {
                y: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: "power3.out",
              },
            );
          }

          /*
           * Card content
           */
          const content =
            sectionRef.current?.querySelectorAll(".why-card-content");

          if (content) {
            gsap.fromTo(
              content,
              {
                y: 15,
              },
              {
                y: 0,
                duration: 0.6,
                stagger: 0.07,
                ease: "power3.out",
              },
            );
          }
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20"
      aria-labelledby="why-choose-heading"
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <Container className="mb-12 flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
        {/* Heading */}

        <div className="flex-1">
          <h2
            id="why-choose-heading"
            className="why-heading mb-4 text-5xl font-bold uppercase text-gray-900"
          >
            Built for Students
            <br />
            Who Build the Future
          </h2>
        </div>

        {/* Intro */}

        <div className="why-intro max-w-full text-gray-600 md:max-w-1/3">
          <p>
            At S. Thangapazham College of Engineering and Technology (STCET), we
            believe engineering education is essentially about building
            knowledge, confidence, skills and a vision for the future.
          </p>
        </div>
      </Container>

      {/* ========================================
          CARDS
      ======================================== */}

      <Container className="why-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="
        why-card
        group
        relative
        overflow-hidden
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-primary-700
        hover:bg-primary-700
        hover:shadow-xl
      "
          >
            {/* Accent line */}
            <span
              className="
          absolute
          left-0
          top-0
          h-1
          w-0
          bg-accent-400
          transition-all
          duration-500
          group-hover:w-full
        "
            />

            {/* Number */}
            <div
              className="
          why-number
          mb-12
          text-2xl
          font-extrabold
          text-primary-700
          transition-colors
          duration-300
          group-hover:text-white
        "
            >
              {index < 9 ? `0${index + 1}` : index + 1}
            </div>

            {/* Content */}
            <div className="why-card-content">
              <h3
                className="
            mb-2
            font-nunito-sans
            text-xl
            font-extrabold
            uppercase
            text-primary-700
            transition-colors
            duration-300
            group-hover:text-white
          "
              >
                {card.title}
              </h3>

              <p
                className="
            text-sm
            leading-6
            text-gray-600
            transition-colors
            duration-300
            group-hover:text-white
          "
              >
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
