"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const cutoff = [
  {
    subject: "Mathematics",
    marks: "100",
  },
  {
    subject: "Physics",
    marks: "50",
  },
  {
    subject: "Chemistry",
    marks: "50",
  },
];

export default function TNEACutoff() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(
        ".cutoff-heading",
      ) as HTMLElement | null;

      const cards = Array.from(section.querySelectorAll(".cutoff-card"));

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            split.lines,
            {
              yPercent: 100,
            },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.1,
                delay: 0.25,
                ease: "power3.out",
              },
            );
          }
        },
      });

      return () => {
        trigger.kill();
        split.revert();
      };
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Cut Off Calculation
              </span>
            </div>

            <h2 className="cutoff-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Engineering
              <br />
              Cutoff
              <br />
              Out Of 200.
            </h2>
          </div>

          {/* Content */}
          <div>
            <p className="mb-8 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The cutoff is calculated out of <strong>200 marks</strong>.
              Physics and Chemistry marks are scaled to 50 each.
            </p>

            {/* Cutoff Cards */}
            <div className="grid border-y border-gray-200 sm:grid-cols-3">
              {cutoff.map((item, index) => (
                <div
                  key={item.subject}
                  className={`cutoff-card group border-gray-200 p-6 transition-colors duration-300 hover:bg-primary-700 sm:p-7 lg:p-8 ${
                    index !== 0 ? "border-t sm:border-l sm:border-t-0" : ""
                  }`}
                >
                  <span className="text-xs font-bold text-gray-400 transition-colors duration-300 group-hover:text-white/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-8 block text-4xl font-black tracking-[-0.04em] text-primary-700 transition-colors duration-300 group-hover:text-white sm:text-5xl">
                    {item.marks}
                  </span>

                  <span className="mt-2 block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors duration-300 group-hover:text-white/70">
                    {item.subject}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation */}
            <div className="mt-8 border-l-2 border-accent-400 bg-gray-50 px-6 py-5 sm:px-8">
              <p className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                Mathematics: 100 marks + Physics: 50 marks + Chemistry: 50 marks
                = <strong className="text-primary-700">200 marks</strong>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
