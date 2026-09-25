"use client";

import Image from "next/image";
import Link from "next/link";

import Container from "@/src/components/ui/Container";

export default function AdmissionsCTA() {
  return (
    <section className="relative overflow-hidden bg-primary-800">
      <div className="relative min-h-[520px]">
        <Image
          src="/images/admissions/admissions-cta.webp"
          alt="Students at STCET campus"
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-primary-800/75" />

        <Container className="relative z-10 flex min-h-[520px] items-center">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[10px] font-bold text-accent-400">
                11
              </span>

              <span className="h-px w-8 bg-white/25" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                Start Your Journey
              </span>
            </div>

            <h2 className="text-[44px] font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-[58px] lg:text-[68px]">
              Start Your Journey
              <br />
              at STCET
            </h2>

            <p className="mt-6 max-w-xl text-[14px] leading-7 text-white/70 sm:text-[15px]">
              Take the next step towards an engineering education built around
              knowledge, innovation and opportunity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://www.tneaonline.org/"
                target="_blank"
                className="rounded-md bg-accent-400 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
              >
                Apply Through TNEA →
              </Link>

              <Link
                href="#contact"
                className="rounded-md border border-white/30 bg-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
              >
                Enquire About Admission
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
