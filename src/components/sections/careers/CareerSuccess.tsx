"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

export default function CareerSuccess() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".career-success-content",
            {
              opacity: 0,
              y: 30,
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
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="career-success-content relative overflow-hidden bg-primary-700 px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-10 select-none text-[10rem] font-black leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[14rem] lg:text-[18rem]"
          >
            08
          </span>

          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1 bg-accent-400"
          />

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-400 text-sm font-black text-white"
              >
                ✓
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Application Submitted
              </span>
            </div>

            <h2 className="mt-7 text-3xl font-extrabold uppercase leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Thank You for Your
              <br />
              Interest in Joining Us.
            </h2>

            <p className="mt-7 max-w-3xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Your application has been successfully submitted. Our recruitment
              team will review your profile and contact you if your
              qualifications match a current or future opportunity.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
