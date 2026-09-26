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
    const content = contentRef.current;
    const image = imageRef.current;

    if (!section || !content || !image) return;

    const context = gsap.context(() => {
      const breadcrumb = content.querySelector(
        ".placement-breadcrumb",
      ) as HTMLElement | null;

      const eyebrow = content.querySelector(
        ".placement-eyebrow",
      ) as HTMLElement | null;

      const heading = content.querySelector(
        ".placement-heading",
      ) as HTMLElement | null;

      const description = content.querySelector(
        ".placement-description",
      ) as HTMLElement | null;

      const meta = content.querySelector(
        ".placement-meta",
      ) as HTMLElement | null;

      const contentElements = [
        breadcrumb,
        eyebrow,
        heading,
        description,
        meta,
      ].filter((element): element is HTMLElement => element !== null);

      /*
       * Initial content state
       */
      gsap.set(contentElements, {
        opacity: 0,
        y: 25,
      });

      /*
       * Initial image state
       */
      gsap.set(image, {
        opacity: 0,
        clipPath: "inset(0 0 0 100%)",
      });

      /*
       * Hero entrance
       */
      const entrance = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      entrance.to(
        image,
        {
          opacity: 1,
          clipPath: "inset(0 0 0 0%)",
          duration: 1,
          ease: "power4.out",
        },
        0,
      );

      if (breadcrumb) {
        entrance.to(
          breadcrumb,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          0.15,
        );
      }

      if (eyebrow) {
        entrance.to(
          eyebrow,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          0.2,
        );
      }

      if (heading) {
        entrance.to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power4.out",
          },
          0.25,
        );
      }

      if (description) {
        entrance.to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          0.4,
        );
      }

      if (meta) {
        entrance.to(
          meta,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          0.5,
        );
      }

      /*
       * Subtle image parallax
       */
      const imageElement = image.querySelector<HTMLElement>(".placement-image");

      if (imageElement) {
        gsap.to(imageElement, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-800 text-white"
    >
      <div className="grid min-h-[680px] lg:min-h-[760px] lg:grid-cols-2">
        {/* =========================================================
            LEFT — CONTENT
        ========================================================= */}

        <div className="flex items-center">
          <Container>
            <div
              ref={contentRef}
              className="py-16 sm:py-20 lg:py-24 lg:pr-16 xl:pr-24"
            >
              {/* Breadcrumb */}
              <div className="placement-breadcrumb mt-4 mb-6">
                <Breadcrumb
                  items={[
                    {
                      label: "Placements",
                    },
                  ]}
                />
              </div>

              {/* Eyebrow */}
              <div className="placement-eyebrow mb-7">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                  Placement & Training Cell
                </span>
              </div>

              {/* Heading */}
              <SectionHeading as="h1" className="placement-heading text-white">
                Preparing Talent. Connecting{" "}
                <span className="text-accent-400">Opportunities.</span>
              </SectionHeading>

              {/* Description */}
              <p className="placement-description mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                The Placement Cell at S. Thangapazham College of Engineering and
                Technology works towards preparing students for the transition
                from college to the professional world.
              </p>

              {/* Focus Areas */}
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

        {/* =========================================================
            RIGHT — IMAGE
        ========================================================= */}

        <div
          ref={imageRef}
          className="relative min-h-[500px] overflow-hidden lg:min-h-0"
        >
          <div className="placement-image absolute -inset-y-[4%] left-0 right-0">
            <Image
              src="/images/placements/placement-hero.webp"
              alt="Engineering students preparing for their professional careers"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
