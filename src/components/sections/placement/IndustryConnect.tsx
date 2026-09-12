"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../ui/Container";

gsap.registerPlugin(ScrollTrigger);

const logoPlaceholders = [
  "Company Logo",
  "Company Logo",
  "Company Logo",
  "Company Logo",
  "Company Logo",
  "Company Logo",
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
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container className="pt-20 sm:pt-24 lg:pt-28">
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

      <div className="border-y border-gray-200 py-7 sm:py-9">
        <div ref={trackRef} className="flex w-max items-center">
          {[...logoPlaceholders, ...logoPlaceholders].map((logo, index) => (
            <div key={`${logo}-${index}`} className="flex items-center">
              <div className="mx-5 flex h-16 w-40 items-center justify-center border border-gray-200 bg-white px-5 sm:mx-7 sm:h-20 sm:w-48">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  {logo}
                </span>
              </div>

              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-accent-400"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
