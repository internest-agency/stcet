"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const learningAreas = [
  "Programming and computational thinking",
  "Data structures and algorithms",
  "Database management",
  "Computer networks and operating systems",
  "Artificial intelligence",
  "Machine learning",
  "Data analytics and pattern recognition",
  "Deep learning and neural networks",
  "Natural language processing",
  "Computer vision",
];

export default function CSEAILearning() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(".learning-heading");
      const items = gsap.utils.toArray<HTMLElement>(".learning-item");
      const note = section.querySelector(".learning-note");

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
                x: -25,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.04,
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
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
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
                What You Will Learn
              </span>
            </div>

            <h2 className="learning-heading max-w-md text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
              From computing foundations to intelligent systems.
            </h2>

            <p className="mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The programme builds a strong foundation in areas such as:
            </p>
          </div>

          {/* Learning List */}
          <div className="border-t border-gray-200">
            {learningAreas.map((item, index) => (
              <div
                key={item}
                className="learning-item group relative flex items-center gap-5 border-b border-gray-200 py-5 sm:gap-7 sm:py-6"
              >
                <span className="w-8 shrink-0 text-xs font-black tracking-[0.15em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700 sm:w-10">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-6 shrink-0 bg-accent-400 transition-all duration-300 group-hover:w-10"
                />

                <span className="text-base font-bold tracking-[-0.01em] text-gray-800 transition-transform duration-300 group-hover:translate-x-1 sm:text-lg">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progression Statement */}
        <div className="learning-note relative mt-14 border-l-2 border-accent-400 bg-white px-6 py-7 sm:mt-16 sm:px-8 sm:py-9 lg:mt-20 lg:ml-[calc(30%+20px)]">
          <p className="max-w-3xl text-lg font-bold leading-8 text-primary-700 sm:text-xl sm:leading-9">
            Students progressively move from fundamental concepts to applying
            these technologies to real-world problems.
          </p>
        </div>
      </Container>
    </section>
  );
}
