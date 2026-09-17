"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

export default function EnquirySupport() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".enquiry-support-content",
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
        <div className="enquiry-support-content relative overflow-hidden bg-primary-700 px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-10 select-none text-[10rem] font-black leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[14rem] lg:text-[18rem]"
          >
            01
          </span>

          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1 bg-accent-400"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[180px_1fr] lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                  Enquiry
                </span>
              </div>
            </div>

            <div className="max-w-4xl">
              <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Have Questions About Your Engineering Journey?
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                Submit your enquiry with the required details. Our team can
                assist you with information related to courses, admissions and
                your enquiry.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
