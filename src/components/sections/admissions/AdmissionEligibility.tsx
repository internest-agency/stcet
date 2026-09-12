"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const eligibility = [
  {
    category: "General (OC)",
    percentage: "45%",
  },
  {
    category: "BC / BCM",
    percentage: "40%",
  },
  {
    category: "MBC & DNC",
    percentage: "40%",
  },
  {
    category: "SC / SCA / ST",
    percentage: "40%",
  },
];

export default function AdmissionEligibility() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".eligibility-heading",
      ) as HTMLElement | null;

      const rows = sectionRef.current?.querySelectorAll(".eligibility-row");

      const note = sectionRef.current?.querySelector(
        ".eligibility-note",
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
            rows,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.07,
              delay: 0.2,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            note,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.55,
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
                Academic Eligibility
              </span>
            </div>

            <h2 className="eligibility-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:text-5xl">
              Minimum
              <br />
              Academic
              <br />
              Requirements.
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
              Academic minimum mark requirements based on PCM average.
            </p>
          </div>

          <div>
            <div className="border-t border-gray-200">
              {eligibility.map((item, index) => (
                <div
                  key={item.category}
                  className="eligibility-row group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-gray-200 py-6 transition-colors duration-300 hover:bg-white sm:py-7"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs font-bold text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-base font-bold text-gray-700 transition-colors group-hover:text-primary-700 sm:text-lg">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-2xl font-black tracking-tight text-primary-700 sm:text-3xl">
                    {item.percentage}
                  </span>
                </div>
              ))}
            </div>

            <div className="eligibility-note mt-10 border-l-2 border-accent-400 bg-white px-6 py-6 sm:px-8">
              <p className="text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                This applies to both TNEA through Counseling and Management
                Quota.
              </p>

              <p className="mt-5 text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
                As noted in the{" "}
                <Link
                  href="https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary-700 underline decoration-accent-400 underline-offset-4 transition-colors hover:text-accent-500"
                >
                  TNEA Information Brochure 2026
                </Link>
                , “Tamil Nadu native candidates alone will be considered for
                communal reservation.”
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
