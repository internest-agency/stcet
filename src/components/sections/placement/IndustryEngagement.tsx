"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const industryInteractions = [
  "Career Talks",
  "Guest Sessions",
  "Industry Workshops",
  "Internships",
  "Industry Interactions",
  "Recruitment Drives",
  "Pre-Placement Activities",
];

export default function IndustryEngagement() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const elements = section.querySelectorAll(".industry-reveal");

      gsap.set(elements, {
        opacity: 0,
        y: 35,
      });

      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      const image = section.querySelector(
        ".industry-image",
      ) as HTMLElement | null;

      if (image) {
        gsap.fromTo(
          image,
          {
            scale: 1.08,
          },
          {
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              once: true,
            },
          },
        );
      }
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-100">
      <Container>
        <div className="py-14 sm:py-18 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            {/* ============================================
                IMAGE
            ============================================ */}

            <div className="industry-reveal order-2 lg:order-1">
              <div className="relative overflow-hidden bg-gray-100">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/placements/industry-connect.webp"
                    alt="Students interacting with industry professionals"
                    fill
                    className="industry-image object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </div>
            </div>

            {/* ============================================
                CONTENT
            ============================================ */}

            <div className="order-1 lg:order-2">
              {/* Label */}

              <div className="industry-reveal mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Industry Connect
                </span>
              </div>

              {/* Heading */}

              <div className="industry-reveal">
                <SectionHeading as="h2">
                  Connecting Students{" "}
                  <span className="text-accent-400">with Industry</span>
                </SectionHeading>
              </div>

              {/* Description */}

              <p className="industry-reveal mt-7 max-w-xl  text-gray-600">
                The Placement Cell aims to develop meaningful connections with
                companies and professionals across technology, engineering,
                manufacturing, and other relevant sectors.
              </p>

              <p className="industry-reveal mt-7 max-w-xl  text-gray-600">
                Students will be provided opportunities to engage with industry
                through career talks, guest sessions, workshops, internships,
                industry interactions, recruitment drives and pre-placement
                activities, wherever applicable.
              </p>

              {/* ============================================
                  INDUSTRY INTERACTIONS
              ============================================ */}

              <div className="industry-reveal mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {industryInteractions.map((item, index) => (
                  <div
                    key={item}
                    className="
                      group
                      flex
                      items-center
                      gap-4
                      bg-gray-50
                      px-5
                      py-4
                      transition-colors
                      duration-300
                      hover:bg-primary-800
                    "
                  >
                    <span className="text-xs font-semibold text-accent-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className="
                        text-sm
                        font-medium
                        text-gray-700
                        transition-colors
                        duration-300
                        group-hover:text-white
                      "
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
