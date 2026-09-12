"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const careers = [
  "Electrical Engineer",
  "Power Systems Engineer",
  "Control Systems Engineer",
  "Automation Engineer",
  "Electrical Design Engineer",
  "Power Electronics Engineer",
  "Maintenance Engineer",
  "Renewable Energy Engineer",
  "Electrical Testing Engineer",
  "Systems Engineer",
];

export default function EEECareers() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".eee-careers-heading",
      ) as HTMLElement | null;

      const items = sectionRef.current?.querySelectorAll(".eee-career-item");

      const additional = sectionRef.current?.querySelector(
        ".eee-careers-additional",
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
            items,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
              delay: 0.25,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            additional,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.7,
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
    <section ref={sectionRef} className="bg-gray-50">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Career Pathways
              </span>
            </div>

            <h2 className="eee-careers-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Build Your
              <br />
              Career
              <br />
              With Purpose.
            </h2>
          </div>

          <div>
            <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              EEE graduates can pursue opportunities across core electrical
              industries, infrastructure, manufacturing, automation, energy and
              technology.
            </p>

            <div className="border-t border-gray-200">
              {careers.map((career, index) => (
                <div
                  key={career}
                  className="eee-career-item group flex items-center gap-5 border-b border-gray-200 py-5 transition-all duration-300 hover:bg-white sm:py-6"
                >
                  <span className="w-8 shrink-0 text-xs font-bold text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-primary-700 sm:text-lg">
                    {career}
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-lg text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
              ))}
            </div>

            <div className="eee-careers-additional mt-8 border-l-2 border-accent-400 bg-white px-6 py-6 sm:px-8">
              <p className="text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                The programme also provides a foundation for higher studies and
                specialised careers in power systems, renewable energy,
                automation, control and related areas.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
