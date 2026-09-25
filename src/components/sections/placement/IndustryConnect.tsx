"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
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

const recruiters = [
  {
    url: "/images/placements/recruiters/accenture-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/ashok-leyland-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/birla-soft-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/cognizant-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/hyundai-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/infosys-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/rane-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/royal-enfield-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/tcs-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/tessolve-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/texmo-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/wipro-logo.webp",
    alt: "alt-text",
  },
  {
    url: "/images/placements/recruiters/zoho-logo.webp",
    alt: "alt-text",
  },
];

export default function IndustryConnect() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const track = trackRef.current;

      if (!track) return;

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
  }, []);

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

      <div ref={trackRef} className="flex w-max items-center">
        {[...recruiters, ...recruiters].map((recruiter, index) => (
          <div
            key={`recruiter-${index}`}
            className="flex items-center border border-gray-300 mx-2"
          >
            <Image
              src={recruiter.url}
              className="w-45 h-18"
              width={400}
              height={160}
              alt={recruiter.alt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
