"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const councilMembers = [
  {
    number: "01",
    name: "Shri.Murugesan T",
    role: "Chairman",
  },
  {
    number: "02",
    name: "Shri.Balakrishnan G",
    role: "Trust Nominee",
  },
  {
    number: "03",
    name: "Shri.Murugaiah A",
    role: "Trust Nominee",
  },
  {
    number: "04",
    name: "Shri.Tamil Veeran R",
    role: "Academic Expert",
  },
  {
    number: "05",
    name: "Shri.Bala Murugan C",
    role: "Academic Expert",
  },
  {
    number: "06",
    name: "Prof.Dr.Manikandan V",
    role: "Faculty from Affiliated College",
  },
  {
    number: "07",
    name: "Shri.Rajkumar C",
    role: "Industrial Expert",
  },
  {
    number: "08",
    name: "Prof.Dr.Sundaram M",
    role: "Member Secretary (ex-officio)",
  },
];

export default function GoverningCouncil() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const eyebrow = sectionRef.current?.querySelector(
        ".council-eyebrow",
      ) as HTMLElement | null;

      const heading = sectionRef.current?.querySelector(
        ".council-heading",
      ) as HTMLElement | null;

      const intro = sectionRef.current?.querySelector(
        ".council-intro",
      ) as HTMLElement | null;

      const rows = gsap.utils.toArray<HTMLElement>(".council-row");

      // Eyebrow
      if (eyebrow) {
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              eyebrow,
              {
                opacity: 0,
                y: 15,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Heading
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

      // Intro
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

      // Council rows
      rows.forEach((row, index) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              row,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                delay: index * 0.04,
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
    <section ref={sectionRef} className="overflow-hidden bg-white">
      <Container className="pt-20  sm:pt-24 lg:pt-32">
        {/* -------------------------------------------------
            INTRO
        ------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[0.80fr_1.25fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="council-eyebrow mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Governing Council
              </span>
            </div>

            <h2 className="council-heading max-w-md text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-2xl lg:text-5xl uppercase">
              Leadership with purpose.
            </h2>
          </div>

          {/* Intro */}
          <div className="lg:pt-8">
            <p className="council-intro max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The Governing Council brings together institutional leadership,
              academic expertise, faculty representation and industry experience
              to guide the academic and developmental direction of the
              institution.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------
            COUNCIL DIRECTORY
        ------------------------------------------------- */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          {/* Desktop heading */}
          <div className="hidden border-y border-gray-200 py-4 sm:grid sm:grid-cols-[72px_1fr_280px_auto] sm:gap-8 lg:grid-cols-[100px_1fr_280px_auto] lg:gap-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              No.
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Council Member
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Role
            </span>

            <span />
          </div>

          <div className="border-t border-gray-200 sm:border-t-0">
            {councilMembers.map((member) => (
              <article
                key={member.number}
                className="council-row group relative overflow-hidden border-b border-gray-200 py-7 sm:py-8 lg:py-9"
              >
                {/* Hover background */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-gray-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />

                {/* Bottom accent */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 z-10 h-0.5 w-0 bg-accent-400 transition-all duration-500 ease-out group-hover:w-full"
                />

                <div className="relative grid gap-5 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:gap-8 lg:grid-cols-[100px_1fr_280px_auto] lg:gap-10">
                  {/* Number */}
                  <div className="flex items-start">
                    <span className="text-sm font-black tracking-[0.18em] text-gray-300 transition-colors duration-300 group-hover:text-primary-700">
                      {member.number}
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <p className="text-xl font-extrabold tracking-[-0.02em] text-gray-900 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:text-2xl lg:text-3xl">
                      {member.name}
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400 transition-colors duration-300 group-hover:text-primary-700">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-accent-400"
                      />
                      {member.role}
                    </span>
                  </div>

                  {/* Indicator */}
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-all duration-500 ease-out group-hover:border-primary-700 group-hover:bg-primary-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-700 transition-transform duration-300 group-hover:scale-150 group-hover:bg-white" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
