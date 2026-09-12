"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ManagementQuota() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".management-heading",
      ) as HTMLElement | null;

      const content = sectionRef.current?.querySelector(
        ".management-content",
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
            content,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
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
    <section
      id="management-quota"
      ref={sectionRef}
      className="bg-primary-700 text-white"
    >
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Management Quota
              </span>
            </div>

            <h2 className="management-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Another
              <br />
              Pathway
              <br />
              To STCET.
            </h2>
          </div>

          <div className="management-content max-w-3xl">
            <p className="text-lg font-medium leading-8 text-white sm:text-2xl sm:leading-9">
              Eligible candidates may also apply under the Management Quota as
              per Government and AICTE regulations.
            </p>

            <div className="mt-10 border-t border-white/15 pt-8">
              <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Fill and submit the Enquiry Form for more information.
              </p>

              <Link
                href="/enquire-now"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-accent-400 px-7 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-accent-500"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div className="h-1 w-full bg-accent-400" />
    </section>
  );
}
