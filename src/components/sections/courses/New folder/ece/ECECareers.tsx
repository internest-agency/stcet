"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const careers = [
  "Electronics Engineer",
  "Embedded Systems Engineer",
  "Communication Engineer",
  "VLSI Design Engineer",
  "Network Engineer",
  "IoT Engineer",
  "Hardware Design Engineer",
  "Systems Engineer",
  "Test Engineer",
  "Software Professional",
];

export default function ECECareers() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(".career-heading");
      const intro = section.querySelector(".career-intro");
      const items = gsap.utils.toArray<HTMLElement>(".career-item");
      const note = section.querySelector(".career-note");

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
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
            );
          },
        });
      }

      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                x: -20,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.045,
                ease: "power3.out",
              },
            );
          },
        });
      });

      if (note) {
        ScrollTrigger.create({
          trigger: note,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              note,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
            );
          },
        });
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-white">
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Career Pathways
              </span>
            </div>

            <h2 className="career-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
              Build a career across connected technologies.
            </h2>

            <p className="career-intro mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              ECE graduates have the flexibility to explore careers across
              electronics, communication, embedded systems, technology and
              software.
            </p>
          </div>

          {/* Careers */}
          <div>
            <div className="border-t border-gray-200">
              {careers.map((career, index) => (
                <div
                  key={career}
                  className="career-item group relative grid grid-cols-[52px_1fr] items-center gap-4 border-b border-gray-200 py-6 sm:grid-cols-[70px_1fr] sm:py-7"
                >
                  <span className="text-xs font-black tracking-[0.18em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xl font-extrabold tracking-[-0.025em] text-gray-900 transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl lg:text-3xl">
                      {career}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full bg-accent-400 transition-transform duration-300 group-hover:scale-150"
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
                  />
                </div>
              ))}
            </div>

            <p className="career-note mt-8 border-l-2 border-accent-400 pl-5 text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
              The discipline also offers opportunities for higher studies and
              specialisation in electronics, communication, embedded systems,
              VLSI and related fields.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
