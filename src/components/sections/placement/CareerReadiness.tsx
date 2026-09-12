"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const trainingInitiatives = [
  {
    number: "01",
    title: "Aptitude & Logical Reasoning",
    description:
      "Building quantitative, analytical and problem-solving abilities.",
  },
  {
    number: "02",
    title: "Communication Skills",
    description:
      "Developing spoken English, presentation and professional communication.",
  },
  {
    number: "03",
    title: "Technical Skill Development",
    description:
      "Strengthening core technical knowledge relevant to students' chosen disciplines.",
  },
  {
    number: "04",
    title: "Programming & Coding",
    description:
      "Developing coding ability and computational problem-solving skills.",
  },
  {
    number: "05",
    title: "Resume & Profile Building",
    description:
      "Helping students present their skills, projects and achievements effectively.",
  },
  {
    number: "06",
    title: "Group Discussions & Interviews",
    description:
      "Preparing students for different stages of recruitment processes.",
  },
  {
    number: "07",
    title: "Soft Skills & Professional Skills",
    description:
      "Developing teamwork, leadership, workplace etiquette and professional confidence.",
  },
  {
    number: "08",
    title: "Career Awareness",
    description:
      "Helping students understand career options, industry expectations and opportunities for higher studies.",
  },
];

export default function CareerReadiness() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".career-readiness-heading",
      ) as HTMLElement | null;

      const cards = sectionRef.current?.querySelectorAll(".training-card");

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
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
            cards,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.06,
              delay: 0.2,
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
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Building Career Readiness
              </span>
            </div>

            <h2 className="career-readiness-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Preparing
              <br />
              Students
              <br />
              For Careers.
            </h2>

            <p className="mt-7 max-w-sm text-base leading-7 text-gray-500">
              Placement preparation begins well before the final year. Students
              are encouraged to progressively develop the technical, analytical
              and interpersonal skills expected in today's workplace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trainingInitiatives.map((item) => (
              <div
                key={item.number}
                className="training-card group relative overflow-hidden border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-700 hover:bg-primary-700 sm:p-7"
              >
                <span className="text-xs font-bold tracking-[0.16em] text-gray-400 transition-colors group-hover:text-white/50">
                  {item.number}
                </span>

                <h3 className="mt-8 text-base font-extrabold leading-6 text-primary-700 transition-colors group-hover:text-white sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500 transition-colors group-hover:text-white/70">
                  {item.description}
                </p>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-1 w-0 bg-accent-400 transition-all duration-500 group-hover:w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
