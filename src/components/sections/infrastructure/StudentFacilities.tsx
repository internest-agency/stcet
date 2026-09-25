"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    title: "Transport",
    image: "/images/infrastructure/student/transport.webp",
  },
  {
    title: "Hostel",
    image: "/images/infrastructure/student/hostel.webp",
  },
  {
    title: "Library",
    image: "/images/infrastructure/library.webp",
  },
  {
    title: "Sports Facilities",
    image: "/images/infrastructure/sports.webp",
  },
];

const facilityList = ["Library", "Transport", "Hostel", "Sports Facilities"];

export default function StudentFacilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const content = section.querySelector(
        ".student-content",
      ) as HTMLElement | null;

      const cards = Array.from(
        section.querySelectorAll<HTMLElement>(".student-facility-card"),
      );

      if (!content || !cards.length) return;

      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        },
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
        bg-gray-50
        py-16
        sm:py-20
        lg:py-24
        xl:py-28
      "
    >
      <Container>
        <div
          className="
            grid
            gap-10

            lg:grid-cols-[1fr_1fr]
            lg:gap-14

            xl:grid-cols-[1fr_1fr]
            xl:gap-20
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            className="
              student-content

              lg:py-2
            "
          >
            {/* TOP CONTENT */}

            <div>
              {/* LABEL */}

              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent-400" />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-primary-800/45
                  "
                >
                  Student Facilities
                </span>
              </div>

              {/* HEADING */}

              <div className="max-w-xl">
                <SectionHeading as="h2">
                  Designed Around Student Life
                </SectionHeading>
              </div>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  max-w-lg
                  text-[14px]
                  leading-6
                  text-gray-800

                  sm:text-[15px]
                  sm:leading-7
                "
              >
                STCET provides essential facilities that support students&apos;
                everyday needs and contribute to a comfortable college
                experience.
              </p>
            </div>

            {/* =================================================
                FACILITY LIST
            ================================================= */}

            <div
              className="
                mt-10
                border-t
                border-primary-800/10
                pt-6

                lg:mt-12
                lg:pt-7
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-primary-800
                "
              >
                Facilities include:
              </p>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-x-8
                  gap-y-4
                "
              >
                {facilityList.map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      gap-3
                      text-[13px]
                      text-gray-800
                    "
                  >
                    <span
                      className="
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                        bg-accent-400
                      "
                    />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT — 2 × 2 IMAGE GRID
          ================================================= */}

          <div
            className="
              grid
              grid-cols-2
              gap-4
            "
          >
            {facilities.map((facility, index) => (
              <article
                key={facility.title}
                className={`
                  student-facility-card
                  group
                  ${index === 0 ? "lg:translate-y-0" : ""}
                  ${index === 1 ? "lg:translate-y-8" : ""}
                  ${index === 2 ? "lg:-translate-y-2" : ""}
                  ${index === 3 ? "lg:translate-y-6" : ""}
                `}
              >
                {/* IMAGE */}

                <div
                  className="
                    relative
                    aspect-[1.25/1]
                    overflow-hidden
                    bg-gray-200
                  "
                >
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    sizes="
                      (max-width: 640px) 50vw,
                      (max-width: 1024px) 40vw,
                      30vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-105
                    "
                  />

                  {/* subtle overlay */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-black/35
                      via-transparent
                      to-transparent
                      opacity-70
                    "
                  />

                  {/* NUMBER */}

                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      font-mono
                      text-[10px]
                      font-bold
                      tracking-[0.15em]
                      text-white/80
                    "
                  >
                    0{index + 1}
                  </span>
                </div>

                {/* TITLE */}

                <div className="mt-3 flex items-center justify-between">
                  <h3
                    className="
                      text-[12px]
                      font-bold
                      text-primary-800

                      sm:text-[13px]
                    "
                  >
                    {facility.title}
                  </h3>

                  <span
                    className="
                      text-[13px]
                      text-primary-800/30
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:text-accent-400
                    "
                  >
                    →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
