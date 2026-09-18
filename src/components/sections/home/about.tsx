"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      // --------------------------------
      // Main Heading
      // --------------------------------
      const heading = sectionRef.current?.querySelector(
        ".about-heading",
      ) as HTMLElement | null;

      if (heading) {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,

          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              opacity: 0,
              duration: 1,
              stagger: 0.12,
              ease: "power4.out",

              scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                once: true,
              },
            });
          },
        });
      }

      // --------------------------------
      // Description Paragraphs
      // --------------------------------
      const paragraphs = gsap.utils.toArray<HTMLElement>(".about-description");

      gsap.from(paragraphs, {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.18,
        ease: "power3.out",

        scrollTrigger: {
          trigger: paragraphs[0],
          start: "top 85%",
          once: true,
        },
      });

      // --------------------------------
      // Stats Cards
      // --------------------------------
      const stats = gsap.utils.toArray<HTMLElement>(".about-stat");

      gsap.from(stats, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",

        scrollTrigger: {
          trigger: stats[0],
          start: "top 85%",
          once: true,
        },
      });

      // --------------------------------
      // Stat Numbers
      // --------------------------------
      const numbers = gsap.utils.toArray<HTMLElement>(".about-stat-number");

      gsap.from(numbers, {
        opacity: 0,
        scale: 0.8,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.5)",

        scrollTrigger: {
          trigger: stats[0],
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20" aria-labelledby="about-heading">
      {/* --------------------------------
          Introduction
      -------------------------------- */}
      <Container className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* Heading */}
        <div>
          <h2
            id="about-heading"
            className="about-heading lg:mb-4 uppercase lg:pr-12 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900"
          >
            Enabling Aspirations Through Quality Engineering Education.
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-5">
          <p className="about-description">
            S. Thangapazham College of Engineering and Technology was
            established with a clear vision to provide quality technical
            education and equip students with the knowledge and capabilities
            required to succeed in a rapidly evolving world.
          </p>

          <p className="about-description">
            Located in Vasudevanallur, Tenkasi District, Tamil Nadu, the
            institution combines academic excellence, professional development
            and strong values to create a learning environment where students
            can learn, innovate and grow.
          </p>
        </div>
      </Container>

      {/* --------------------------------
          Statistics
      -------------------------------- */}
      <Container className="grid grid-cols-1 items-center gap-0 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat 01 */}
        <div className="about-stat border border-gray-300 px-6 py-8 text-gray-900 transition-colors duration-300 hover:bg-accent-400 hover:text-white">
          <h3 className="about-stat-number text-4xl font-semibold">05</h3>

          <p>Engineering Programmes</p>
        </div>

        {/* Stat 02 */}
        <div className="about-stat border border-gray-300 px-6 py-8 text-gray-900 transition-colors duration-300 hover:bg-accent-400 hover:text-white">
          <h3 className="about-stat-number text-4xl font-semibold">AICTE</h3>

          <p>Approved Institution</p>
        </div>

        {/* Stat 03 */}
        <div className="about-stat border border-gray-300 px-6 py-8 text-gray-900 transition-colors duration-300 hover:bg-accent-400 hover:text-white">
          <h3 className="about-stat-number text-4xl font-semibold">AU</h3>

          <p>Anna University Affiliated</p>
        </div>

        {/* Stat 04 */}
        <div className="about-stat border border-gray-300 px-6 py-8 text-gray-900 transition-colors duration-300 hover:bg-accent-400 hover:text-white">
          <h3 className="about-stat-number text-4xl font-semibold">2010</h3>

          <p>Educational Trust Founded</p>
        </div>
      </Container>
    </section>
  );
}
