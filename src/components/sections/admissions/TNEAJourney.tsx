"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Online Registration",
    description:
      "Visit the official TNEA portal, create your account using your email or mobile number, generate a password and log in.",
  },
  {
    number: "02",
    title: "Fill Application Form",
    description:
      "Enter your personal, parent or guardian, address, community, Class 12 academic and school details.",
  },
  {
    number: "03",
    title: "Upload Documents",
    description:
      "Upload the required certificates, photograph, signature and other supporting documents.",
  },
  {
    number: "04",
    title: "Pay Application Fee",
    description:
      "Pay the applicable application fee through debit card, credit card, UPI or net banking.",
  },
  {
    number: "05",
    title: "Certificate Verification",
    description:
      "Complete certificate verification through the applicable online process or TNEA Facilitation Centre.",
  },
  {
    number: "06",
    title: "Random Number Generation",
    description:
      "A random number is generated and may be used as one of the tie-breakers when candidates have identical merit.",
  },
  {
    number: "07",
    title: "Rank List",
    description:
      "The rank list is prepared using normalized Class 12 marks in Mathematics, Physics and Chemistry.",
  },
  {
    number: "08",
    title: "Counselling",
    description:
      "Pay the counselling fee, fill and lock your preferred choices and participate in seat allotment.",
  },
  {
    number: "09",
    title: "Report to College",
    description:
      "Download the provisional allotment, report to the allotted college and complete the admission formalities.",
  },
];

export default function TNEAJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const line = section.querySelector(
        ".tnea-journey-line",
      ) as HTMLElement | null;

      const cards = Array.from(
        section.querySelectorAll<HTMLElement>(".tnea-journey-card"),
      );

      if (!line || !cards.length) return;

      gsap.fromTo(
        line,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tnea-journey"
      className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      <Container>
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-12 max-w-3xl lg:mb-16">
          <div className="mb-5 flex items-center gap-4">
            <span className="font-mono text-[10px] font-bold text-accent-400">
              04
            </span>

            <span className="h-px w-8 bg-primary-800/20" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
              Your TNEA Journey
            </span>
          </div>

          <h2 className="text-[38px] font-bold leading-[0.95] tracking-[-0.04em] text-primary-800 sm:text-[52px] lg:text-[60px]">
            Step-by-Step
            <br />
            Application Process
          </h2>

          <p className="mt-5 max-w-2xl text-[14px] leading-6 text-gray-600 sm:text-[15px] sm:leading-7">
            Follow the complete TNEA process from registration to admission.
          </p>
        </div>

        {/* =====================================================
            DESKTOP JOURNEY
        ===================================================== */}
        <div className="relative hidden lg:block">
          {/* MAIN LINE */}
          <div
            className="
              tnea-journey-line
              absolute
              left-[3%]
              right-[3%]
              top-6
              h-px
              origin-left
              bg-accent-400
            "
          />

          <div className="grid grid-cols-5 gap-8">
            {steps.slice(0, 5).map((step) => (
              <JourneyCard key={step.number} step={step} />
            ))}
          </div>

          <div className="relative mt-14">
            <div className="absolute left-[3%] right-[3%] top-6 h-px bg-primary-800/10" />

            <div className="grid grid-cols-4 gap-8">
              {steps.slice(5).map((step) => (
                <JourneyCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            TABLET / MOBILE
        ===================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="
                tnea-journey-card
                border
                border-primary-800/10
                bg-gray-50
                p-6
              "
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-800/10 bg-white font-mono text-[10px] font-bold text-primary-800">
                  {step.number}
                </span>

                {index < steps.length - 1 && (
                  <span className="text-accent-400">→</span>
                )}
              </div>

              <h3 className="mt-6 text-[16px] font-bold leading-5 text-primary-800">
                {step.title}
              </h3>

              <p className="mt-3 text-[12px] leading-5 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOTTOM META
        ===================================================== */}
        <div className="mt-14 border-t border-primary-800/10 pt-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-primary-800/50">
              01 — 09
            </span>

            <span className="h-px w-10 bg-primary-800/15" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-800/40">
              Application Journey
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
   JOURNEY CARD
============================================================ */

function JourneyCard({
  step,
}: {
  step: {
    number: string;
    title: string;
    description: string;
  };
}) {
  return (
    <article className="tnea-journey-card relative">
      {/* NUMBER */}
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary-800/10 bg-white font-mono text-[10px] font-bold text-primary-800">
        {step.number}
      </div>

      {/* CONTENT */}
      <h3 className="mt-6 max-w-[190px] text-[15px] font-bold leading-5 tracking-[-0.02em] text-primary-800">
        {step.title}
      </h3>

      <p className="mt-4 max-w-[230px] text-[12px] leading-5 text-gray-600">
        {step.description}
      </p>
    </article>
  );
}
