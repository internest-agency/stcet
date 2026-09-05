"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function OurLegacy() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".legacy-heading",
      ) as HTMLElement | null;

      const intro = sectionRef.current?.querySelector(
        ".legacy-intro",
      ) as HTMLElement | null;

      const timelineItems = gsap.utils.toArray<HTMLElement>(
        ".legacy-timeline-item",
      );

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

      timelineItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: 35,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.08,
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
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 xl:gap-28">
          {/* Left editorial column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Our Legacy
              </span>
            </div>

            <h2 className="legacy-heading max-w-lg text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl lg:text-5xl uppercase">
              A vision rooted
              <br />
              in education.
            </h2>

            <p className="legacy-intro mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Our journey is built on a commitment to education,
              institution-building and creating meaningful opportunities for
              students to shape their future.
            </p>

            <div className="mt-10 hidden border-l-2 border-accent-400 pl-5 lg:block">
              <span className="block text-4xl font-black tracking-tight text-primary-700">
                2010
              </span>

              <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
                Educational Trust Established
              </span>
            </div>
          </div>

          {/* Right timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[7px] top-0 w-px bg-gray-200 sm:left-[9px]"
            />

            <div className="space-y-0">
              {/* 01 */}
              <article className="legacy-timeline-item relative pb-14 pl-10 sm:pb-16 sm:pl-14">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-white bg-accent-400 ring-1 ring-accent-400 sm:h-[19px] sm:w-[19px]"
                />

                <div className="mb-4 flex items-center gap-4">
                  <span className="text-xs font-bold tracking-[0.2em] text-gray-400">
                    01
                  </span>

                  <span className="h-px w-8 bg-gray-300" />

                  <span className="text-sm font-extrabold tracking-tight text-primary-700">
                    2010
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  The Beginning of a Vision
                </h3>

                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  S. Thangapazham College of Engineering and Technology is part
                  of the Thiru K. Subramania Nadar and Smt. Vadivoo Ammal
                  Educational Trust, established in 2010 by Thiru. S.
                  Thangapazham, a distinguished industrialist and
                  philanthropist.
                </p>
              </article>

              {/* 02 */}
              <article className="legacy-timeline-item relative pb-14 pl-10 sm:pb-16 sm:pl-14">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-white bg-primary-700 ring-1 ring-primary-700 sm:h-[19px] sm:w-[19px]"
                />

                <div className="mb-4 flex items-center gap-4">
                  <span className="text-xs font-bold tracking-[0.2em] text-gray-400">
                    02
                  </span>

                  <span className="h-px w-8 bg-gray-300" />

                  <span className="text-sm font-extrabold tracking-tight text-primary-700">
                    The Trust
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Honouring a Family Legacy
                </h3>

                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  The Trust was founded in honour of Thiru. S.
                  Thangapazham&apos;s parents, Shri. K. Subramania Nadar and
                  Smt. Vadivoo Ammal, with a vision to contribute to education
                  and expand access to quality higher education.
                </p>
              </article>

              {/* 03 */}
              <article className="legacy-timeline-item relative pl-10 sm:pl-14">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-white bg-accent-400 ring-1 ring-accent-400 sm:h-[19px] sm:w-[19px]"
                />

                <div className="mb-4 flex items-center gap-4">
                  <span className="text-xs font-bold tracking-[0.2em] text-gray-400">
                    03
                  </span>

                  <span className="h-px w-8 bg-gray-300" />

                  <span className="text-sm font-extrabold tracking-tight text-primary-700">
                    Today
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Building the Next Chapter
                </h3>

                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  This vision continues through S. Thangapazham College of
                  Engineering and Technology, creating an environment where
                  students can learn, innovate, develop their capabilities and
                  prepare for a changing world.
                </p>
              </article>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom transition */}
      <div className="h-px w-full bg-gray-200" />
    </section>
  );
}
