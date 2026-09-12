"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const admissionRoutes = [
  {
    number: "01",
    title: "TNEA Government Quota",
    description:
      "Apply through the TNEA website and participate in the online counselling process based on eligibility, rank, category and seat availability.",
  },
  {
    number: "02",
    title: "Management Quota",
    description:
      "Eligible candidates may also apply under the Management Quota as per Government and AICTE regulations.",
  },
];

export default function AdmissionOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".admission-overview-heading",
      ) as HTMLElement | null;

      const cards = sectionRef.current?.querySelectorAll(".admission-route");

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
            cards,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              delay: 0.25,
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
                Admission Routes
              </span>
            </div>

            <h2 className="admission-overview-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Choose Your
              <br />
              Pathway
              <br />
              To STCET.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {admissionRoutes.map((route) => (
              <div
                key={route.number}
                className="admission-route group relative overflow-hidden border border-gray-200 bg-gray-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-700 hover:bg-primary-700 sm:p-8"
              >
                <span className="text-xs font-bold tracking-[0.18em] text-gray-400 transition-colors duration-300 group-hover:text-white/50">
                  {route.number}
                </span>

                <h3 className="mt-12 text-xl font-extrabold tracking-tight text-primary-700 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                  {route.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-600 transition-colors duration-300 group-hover:text-white/70 sm:text-base sm:leading-7">
                  {route.description}
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
