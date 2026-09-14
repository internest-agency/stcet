"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const steps = [
  {
    number: "01",
    title: "Online Registration",
    content: (
      <>
        <p>
          Visit the official TNEA portal and create an account using your email
          ID and mobile number.
        </p>

        <ul>
          <li>Generate a password.</li>
          <li>Log in to the TNEA portal.</li>
        </ul>

        <a
          href="https://www.tneaonline.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-bold text-primary-700 underline decoration-accent-400 underline-offset-4 transition-colors hover:text-accent-500"
        >
          Visit TNEA Website
        </a>
      </>
    ),
  },
  {
    number: "02",
    title: "Fill the Application Form",
    content: (
      <>
        <p>Enter the required details:</p>

        <ul>
          <li>Personal details</li>
          <li>Parent/guardian details</li>
          <li>Address</li>
          <li>Community/category</li>
          <li>Class 12 academic details</li>
          <li>School information</li>
          <li>Nativity details (if applicable)</li>
        </ul>
      </>
    ),
  },
  {
    number: "03",
    title: "Upload Documents",
    content: (
      <>
        <p>Typically required:</p>

        <ul>
          <li>Class 10 mark sheet</li>
          <li>Class 12 mark sheet (or equivalent)</li>
          <li>Transfer Certificate (when available)</li>
          <li>Community Certificate (if applicable)</li>
          <li>Nativity Certificate (if applicable)</li>
          <li>First Graduate Certificate (if applicable)</li>
          <li>
            Special reservation certificates (Sports, Ex-servicemen, Differently
            Abled, etc.)
          </li>
          <li>Passport-size photograph and signature</li>
          <li>Aadhaar card (recommended)</li>
        </ul>
      </>
    ),
  },
  {
    number: "04",
    title: "Pay the Application Fee",
    content: (
      <p>
        Payment is made online using debit card, credit card, UPI, or net
        banking. Fee varies based on category.
      </p>
    ),
  },
  {
    number: "05",
    title: "Certificate Verification",
    content: (
      <>
        <ul>
          <li>
            Documents are verified online (or through TNEA Facilitation Centres
            when required).
          </li>
          <li>
            Any discrepancies must be corrected within the specified time.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "06",
    title: "Random Number Generation",
    content: (
      <p>
        A random number is assigned to each applicant. It is used as one of the
        tie-breaking criteria if two candidates have identical merit.
      </p>
    ),
  },
  {
    number: "07",
    title: "Rank List Publication",
    content: (
      <>
        <p>
          TNEA prepares the merit list based on the normalized Class 12 marks
          in:
        </p>

        <ul>
          <li>Mathematics</li>
          <li>Physics</li>
          <li>Chemistry</li>
        </ul>

        <p className="mt-4 font-bold text-primary-700">
          The maximum engineering cutoff is 200 marks.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Counselling",
    content: (
      <>
        <p>Eligible candidates participate in online counselling:</p>

        <ul>
          <li>Pay the counselling fee.</li>
          <li>Fill and lock college/course choices.</li>
          <li>
            Seat allotment is based on rank, category, and seat availability.
          </li>
          <li>
            Download the provisional allotment order if a seat is allotted.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "09",
    title: "Report to the College",
    content: (
      <>
        <ul>
          <li>Download the allotment order.</li>
          <li>Report to the allotted college within the specified deadline.</li>
          <li>Submit original documents and complete admission formalities.</li>
        </ul>
      </>
    ),
  },
];

export default function TNEAProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const heading = section.querySelector(
        ".tnea-process-heading",
      ) as HTMLElement | null;

      const stepElements = Array.from(section.querySelectorAll(".tnea-step"));

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            split.lines,
            {
              yPercent: 100,
            },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          if (stepElements.length > 0) {
            gsap.fromTo(
              stepElements,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.06,
                delay: 0.2,
                ease: "power3.out",
              },
            );
          }
        },
      });

      return () => {
        trigger.kill();
        split.revert();
      };
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          {/* Left Content */}
          <div>
            <div className="mb-6 flex items-center gap-3 lg:sticky lg:top-32">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                TNEA Government Quota
              </span>
            </div>

            <h2 className="tnea-process-heading max-w-md text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary-700 sm:text-4xl lg:sticky lg:top-48 lg:text-5xl">
              Application
              <br />
              Process
              <br />
              Step By Step.
            </h2>
          </div>

          {/* Steps */}
          <div className="border-t border-gray-200">
            {steps.map((step) => (
              <div
                key={step.number}
                className="tnea-step grid gap-5 border-b border-gray-200 py-8 sm:grid-cols-[70px_1fr] sm:gap-8 sm:py-10"
              >
                <span className="text-sm font-black tracking-[0.12em] text-accent-400">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-primary-700 sm:text-2xl">
                    {step.title}
                  </h3>

                  <div className="tnea-step-content mt-4 text-base leading-7 text-gray-600">
                    {step.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style jsx>{`
        .tnea-step-content :global(ul) {
          margin-top: 0.75rem;
          padding-left: 1.25rem;
          list-style: disc;
        }

        .tnea-step-content :global(li + li) {
          margin-top: 0.35rem;
        }
      `}</style>
    </section>
  );
}
