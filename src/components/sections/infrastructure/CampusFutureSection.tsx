"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function CampusFutureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const heading = headingRef.current;
      const content = contentRef.current;
      const image = imageRef.current;

      if (!heading || !content || !image) return;

      gsap.set(heading, {
        opacity: 0,
        y: 40,
      });

      gsap.set(content, {
        opacity: 0,
        y: 30,
      });

      gsap.set(image, {
        opacity: 0,
        clipPath: "inset(0 0 0 100%)",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      timeline.to(
        heading,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
        },
        0,
      );

      timeline.to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.15,
      );

      timeline.to(
        image,
        {
          opacity: 1,
          clipPath: "inset(0 0 0 0%)",
          duration: 1,
          ease: "power4.out",
        },
        0.15,
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-14 sm:py-18 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-800/45">
                The Campus
              </span>
            </div>

            <SectionHeading as="h2">
              A Campus Designed for the Feature
            </SectionHeading>

            <div ref={contentRef} className="mt-7 max-w-lg">
              <p className="text-gray-700">
                Our campus brings together academic spaces, laboratories and
                student facilities in an environment designed to make college
                life productive and engaging.
              </p>

              <p className="mt-5 text-gray-700">
                From classrooms and laboratories to spaces for study,
                interaction and recreation, the campus is planned to support
                students throughout their academic journey.
              </p>
            </div>
          </div>

          <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/infrastructure/campus.webp"
              alt="STCET campus"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute bottom-0 left-0 bg-white px-5 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary-800">
                Green Campus
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-800/50">
                Bright Futures
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
