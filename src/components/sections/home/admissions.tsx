"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import Button from "../../ui/Button";
import { FaCircleArrowRight } from "react-icons/fa6";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function AdmissionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // --------------------------------
      // Respect reduced motion preference
      // --------------------------------
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      // --------------------------------
      // SplitText Heading Animation
      // --------------------------------
      const headings = gsap.utils.toArray<HTMLElement>(".split-heading");

      headings.forEach((heading) => {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,

          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              opacity: 0,
              duration: 1,
              stagger: 0.12,
              ease: "power4.out",

              scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                once: true,
              },
            });
          },
        });
      });

      // --------------------------------
      // Paragraph / Fade Up Animation
      // --------------------------------
      const fadeUps = gsap.utils.toArray<HTMLElement>(".fade-up");

      fadeUps.forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",

          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            once: true,
          },
        });
      });

      // --------------------------------
      // Application List Animation
      // --------------------------------
      const applicationList =
        sectionRef.current?.querySelector(".application-list");

      if (applicationList) {
        const items = applicationList.querySelectorAll("li");

        gsap.from(items, {
          opacity: 0,
          y: 25,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",

          scrollTrigger: {
            trigger: applicationList,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20"
      aria-labelledby="admissions-heading"
    >
      {/* --------------------------------
          Section Heading
      -------------------------------- */}
      <Container className="mb-12">
        <div>
          <h2
            id="admissions-heading"
            className="split-heading mb-4 text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-gray-900"
          >
            Your Gateway to What&apos;s Next
          </h2>
        </div>
      </Container>

      {/* --------------------------------
          Admission Information
      -------------------------------- */}
      <Container>
        <div className="grid grid-cols-1 gap-8 border-b border-b-gray-300 md:grid-cols-2">
          {/* First Card */}
          <div className="border-t border-t-gray-300 py-16 pr-0 md:pr-20">
            <h3 className="split-heading mb-4 text-2xl font-bold uppercase">
              Begin Your Engineering Journey
            </h3>

            <p className="fade-up text-gray-700">
              At S. Thangapazham College of Engineering & Technology, discover
              an environment that encourages curiosity, builds confidence and
              opens pathways to a wide range of engineering careers.
            </p>
          </div>

          {/* Second Card */}
          <div className="border-t border-t-gray-300 py-16 pr-0 md:pr-20">
            <h3 className="split-heading mb-4 text-2xl font-bold uppercase">
              Admissions for 2026-27
            </h3>

            <p className="fade-up text-gray-700">
              Admissions are open now for 2026-27 through TNEA Counselling and
              Management Quota, subject to applicable eligibility and admission
              norms.
            </p>
          </div>
        </div>
      </Container>

      {/* --------------------------------
          Eligibility Section
      -------------------------------- */}
      <Container className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Heading */}
          <div>
            <h3 className="split-heading lg:mt-4 lg:mb-12 text-4xl font-bold uppercase">
              Who can Apply?
            </h3>
            <Button
              href="/admissions"
              variant="primary"
              size="md"
              rightIcon={<FaCircleArrowRight />}
            >
              Enquire Now
            </Button>
          </div>

          {/* Application List */}
          <div>
            <ul className="application-list">
              <li className="flex items-center border-b border-b-gray-300 py-4">
                <span className="mr-4 block text-2xl font-extrabold text-primary-700">
                  01
                </span>
                Pass in Higher Secondary (10+2) or equivalent examination.
              </li>

              <li className="flex items-center border-b border-b-gray-300 py-4">
                <span className="mr-4 block text-2xl font-extrabold text-primary-700">
                  02
                </span>
                Physics, Chemistry and Mathematics as compulsory subjects.
              </li>

              <li className="flex items-center border-b border-b-gray-300 py-4">
                <span className="mr-4 block text-2xl font-extrabold text-primary-700">
                  03
                </span>
                Eligibility as prescribed by Anna University and the Government
                of Tamil Nadu.
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
