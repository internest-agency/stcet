"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import Button from "../../ui/Button";
import Container from "../../ui/Container";
import { FaCircleArrowRight } from "react-icons/fa6";

gsap.registerPlugin(SplitText);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // --------------------------------
      // Background
      // --------------------------------
      timeline.fromTo(
        ".hero-background",
        {
          scale: 1.12,
        },
        {
          scale: 1,
          duration: 2,
          ease: "power2.out",
        },
        0,
      );

      // --------------------------------
      // Overlay
      // --------------------------------
      timeline.fromTo(
        ".hero-overlay",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.2,
        },
        0,
      );

      // --------------------------------
      // Eyebrow
      // --------------------------------
      timeline.from(
        ".hero-eyebrow",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        0.4,
      );

      // --------------------------------
      // Heading
      // --------------------------------
      const heading = sectionRef.current?.querySelector(
        ".hero-heading",
      ) as HTMLElement | null;

      if (heading) {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,

          onSplit(self) {
            timeline.from(
              self.lines,
              {
                yPercent: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: "power4.out",
              },
              0.55,
            );
          },
        });
      }

      // --------------------------------
      // Description
      // --------------------------------
      timeline.from(
        ".hero-description",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        0.95,
      );

      // --------------------------------
      // CTA
      // --------------------------------
      timeline.from(
        ".hero-cta",
        {
          opacity: 0,
          y: 25,
          scale: 0.96,
          duration: 0.7,
          ease: "back.out(1.4)",
        },
        1.2,
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[500] lg:h-screen overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background */}
      <div
        className="hero-background absolute inset-0 bg-[url('/images/hero-section-image.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />

      {/* Overlay */}
      <div
        className="hero-overlay absolute inset-0 bg-black/70"
        aria-hidden="true"
      />

      {/* Content */}
      <Container className="relative z-10 flex h-full max-w-3xl flex-col items-center justify-end py-20 text-center">
        {/* Eyebrow */}
        <p className="hero-eyebrow mb-1 text-sm uppercase font-bold tracking-widest text-accent-400">
          An AICTE Approved Engineering College
        </p>

        {/* Heading */}
        <h1 className="hero-heading mb-4 text-2xl md:text-5xl font-bold text-white leading-tight">
          S. Thangapazham College of Engineering and Technology
        </h1>

        {/* Description */}
        <p className="hero-description mb-8 text-lg text-gray-100">
          Empowering future engineers through quality technical education,
          innovation and ethical values.
        </p>

        {/* CTA */}
        <div className="hero-cta">
          <Button
            href="/admissions"
            variant="secondary"
            size="md"
            rightIcon={<FaCircleArrowRight />}
          >
            Start Your Journey
          </Button>
        </div>
      </Container>
    </section>
  );
}
