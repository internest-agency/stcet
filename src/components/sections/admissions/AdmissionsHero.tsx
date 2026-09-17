"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Container from "../../ui/Container";
import Breadcrumb from "../../ui/Breadcrumb";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AdmissionsHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".admission-hero-heading",
      ) as HTMLElement | null;

      const eyebrow = sectionRef.current?.querySelector(
        ".admission-hero-eyebrow",
      ) as HTMLElement | null;

      const description = sectionRef.current?.querySelector(
        ".admission-hero-description",
      ) as HTMLElement | null;

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            eyebrow,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            split.lines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power4.out",
            },
          );

          gsap.fromTo(
            description,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.3,
              ease: "power3.out",
            },
          );
        },
      });

      return () => split.revert();
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-50">
      <Container className="pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        <Breadcrumb
          items={[{ label: "Admissions" }]}
          className="mb-14 sm:mb-16 lg:mb-20"
        />

        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <div className="admission-hero-eyebrow flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Admissions 2026–27
              </span>
            </div>
          </div>

          <div>
            <h1 className="admission-hero-heading max-w-5xl text-4xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-primary-700 sm:text-6xl lg:text-7xl">
              Begin Your
              <br />
              Engineering
              <br />
              Journey.
            </h1>

            <p className="admission-hero-description mt-8 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Begin your engineering journey at S. Thangapazham College of
              Engineering & Technology, where quality technical education,
              innovation, industry-oriented learning, and ethical values come
              together to shape future-ready engineers.
            </p>

            <p className="admission-hero-description mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Admissions are open for the 2026–27 academic year through TNEA
              Counselling and Management Quota, subject to applicable
              eligibility and admission norms.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://www.tneaonline.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary-700 px-6 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-primary-800"
              >
                TNEA Website
              </Link>

              <Link
                href="#management-quota"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-primary-700 transition-colors duration-300 hover:border-primary-700"
              >
                Management Quota
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
