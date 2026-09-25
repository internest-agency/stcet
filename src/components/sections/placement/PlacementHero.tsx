"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import Breadcrumb from "../../ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger);

export default function PlacementHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const eyebrow = contentRef.current?.querySelector(".placement-eyebrow");

      const heading = contentRef.current?.querySelector(".placement-heading");

      const description = contentRef.current?.querySelector(
        ".placement-description",
      );

      const meta = contentRef.current?.querySelector(".placement-meta");

      const image = imageRef.current;

      const elements = [eyebrow, heading, description, meta].filter(Boolean);

      gsap.set(elements, {
        opacity: 0,
        y: 35,
      });

      if (image) {
        gsap.set(image, {
          opacity: 0,
          clipPath: "inset(0 0 0 100%)",
        });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      /* --------------------------------
         Image Reveal
      -------------------------------- */

      if (image) {
        timeline.to(
          image,
          {
            opacity: 1,
            clipPath: "inset(0 0 0 0%)",
            duration: 1.1,
            ease: "power4.out",
          },
          0,
        );
      }

      /* --------------------------------
         Content Reveal
      -------------------------------- */

      timeline.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
        0.28,
      );

      timeline.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.45,
      );

      timeline.to(
        meta,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0.58,
      );

      /* --------------------------------
         Image Parallax
      -------------------------------- */

      if (image) {
        const imageElement =
          image.querySelector<HTMLElement>(".placement-image");

        if (imageElement) {
          gsap.to(imageElement, {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-800 text-white"
    >
      <div className="grid min-h-[680px] lg:min-h-[760px] lg:grid-cols-2">
        {/* =========================================
            LEFT CONTENT
        ========================================= */}

        <div className="flex items-center">
          <Container>
            <div ref={contentRef} className="py-20 lg:py-24 lg:pr-16 xl:pr-24">
              <Breadcrumb
                items={[
                  {
                    label: "Placements",
                  },
                ]}
                className="my-4"
              />

              <SectionHeading as="h1" className="placement-heading text-white">
                Preparing Talent. Connecting{" "}
                <span className="text-accent-400">Opportunities.</span>
              </SectionHeading>

              {/* Description */}
              <p className="placement-description mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                The Placement Cell at S. Thangapazham College of Engineering and
                Technology works towards preparing students for the transition
                from college to the professional world.
              </p>

              {/* Supporting Focus */}
              <div className="placement-meta mt-10 grid max-w-xl grid-cols-2 border-t border-white/15 pt-6 sm:grid-cols-4">
                <div className="border-r border-white/10 pr-4">
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-white/40">
                    Industry
                  </span>

                  <span className="mt-1 block text-sm text-white/80">
                    Awareness
                  </span>
                </div>

                <div className="border-r border-white/10 px-4">
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-white/40">
                    Employability
                  </span>

                  <span className="mt-1 block text-sm text-white/80">
                    Training
                  </span>
                </div>

                <div className="border-r border-white/10 px-4">
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-white/40">
                    Skill
                  </span>

                  <span className="mt-1 block text-sm text-white/80">
                    Development
                  </span>
                </div>

                <div className="pl-4">
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-white/40">
                    Industry
                  </span>

                  <span className="mt-1 block text-sm text-white/80">
                    Interaction
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* =========================================
            RIGHT IMAGE
        ========================================= */}

        <div
          ref={imageRef}
          className="relative min-h-[500px] overflow-hidden lg:min-h-0"
        >
          <div className="placement-image absolute -inset-y-[5%] left-0 right-0">
            <Image
              src="/images/placements/placement-hero.webp"
              alt="Engineering students preparing for their professional careers"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800/25 via-transparent to-transparent lg:from-primary-800/35" />

          {/* Bottom Label */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-white/25 pt-4 sm:bottom-8 sm:left-8 sm:right-8">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">
              Career Readiness
            </span>

            <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
              STCET
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
