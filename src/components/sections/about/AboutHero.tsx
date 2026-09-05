"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import Breadcrumb from "../../ui/Breadcrumb";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const eyebrow = section.querySelector(".about-hero-eyebrow");
      const heading = section.querySelector(".about-hero-heading");
      const description = section.querySelector(".about-hero-description");
      const image = section.querySelector(".about-hero-image");
      const meta = section.querySelector(".about-hero-meta");

      // Make sure all required animation targets exist.
      if (!eyebrow || !heading || !description || !image || !meta) {
        return;
      }

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.fromTo(
        eyebrow,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        0.1,
      )
        .fromTo(
          split.lines,
          {
            yPercent: 100,
          },
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          0.2,
        )
        .fromTo(
          description,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          0.55,
        )
        .fromTo(
          meta,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          0.7,
        )
        .fromTo(
          image,
          {
            opacity: 0,
            scale: 1.04,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
          },
          0.25,
        );
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-0">
      <Container className="pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: "About Us",
            },
          ]}
          className="mb-10 sm:mb-14"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16 xl:gap-24">
          {/* Content */}
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="about-hero-eyebrow mb-5 inline-flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                About Us
              </span>
            </div>

            {/* Heading */}
            <h1 className="about-hero-heading max-w-3xl text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl md:text-4xl lg:text-5xl">
              Building Foundations
              <br />
              for a Better Future.
            </h1>

            {/* Description */}
            <p className="about-hero-description mt-7 max-w-2xl text-base leading-7 text-gray-600 sm:mt-8 sm:text-lg sm:leading-8">
              S. Thangapazham College of Engineering and Technology was
              established with a clear vision to provide quality technical
              education and equip students with the knowledge and capabilities
              required to succeed in a rapidly evolving world.
            </p>

            {/* Meta */}
            <div className="about-hero-meta mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-gray-200 pt-6 sm:mt-10">
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-primary-700">
                  2026–27
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Academic Journey
                </p>
              </div>

              <div className="hidden h-10 w-px bg-gray-200 sm:block" />

              <div>
                <p className="text-2xl font-extrabold tracking-tight text-primary-700">
                  05
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Engineering Programmes
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="about-hero-image relative overflow-hidden">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 sm:aspect-[5/6] lg:aspect-[4/5]">
              <Image
                src="/images/gallery/stcet-engineering-block-entrance.jpg"
                alt="S. Thangapazham College of Engineering and Technology"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/45 via-transparent to-transparent" />

              {/* Image label */}
              <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
                <span className="inline-flex items-center gap-2 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-700 backdrop-blur-sm">
                  STCET
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                  Vasudevanallur
                </span>
              </div>
            </div>

            {/* Decorative number */}
            <span
              aria-hidden="true"
              className="absolute -bottom-5 -right-2 select-none text-[7rem] font-black leading-none tracking-[-0.08em] text-primary-700/5 sm:-right-4 sm:text-[9rem]"
            >
              01
            </span>
          </div>
        </div>
      </Container>

      {/* Bottom accent line */}
      <div className="h-1 w-full bg-accent-400" />
    </section>
  );
}
