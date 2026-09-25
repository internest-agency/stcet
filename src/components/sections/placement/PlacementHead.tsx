"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger, SplitText);

const qualifications = [
  "Qualification details",
  "Professional experience",
  "Relevant industry experience",
];

export default function PlacementHead() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const heading = section.querySelector(
        ".placement-head-heading",
      ) as HTMLElement | null;

      const image = section.querySelector(
        ".placement-head-image",
      ) as HTMLElement | null;

      const content = section.querySelector(
        ".placement-head-content",
      ) as HTMLElement | null;

      const qualificationItems = Array.from(
        section.querySelectorAll<HTMLElement>(".qualification-item"),
      );

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      gsap.set(split.lines, {
        yPercent: 100,
      });

      gsap.set(image, {
        opacity: 0,
        y: 25,
      });

      gsap.set(content, {
        opacity: 0,
        y: 25,
      });

      gsap.set(qualificationItems, {
        opacity: 0,
        x: 15,
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        once: true,

        onEnter: () => {
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power4.out",
          });

          gsap.to(image, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.2,
            ease: "power3.out",
          });

          gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.3,
            ease: "power3.out",
          });

          gsap.to(qualificationItems, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.55,
            ease: "power3.out",
          });
        },
      });

      return () => split.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-100">
      <Container className="py-14 sm:py-18 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20 xl:grid-cols-[0.6fr_1.4fr]">
          {/* =========================================
              LEFT — SECTION INTRO
          ========================================= */}

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Placement Leadership
              </span>
            </div>

            <SectionHeading as="h2">
              Guiding Students Towards Careers.
            </SectionHeading>
          </div>

          {/* =========================================
              RIGHT — PROFILE
          ========================================= */}

          <div className="grid items-start gap-8 sm:grid-cols-[220px_1fr] sm:gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
            {/* =====================================
                PHOTO
            ===================================== */}

            <div className="placement-head-image">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src="/images/placements/placeholder.webp"
                  alt="Mr. B. Rajesh, Placement Cell"
                  fill
                  sizes="230px"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-lg font-extrabold tracking-tight text-primary-700">
                  Mr. B. Rajesh
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-400">
                  Placement Cell
                </p>
              </div>
            </div>

            {/* =====================================
                CONTENT
            ===================================== */}

            <div className="placement-head-content max-w-2xl">
              <p className="text-gray-800">
                The Placement Cell is headed by{" "}
                <strong className="font-semibold text-primary-700">
                  Mr. B. Rajesh
                </strong>{" "}
                who will be working closely with students and departments to
                identify career aspirations, strengthen employability skills and
                facilitate opportunities for interaction with the industry.
              </p>

              {/* Qualifications */}
              <div className="border-t border-gray-300 pt-7 mt-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Qualifications & Experience
                </span>

                <div className="mt-5">
                  {qualifications.map((qualification, index) => (
                    <div
                      key={qualification}
                      className="qualification-item flex items-center gap-4 border-b border-gray-200 py-4 first:pt-0"
                    >
                      <span className="text-[10px] font-bold text-accent-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-sm text-gray-700">
                        {qualification}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
