"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function PlacementHead() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".placement-head-heading",
      ) as HTMLElement | null;

      const image = sectionRef.current?.querySelector(
        ".placement-head-image",
      ) as HTMLElement | null;

      const content = sectionRef.current?.querySelector(
        ".placement-head-content",
      ) as HTMLElement | null;

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            split.lines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          gsap.fromTo(
            image,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.2,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            content,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.3,
              ease: "power3.out",
            },
          );
        },
      });

      return () => split.revert();
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Placement Leadership
              </span>
            </div>

            <h2 className="placement-head-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Guiding
              <br />
              Students
              <br />
              Towards Careers.
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-[260px_1fr] sm:gap-12">
            {/* Photo placeholder */}
            <div className="placement-head-image">
              <div className="relative aspect-[3/4] overflow-hidden border border-gray-200 bg-gray-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-3xl font-black tracking-tight text-primary-700/15">
                      B. RAJESH
                    </span>

                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Photograph
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-lg font-extrabold tracking-tight text-primary-700">
                  Mr. B. Rajesh
                </p>

                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-400">
                  Placement Cell
                </p>
              </div>
            </div>

            <div className="placement-head-content max-w-2xl">
              <p className="text-lg font-medium leading-8 text-gray-700 sm:text-2xl sm:leading-9">
                The Placement Cell is headed by <strong>Mr. B. Rajesh</strong>{" "}
                who will be working closely with students and departments to
                identify career aspirations, strengthen employability skills and
                facilitate opportunities for interaction with the industry.
              </p>

              {/* Qualifications placeholder */}
              <div className="mt-10 border-t border-gray-200 pt-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Qualifications
                </span>

                <div className="mt-4 min-h-20 border border-dashed border-gray-300 bg-gray-50 px-5 py-4">
                  <p className="text-sm leading-6 text-gray-400">
                    Add qualifications and professional details here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
