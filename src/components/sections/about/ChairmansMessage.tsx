"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText);

export default function ChairmansMessage() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const eyebrow = section.querySelector(".chairman-eyebrow");
      const heading = section.querySelector(".chairman-heading");
      const quote = section.querySelector(".chairman-quote");
      const paragraphs = section.querySelectorAll(".chairman-paragraph");
      const signature = section.querySelector(".chairman-signature");
      const image = section.querySelector(".chairman-image");

      if (!eyebrow || !heading || !quote || !signature || !image) {
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
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        image,
        {
          opacity: 0,
          y: 30,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
        },
        0,
      )
        .fromTo(
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
          0.15,
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
          0.25,
        )
        .fromTo(
          quote,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          0.45,
        )
        .fromTo(
          paragraphs,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          0.6,
        )
        .fromTo(
          signature,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          0.85,
        );
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-800 text-white"
    >
      {/* Decorative quotation mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-12 select-none text-[18rem] font-black leading-none text-white/[0.035] sm:-right-2 sm:text-[24rem] lg:right-4 lg:-top-20 lg:text-[30rem]"
      >
        &ldquo;
      </div>

      <Container className="relative z-10 py-20 sm:py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
          {/* Left heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="chairman-eyebrow mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                Chairman&apos;s Message
              </span>
            </div>

            <h2 className="chairman-heading max-w-md mb-6 text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-5xl">
              Education is
              <br />
              more than
              <br />
              knowledge.
            </h2>

            {/* Chairman Image Placeholder */}
            <div className="chairman-image relative mb-8 aspect-[4/5] max-w-sm overflow-hidden bg-primary-700/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5 sm:h-32 sm:w-32">
                    <Image
                      src="/images/gallery/user.png"
                      width={120}
                      height={120}
                      alt="chairman-image"
                      className="h-full w-full"
                    />
                  </div>

                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Chairman
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white/60">
                    Thiru. S. Thangapazham
                  </p>
                </div>
              </div>

              {/* Accent line */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-24 bg-accent-400"
              />
            </div>

            {/* Decorative line */}
            <div className="mt-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                A message from our Chairman
              </span>
            </div>
          </div>

          {/* Right content */}
          <div className="relative">
            {/* Large quote */}
            <div className="chairman-quote">
              <p className="max-w-3xl text-lg font-medium leading-8 tracking-[-0.01em] text-white sm:text-2xl sm:leading-9 lg:text-2xl lg:leading-10">
                At S. Thangapazham College of Engineering and Technology, we
                believe that education is not merely about acquiring knowledge;
                it is about developing the ability to think, question, create
                and contribute. Engineering, in particular, calls for a strong
                foundation in fundamentals, a practical approach to
                problem-solving and the ability to adapt to a constantly
                changing world.
              </p>
            </div>

            {/* Remaining message */}
            <div className="mt-10 max-w-3xl space-y-6 border-t border-white/15 pt-10">
              <p className="chairman-paragraph text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Our endeavour is to create an academic environment where
                students are encouraged to explore their potential, embrace new
                ideas and develop the confidence to pursue their aspirations.
                Alongside academic and technical competence, we place great
                importance on discipline, integrity, responsibility and respect
                for others.
              </p>

              <p className="chairman-paragraph text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                As an institution, our aspiration is to nurture capable
                professionals and grounded individuals who are prepared not only
                for the opportunities of today, but also for the challenges and
                possibilities of tomorrow.
              </p>
            </div>

            {/* Signature */}
            <div className="chairman-signature mt-12 border-t border-white/15 pt-7 sm:mt-14">
              <p className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Thiru. S. Thangapazham
              </p>

              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-accent-400">
                Chairman
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-accent-400" />
    </section>
  );
}
