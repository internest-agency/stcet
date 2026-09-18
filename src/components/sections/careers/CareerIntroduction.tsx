"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const applicationSteps = [
  "Personal information",
  "Academic qualifications",
  "Position and department preference",
  "Faculty-specific information",
  "Professional experience",
  "Resume / CV and declaration",
];

export default function CareerIntroduction() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".career-intro-item",
            {
              opacity: 0,
              y: 25,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            },
          );
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container className="pt-14 sm:pt-18 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Application Form
              </span>
            </div>

            <h2 className="mt-6 max-w-sm text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-primary-700 sm:text-4xl">
              Your Next
              <br />
              Career
              <br />
              Opportunity.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl sm:leading-9">
              Please provide the requested information below to help us
              understand your qualifications, experience and areas of interest.
            </p>

            <div className="mt-10 grid border-y border-gray-200 sm:grid-cols-2">
              {applicationSteps.map((item, index) => (
                <div
                  key={item}
                  className={`career-intro-item flex gap-5 py-6 ${
                    index % 2 !== 0
                      ? "sm:border-l sm:border-gray-200 sm:pl-7"
                      : "sm:pr-7"
                  } ${index >= 2 ? "border-t border-gray-200" : ""}`}
                >
                  <span className="shrink-0 text-sm font-black tracking-[0.08em] text-accent-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm font-semibold leading-6 text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
