"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";
import Breadcrumb from "../../../ui/Breadcrumb";

gsap.registerPlugin(SplitText);

export default function EEEHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const eyebrow = section.querySelector<HTMLElement>(".course-eyebrow");
      const heading = section.querySelector<HTMLElement>(".course-heading");
      const tagline = section.querySelector<HTMLElement>(".course-tagline");
      const heroImage =
        section.querySelector<HTMLElement>(".course-hero-image");

      if (!eyebrow || !heading || !tagline || !heroImage) {
        return;
      }

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set([eyebrow, split.lines, tagline, heroImage], {
          clearProps: "all",
        });

        return;
      }

      gsap.set(eyebrow, {
        opacity: 0,
        y: 15,
      });

      gsap.set(split.lines, {
        yPercent: 100,
      });

      gsap.set(tagline, {
        opacity: 0,
        y: 15,
      });

      gsap.set(heroImage, {
        scale: 1.06,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.to(
        heroImage,
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        },
        0,
      )
        .to(
          eyebrow,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          0.15,
        )
        .to(
          split.lines,
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          0.25,
        )
        .to(
          tagline,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          0.7,
        );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-150
        overflow-hidden
        bg-primary-800
        text-white
        sm:min-h-160
        lg:min-h-170
      "
    >
      {/* Background Image */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/eee-hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            course-hero-image
            object-cover
            object-center
          "
        />

        {/* Main overlay */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-r
            from-primary-950
            via-primary-950/90
            to-primary-950/30
          "
        />

        {/* Bottom readability */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-1/3
            bg-linear-to-t
            from-primary-950/60
            to-transparent
          "
        />
      </div>

      {/* Main Content */}
      <Container
        className="
          relative
          z-10
          flex
          min-h-150
          flex-col
          pt-28
          pb-20
          sm:min-h-160
          sm:pt-32
          sm:pb-24
          lg:min-h-170
          lg:pt-36
          lg:pb-28
        "
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: "Courses",
              href: "/courses",
            },
            {
              label: "Electrical and Electronics Engineering",
            },
          ]}
          className="
            mb-12
            [&_a]:text-white/55
            [&_a:hover]:text-white
            [&_span]:text-white/75
            sm:mb-14
          "
        />

        {/* Hero Content */}
        <div className="flex flex-1 items-center">
          <div className="max-w-4xl">
            {/* Programme Label */}
            <div className="course-eyebrow mb-5 flex items-center gap-3 sm:mb-6">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-accent-400"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65 sm:text-xs">
                B.E. Programme
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                course-heading
                max-w-4xl
                text-4xl
                font-extrabold
                uppercase
                leading-[0.94]
                tracking-tighter
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-6xl
                xl:text-7xl
              "
            >
              Electrical and
              <br />
              Electronics Engineering
            </h1>

            {/* Tagline */}
            <div className="course-tagline mt-7 flex items-center gap-4 sm:mt-8">
              <span
                aria-hidden="true"
                className="h-px w-12 bg-accent-400 sm:w-16"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/65 sm:text-sm">
                Powering Technology. Enabling Tomorrow.
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Accent */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 z-20 h-1 w-full bg-accent-400"
      />
    </section>
  );
}
