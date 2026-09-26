"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import Container from "@/src/components/ui/Container";
import Button from "../../ui/Button";
import { FaCircleArrowRight } from "react-icons/fa6";
import SectionHeading from "../../ui/SectionHeading";
import Breadcrumb from "../../ui/Breadcrumb";

export default function AdmissionsHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".admissions-hero-content > *",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
        },
      );

      gsap.fromTo(
        ".admissions-hero-image",
        {
          clipPath: "inset(0 100% 0 0)",
          scale: 1.05,
        },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden relative bg-gray-50">
      <Container className="relative z-2">
        <div className="grid min-h-[680px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="admissions-hero-content flex flex-col justify-center py-24 pr-0 lg:pr-12 xl:pr-16">
            <Breadcrumb
              items={[
                {
                  label: "Admission",
                },
              ]}
              className="my-6"
            />
            <SectionHeading as="h1">
              Begin Your Engineering Journey
            </SectionHeading>

            <p className="mt-7 max-w-lg text-gray-800">
              Admissions are open for the 2026–27 academic year through TNEA
              Counselling and Management Quota, subject to applicable
              eligibility and admission norms.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={"#tnea-journey"}
                variant="accent"
                size="md"
                rightIcon={<FaCircleArrowRight />}
              >
                Explore Admission Process
              </Button>
              <Button
                href={"#management-quota"}
                variant="primary"
                size="md"
                rightIcon={<FaCircleArrowRight />}
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <div className="admissions-hero-image absolute inset-0 z-0">
        <Image
          src="/images/admissions/admissions-hero.webp"
          alt="Students at STCET campus"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute z-1 inset-0 bg-linear-to-r from-white via-white/80 to-transparent"></div>
    </section>
  );
}
