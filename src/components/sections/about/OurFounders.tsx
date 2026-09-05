"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function OurFounders() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".founders-heading",
      ) as HTMLElement | null;

      const intro = sectionRef.current?.querySelector(
        ".founders-intro",
      ) as HTMLElement | null;

      const founderItems = gsap.utils.toArray<HTMLElement>(".founder-item");

      // Heading animation
      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              split.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              },
            );
          },
        });
      }

      // Introduction animation
      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              intro,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Founder animations
      founderItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: 40,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                delay: index * 0.1,
                ease: "power3.out",
              },
            );
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container className="py-20 sm:py-24 lg:py-32">
        {/* -------------------------------------------------
            SECTION INTRO
        ------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Our Founders
              </span>
            </div>

            <h2 className="founders-heading max-w-md text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl lg:text-5xl uppercase">
              People behind
              <br />
              the vision.
            </h2>
          </div>

          {/* Intro */}
          <div className="lg:pt-8">
            <p className="founders-intro max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The institution carries forward a vision shaped by leadership,
              commitment to education and a desire to create meaningful
              opportunities for students and society.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------
            FOUNDERS
        ------------------------------------------------- */}
        <div className="mt-16 border-t border-gray-200 sm:mt-20 lg:mt-24">
          {/* =================================================
              FOUNDER 01
          ================================================= */}
          <article className="founder-item grid border-b border-gray-200 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Image */}
            <div className="relative aspect-[4/4.5] overflow-hidden bg-gray-200 sm:aspect-[4/4] lg:aspect-auto lg:min-h-[560px]">
              <Image
                src="/images/gallery/stcet-engineering-block-entrance.jpg"
                alt="S. Thangapazham"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale transition-transform duration-700 ease-out hover:scale-105"
              />

              {/* Image overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary-900/50 via-transparent to-transparent"
                aria-hidden="true"
              />

              {/* Number */}
              <span
                aria-hidden="true"
                className="absolute bottom-6 left-6 text-[5rem] font-black leading-none tracking-[-0.08em] text-white/20 sm:text-[7rem]"
              >
                01
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
              <div>
                {/* Label */}
                <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    Founder
                  </span>

                  <span className="text-xs font-bold tracking-[0.18em] text-primary-700">
                    01
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-3xl font-extrabold tracking-[-0.025em] text-gray-900 sm:text-4xl">
                  Thiru. S. Thangapazham
                </h3>

                {/* Role */}
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-400">
                  Chairman
                </p>

                {/* Description */}
                <p className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  Thiru. S. Thangapazham is a distinguished industrialist and
                  philanthropist with a strong commitment to education,
                  institution-building and social development.
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  His vision is to create opportunities for quality learning and
                  provide students with a strong foundation for their future.
                </p>
              </div>

              {/* Highlight */}
              <div className="mt-12 border-l-2 border-accent-400 pl-5">
                <p className="max-w-lg text-sm font-semibold leading-6 text-gray-700">
                  Building institutions that create opportunities, develop
                  capabilities and contribute meaningfully to society.
                </p>
              </div>
            </div>
          </article>

          {/* =================================================
              FOUNDER 02
          ================================================= */}
          <article className="founder-item grid border-b border-gray-200 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Content */}
            <div className="order-2 flex flex-col justify-between p-7 sm:p-10 lg:order-1 lg:p-14 xl:p-16">
              <div>
                {/* Label */}
                <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    Founder
                  </span>

                  <span className="text-xs font-bold tracking-[0.18em] text-primary-700">
                    02
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-3xl font-extrabold tracking-[-0.025em] text-gray-900 sm:text-4xl">
                  Thiru. S.T. Murugesan
                </h3>

                {/* Role */}
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-400">
                  Managing Trustee
                </p>

                {/* Description */}
                <p className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  Thiru. S.T. Murugesan works alongside his father in
                  contributing to the growth and development of the Trust and
                  its educational initiatives.
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  His leadership combines academic excellence with professional
                  skills, discipline and strong values, supporting the
                  institution&apos;s continued development.
                </p>
              </div>

              {/* Highlight */}
              <div className="mt-12 border-l-2 border-primary-700 pl-5">
                <p className="max-w-lg text-sm font-semibold leading-6 text-gray-700">
                  Supporting academic excellence while strengthening the
                  institution&apos;s professional and educational foundations.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative order-1 aspect-[4/4.5] overflow-hidden bg-gray-200 sm:aspect-[4/4] lg:order-2 lg:aspect-auto lg:min-h-[560px]">
              <Image
                src="/images/gallery/stcet-engineering-block-entrance.jpg"
                alt="S.T. Murugesan"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale transition-transform duration-700 ease-out hover:scale-105"
              />

              {/* Image overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary-900/50 via-transparent to-transparent"
                aria-hidden="true"
              />

              {/* Number */}
              <span
                aria-hidden="true"
                className="absolute bottom-6 right-6 text-[5rem] font-black leading-none tracking-[-0.08em] text-white/20 sm:text-[7rem]"
              >
                02
              </span>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
