"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

const documents = [
  "Class 10 Mark Sheet",
  "Class 12 Mark Sheet or equivalent",
  "Transfer Certificate",
  "Community Certificate",
  "Nativity Certificate",
  "First Graduate Certificate",
  "Aadhaar Card (recommended)",
  "Passport-size Photograph and Signature",
  "Special Reservation Certificates",
];

export default function DocumentsChecklist() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const content = section.querySelector(
        ".documents-content",
      ) as HTMLElement | null;

      const image = section.querySelector(
        ".documents-image",
      ) as HTMLElement | null;

      const items = Array.from(
        section.querySelectorAll<HTMLElement>(".document-item"),
      );

      if (!content || !image || !items.length) return;

      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        image,
        {
          opacity: 0,
          scale: 1.05,
          clipPath: "inset(0 0 0 12%)",
        },
        {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0 0 0 0%)",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
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
      className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="documents-content">
            {/* SECTION LABEL */}

            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[10px] font-bold text-accent-400">
                07
              </span>

              <span className="h-px w-8 bg-primary-800/20" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                Documents Checklist
              </span>
            </div>

            {/* HEADING */}

            <h2 className="max-w-xl text-[38px] font-bold leading-[0.95] tracking-[-0.04em] text-primary-800 sm:text-[52px]">
              Get Your Documents Ready
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-5 max-w-lg text-[14px] leading-6 text-gray-600 sm:text-[15px] sm:leading-7">
              Keep the following documents ready before beginning the
              application.
            </p>

            {/* DOCUMENT LIST */}

            <div className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {documents.map((document, index) => (
                <div
                  key={document}
                  className="document-item flex items-start gap-3"
                >
                  {/* NUMBER / ICON */}

                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-primary-800/10
                      bg-gray-50
                      font-mono
                      text-[8px]
                      font-bold
                      text-primary-800
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* DOCUMENT NAME */}

                  <span className="pt-1 text-[12px] leading-5 text-gray-700">
                    {document}
                  </span>
                </div>
              ))}
            </div>

            {/* NOTE */}

            <div className="mt-8 border-l-2 border-accent-400 pl-4">
              <p className="text-[11px] leading-5 text-gray-500">
                Keep original documents and applicable certificates ready for
                verification as required during the admission process.
              </p>
            </div>
          </div>

          {/* =====================================================
              RIGHT IMAGE
          ===================================================== */}

          <div className="documents-image relative min-h-[420px] overflow-hidden bg-gray-100 sm:min-h-[480px]">
            <Image
              src="/images/admissions/documents.webp"
              alt="Documents required for TNEA admission"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />

            {/* IMAGE OVERLAY */}

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary-800/45 via-transparent to-transparent" />

            {/* IMAGE LABEL */}

            <div className="absolute bottom-5 left-5 bg-white px-5 py-4 shadow-lg sm:bottom-7 sm:left-7">
              <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-accent-400">
                TNEA
              </p>

              <p className="mt-1 text-[12px] font-bold text-primary-800">
                Required Documents
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM META
        ===================================================== */}

        <div className="mt-14 border-t border-primary-800/10 pt-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-primary-800/50">
              07
            </span>

            <span className="h-px w-10 bg-primary-800/15" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-800/40">
              Documents Checklist
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
