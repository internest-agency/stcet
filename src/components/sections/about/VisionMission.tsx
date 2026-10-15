"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaGraduationCap,
  FaLightbulb,
  FaUsers,
  FaHandshake,
  FaBullseye,
} from "react-icons/fa6";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const missionItems = [
  {
    number: "01",
    title: "Quality Technical Education",
    description:
      "Provide quality technical education through innovative teaching, industry-relevant learning and strong academic foundations.",
    icon: FaGraduationCap,
  },
  {
    number: "02",
    title: "Research & Innovation",
    description:
      "Promote research, innovation, entrepreneurship and lifelong learning among students and faculty.",
    icon: FaLightbulb,
  },
  {
    number: "03",
    title: "Ethics & Leadership",
    description:
      "Foster ethical values, leadership, professional responsibility and a commitment to excellence.",
    icon: FaUsers,
  },
  {
    number: "04",
    title: "Industry Collaboration",
    description:
      "Develop collaborations with industry, academia and society for knowledge exchange, practical learning and sustainable development.",
    icon: FaHandshake,
  },
  {
    number: "05",
    title: "Future-Ready Graduates",
    description:
      "Prepare skilled, adaptable and socially responsible graduates to meet evolving global and local challenges.",
    icon: FaBullseye,
  },
];

const visionStatement =
  "To be a centre of excellence in technical education, fostering knowledge, innovation and ethical values to develop competent professionals who contribute meaningfully to society and address the challenges of a changing world.";

/**
 * Replace this URL with an approved STCET campus image
 * from your project's public folder.
 */
const campusImage = "/images/campus-building.webp";

export default function VisionMission() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.from("[data-vision-element]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-vision-section]",
          start: "top 75%",
          once: true,
        },
      });

      gsap.from("[data-mission-item]", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-mission-list]",
          start: "top 82%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* =====================================================
          VISION — FUTURISTIC DARK SECTION
      ===================================================== */}
      <section
        data-vision-section
        aria-labelledby="vision-heading"
        className="relative isolate overflow-hidden bg-primary-900 text-white"
      >
        {/* Atmospheric background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,color-mix(in_srgb,var(--color-primary-500)_32%,transparent),transparent_50%),linear-gradient(110deg,var(--color-primary-900)_0%,var(--color-primary-800)_65%,var(--color-primary-700)_100%)]"
        />

        {/* Technical grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Decorative orbital rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-48 -z-10 h-[620px] w-[620px] rounded-full border border-white/10 sm:-right-24 sm:-top-64 sm:h-[850px] sm:w-[850px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 -z-10 h-[470px] w-[470px] rounded-full border border-white/[0.08] sm:right-0 sm:-top-40 sm:h-[650px] sm:w-[650px]"
        />

        <Container>
          <div className="grid min-h-[650px] items-center gap-12 py-20 sm:py-24 lg:min-h-[740px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:py-28">
            {/* Left content */}
            <div className="relative z-10">
              <div data-vision-element className="mb-8 flex items-center gap-4">
                <span className="h-[2px] w-9 bg-accent-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
                  Our Vision
                </span>
              </div>
              <SectionHeading as="h3" className="text-white!">
                Shaping a Brighter Tomorrow Through{" "}
                <span className="text-accent-400">Knowledge</span> and{" "}
                <span className="text-accent-400">Innovation.</span>
              </SectionHeading>

              <p
                data-vision-element
                className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9"
              >
                {visionStatement}
              </p>

              <div
                data-vision-element
                className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60 sm:text-xs"
              >
                <span className="h-[2px] w-10 bg-accent-400" />
                <span>People</span>
                <span className="text-accent-400">•</span>
                <span>Progress</span>
                <span className="text-accent-400">•</span>
                <span>A Better Tomorrow</span>
              </div>
            </div>

            {/* Right campus image */}
            <div
              data-vision-element
              className="relative min-h-[350px] sm:min-h-[460px] lg:min-h-[560px]"
            >
              {/* Image frame */}
              <div className="absolute inset-0 overflow-hidden rounded-tl-[150px] sm:rounded-tl-[80px]">
                <img
                  src={campusImage}
                  alt="STCET campus architecture"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-800/90 via-primary-800/10 to-primary-200/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-transparent to-transparent" />
              </div>

              {/* Corner accents */}
              <div
                aria-hidden="true"
                className="absolute -left-3 top-16 h-24 w-[2px] bg-accent-400 sm:-left-5 sm:h-32"
              />

              {/* Image caption */}
              <div className="absolute bottom-7 left-6 right-6 sm:bottom-10 sm:left-10">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                  S. Thangapazham College of Engineering & Technology
                </p>
                <div className="mt-3 h-px w-full bg-white/25" />
                <div className="mt-3 text-sm font-medium text-white">
                  Engineering the Future
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          MISSION — FUTURISTIC LIGHT SECTION
      ===================================================== */}
      <section
        aria-labelledby="mission-heading"
        className="relative overflow-hidden bg-[#F7F8FA] py-14 text-[#10243A] sm:py-18 lg:py-20"
      >
        {/* Subtle technical background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#10243A 1px, transparent 1px), linear-gradient(90deg, #10243A 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <Container>
          {/* Mission heading — Futuristic editorial layout */}
          <div className="relative mb-8 lg:mb-8">
            {/* Main heading and description */}
            <div className="grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
              <div>
                <SectionHeading as="h2">
                  Turning Our Vision
                  <span className="block text-accent-500">Into Action.</span>
                </SectionHeading>
              </div>

              <div className="lg:border-l lg:border-primary-900/15 lg:pl-8 lg:pb-1">
                <p className="max-w-lg text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                  Our commitment to nurturing capable professionals through
                  education, discovery, collaboration and responsibility.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-700 sm:text-xs">
                    Educate · Innovate · Empower
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle transition into the cards */}
            <div className="mt-9 h-px bg-gradient-to-r from-primary-900/20 via-primary-900/10 to-transparent lg:mt-12" />
          </div>

          {/* Mission cards */}
          <div
            data-mission-list
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {missionItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  data-mission-item
                  className={`group relative isolate flex min-h-[280px] flex-col overflow-hidden rounded border border-primary-900/10 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-primary-900/10 sm:p-7 ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  {/* Subtle background decoration */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full border border-primary-900/[0.06] transition-transform duration-700 group-hover:scale-125"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-full border border-primary-900/[0.05] transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Card top */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-900/10 bg-primary-900/[0.03] text-2xl text-primary-700 transition-all duration-300 group-hover:border-accent-500/30 group-hover:bg-accent-500 group-hover:text-white">
                      <Icon aria-hidden="true" />
                    </div>

                    <span className="text-sm font-semibold tracking-[0.15em] text-accent-500">
                      {item.number}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="mt-8 flex-1">
                    <SectionHeading
                      as="h3"
                      customSize={true}
                      className="text-2xl"
                    >
                      {item.title}
                    </SectionHeading>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
