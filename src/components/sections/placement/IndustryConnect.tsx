"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { PlacementCompany } from "@/src/generated/prisma/client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../ui/Container";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const logoPlaceholders = [
  "Company Logo",
  "Company Logo",
  "Company Logo",
  "Company Logo",
  "Company Logo",
  "Company Logo",
];

// const companies = [
//   {
//     url: "/images/placements/companies/accenture-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/ashok-leyland-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/birla-soft-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/cognizant-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/hyundai-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/infosys-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/rane-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/royal-enfield-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/tcs-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/tessolve-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/texmo-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/wipro-logo.webp",
//     alt: "alt-text",
//   },
//   {
//     url: "/images/placements/companies/zoho-logo.webp",
//     alt: "alt-text",
//   },
// ];

export default function IndustryConnect({
  companies,
}: {
  companies: PlacementCompany[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const visibleCompanies = companies.filter((company) => company.logoPath?.trim());

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const track = trackRef.current;

      if (!track || visibleCompanies.length === 0) return;

      const animation = gsap.to(track, {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => animation.play(),
        onLeave: () => animation.pause(),
        onEnterBack: () => animation.play(),
        onLeaveBack: () => animation.pause(),
      });

      return () => animation.kill();
    }, sectionRef);

    return () => context.revert();
  }, [visibleCompanies.length]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-gray-50 py-10 sm:py-14 lg:py-18"
    >
      <Container className="">
        <div className="mb-8 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-accent-400"
          />

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Our Industry Connect
          </span>
        </div>
      </Container>

      {visibleCompanies.length > 0 ? (
        <div ref={trackRef} className="flex w-max items-center">
          {[...visibleCompanies, ...visibleCompanies].map((recruiter, index) => (
            <div
              key={`${recruiter.id}-${index}`}
              className="mx-2 flex items-center border border-gray-300 bg-white"
            >
              <Image
                src={recruiter.logoPath!.trim()}
                className="h-18 w-45 object-contain p-2"
                width={400}
                height={160}
                alt={recruiter.name}
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
