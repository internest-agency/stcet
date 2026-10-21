"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Breadcrumb from "@/src/components/ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger);

export default function EventsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const context = gsap.context(() => {
      const elements = [
        ".events-breadcrumb",
        ".events-eyebrow",
        ".events-heading",
        ".events-description",
      ]
        .map((selector) => content.querySelector<HTMLElement>(selector))
        .filter((element): element is HTMLElement => element !== null);

      gsap.set(elements, { opacity: 0, y: 25 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        })
        .to(elements, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-800 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent-500/10 blur-3xl"
      />
      <Container>
        <div
          ref={contentRef}
          className="relative max-w-3xl py-20 sm:py-24 lg:py-28"
        >
          <div className="events-breadcrumb mb-6">
            <Breadcrumb items={[{ label: "Events" }]} />
          </div>

          <div className="events-eyebrow mb-7">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
              Campus Life
            </span>
          </div>

          <SectionHeading as="h1" className="events-heading text-white">
            Events at <span className="text-accent-400">STCET</span>
          </SectionHeading>

          <p className="events-description mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Workshops, seminars, cultural programmes and campus activities that
            keep our students learning, connecting and growing beyond the
            classroom.
          </p>
        </div>
      </Container>
    </section>
  );
}
