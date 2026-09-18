"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(SplitText, ScrollTrigger);

/* =========================================================
   TYPES
========================================================= */

interface StudentFacility {
  number: string;
  title: string;
  image: string;
}

interface StudentFacilitiesProps {
  facilities?: StudentFacility[];
}

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultFacilities: StudentFacility[] = [
  {
    number: "01",
    title: "Library",
    image: "/images/infrastructure/student/library.webp",
  },
  {
    number: "02",
    title: "Transport",
    image: "/images/infrastructure/student/transport.webp",
  },
  {
    number: "03",
    title: "Hostel",
    image: "/images/infrastructure/student/hostel.webp",
  },
  {
    number: "04",
    title: "Sports Facilities",
    image: "/images/infrastructure/student/sports.webp",
  },
  {
    number: "05",
    title: "Cafeteria / Canteen",
    image: "/images/infrastructure/student/cafeteria.webp",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function StudentFacilities({
  facilities = defaultFacilities,
}: StudentFacilitiesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = headingRef.current;
      const intro = introRef.current;
      const grid = gridRef.current;

      if (!heading || !intro || !grid) return;

      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>(".student-facility-card"),
      );

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set([heading, intro, ...cards], {
          clearProps: "all",
        });

        return;
      }

      /* =====================================================
         INITIAL STATES
      ===================================================== */

      gsap.set(intro, {
        opacity: 0,
        y: 20,
      });

      gsap.set(cards, {
        opacity: 0,
        y: 35,
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
          start: "top 72%",
          once: true,
        },
      });

      /* HEADING */

      timeline.to(
        split.lines,
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out",
        },
        0,
      );

      /* INTRO */

      timeline.to(
        intro,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        0.25,
      );

      /* CARDS */

      timeline.to(
        cards,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: "power3.out",
        },
        0.4,
      );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        overflow-hidden
        bg-gray-50
        py-20
        sm:py-24
        lg:py-32
      "
    >
      <Container>
        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-end
            lg:gap-16
            xl:gap-24
          "
        >
          {/* LEFT */}

          <div ref={headingRef}>
            <div
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
                Student Facilities
              </span>
            </div>

            <SectionHeading as="h2" className="max-w-2xl">
              Designed Around Student Life
            </SectionHeading>
          </div>

          {/* RIGHT */}

          <p
            ref={introRef}
            className="
              max-w-xl
              text-[14px]
              leading-6
              text-gray-500
              sm:text-[15px]
              sm:leading-7
              lg:text-[16px]
              lg:leading-8
            "
          >
            STCET provides essential facilities that support students&apos;
            everyday needs and contribute to a comfortable college experience.
          </p>
        </div>

        {/* ===================================================
            FACILITY GRID
        =================================================== */}

        <div
          ref={gridRef}
          className="
            mt-12
            grid
            gap-4
            sm:mt-16
            sm:grid-cols-2
            sm:gap-5
            lg:mt-20
            lg:grid-cols-12
            lg:gap-6
          "
        >
          {facilities.map((facility, index) => {
            /*
             * First card is intentionally larger.
             *
             * Desktop:
             * Card 01 → 7 columns
             * Card 02 → 5 columns
             * Card 03 → 4 columns
             * Card 04 → 4 columns
             * Card 05 → 4 columns
             */

            const desktopSpan =
              index === 0
                ? "lg:col-span-7"
                : index === 1
                  ? "lg:col-span-5"
                  : "lg:col-span-4";

            return (
              <article
                key={`${facility.number}-${facility.title}`}
                className={`
                  student-facility-card
                  group
                  relative
                  overflow-hidden
                  ${desktopSpan}
                `}
              >
                <div
                  className={`
                    relative
                    overflow-hidden
                    ${
                      index === 0
                        ? "aspect-[16/10] lg:aspect-[1.45/1]"
                        : "aspect-[16/10]"
                    }
                  `}
                >
                  {/* IMAGE */}

                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    sizes="
                      (max-width: 639px) 100vw,
                      (max-width: 1023px) 50vw,
                      40vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.04]
                    "
                  />

                  {/* OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-primary-800/85
                      via-primary-800/15
                      to-transparent
                      transition-opacity
                      duration-500
                    "
                  />

                  {/* HOVER OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-primary-800/10
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* =================================================
                      NUMBER
                  ================================================= */}

                  <div
                    className="
                      absolute
                      left-5
                      top-5
                      flex
                      items-center
                      gap-3
                      sm:left-6
                      sm:top-6
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
                      {facility.number}
                    </span>

                    <span
                      className="
                        h-px
                        w-7
                        bg-white/30
                        transition-all
                        duration-500
                        group-hover:w-11
                        group-hover:bg-accent-400
                      "
                    />
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-5
                      sm:p-6
                      lg:p-7
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        justify-between
                        gap-4
                      "
                    >
                      <h3
                        className="
                          max-w-sm
                          text-[20px]
                          font-extrabold
                          uppercase
                          leading-[0.95]
                          tracking-[-0.035em]
                          text-white
                          sm:text-[22px]
                          lg:text-[26px]
                        "
                      >
                        {facility.title}
                      </h3>

                      {/* ARROW */}

                      <span
                        aria-hidden="true"
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          translate-y-1
                          items-center
                          justify-center
                          border
                          border-white/30
                          text-sm
                          text-white
                          opacity-70
                          transition-all
                          duration-500
                          group-hover:translate-x-1
                          group-hover:border-accent-400
                          group-hover:bg-accent-400
                          group-hover:opacity-100
                          sm:h-9
                          sm:w-9
                        "
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
