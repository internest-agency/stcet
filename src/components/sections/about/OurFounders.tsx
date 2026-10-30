"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import RichText from "../../ui/RichText";
import SectionHeading from "../../ui/SectionHeading";
import {
  aboutFounders as defaultFounders,
  type AboutFounderContent,
} from "@/src/lib/content/about-content";

gsap.registerPlugin(SplitText, ScrollTrigger);

const FALLBACK_IMAGE = "/images/placeholder.jpg";

function FounderRow({
  founder,
  index,
}: {
  founder: AboutFounderContent;
  index: number;
}) {
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const image = founder.imagePath || FALLBACK_IMAGE;
  const roleLabel = founder.roleLabel || "Founder";
  const highlightBorder = reversed ? "border-primary-700" : "border-accent-400";

  const imageColumn = (
    <div
      className={`relative overflow-hidden bg-gray-200 ${
        reversed ? "order-1 lg:order-2" : ""
      }`}
    >
      <Image
        src={image}
        alt={founder.name}
        width={1200}
        height={1600}
        unoptimized={!image.startsWith("/images/")}
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="block h-auto w-full object-contain transition-transform duration-700 ease-out hover:scale-105"
      />

      {/* Image overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary-900/50 via-transparent to-transparent"
        aria-hidden="true"
      />
    </div>
  );

  const contentColumn = (
    <div
      className={`flex flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16 ${
        reversed ? "order-2 lg:order-1" : ""
      }`}
    >
      <div>
        {/* Label */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            {roleLabel}
          </span>

          <span className="text-xs font-bold tracking-[0.18em] text-primary-700">
            {number}
          </span>
        </div>

        {/* Name */}
        <SectionHeading as="h3" className="text-gray-800!">
          {founder.name}
        </SectionHeading>

        {/* Role */}
        {founder.designation ? (
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-400">
            {founder.designation}
          </p>
        ) : null}

        {/* Biography */}
        {founder.biography ? (
          <RichText
            html={founder.biography}
            className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8"
          />
        ) : null}
      </div>

      {/* Highlight */}
      {founder.quote ? (
        <div className={`mt-12 border-l-2 ${highlightBorder} pl-5`}>
          <RichText
            html={founder.quote}
            className="max-w-lg text-sm font-semibold leading-6 text-gray-700"
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <article
      className={`founder-item grid border-b border-gray-200 ${
        reversed
          ? "lg:grid-cols-[1.15fr_0.85fr]"
          : "lg:grid-cols-[0.85fr_1.15fr]"
      }`}
    >
      {reversed ? (
        <>
          {contentColumn}
          {imageColumn}
        </>
      ) : (
        <>
          {imageColumn}
          {contentColumn}
        </>
      )}
    </article>
  );
}

export default function OurFounders({
  founders = defaultFounders,
}: {
  founders?: AboutFounderContent[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(
        ".founders-heading",
      ) as HTMLElement | null;

      const intro = sectionRef.current?.querySelector(
        ".founders-intro",
      ) as HTMLElement | null;

      const founderItems = gsap.utils.toArray<HTMLElement>(".founder-item");

      // Heading animation
      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              split.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power4.out",
              },
            );
          },
        });
      }

      // Introduction animation
      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              intro,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );
          },
        });
      }

      // Founder animations
      founderItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: 40,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                delay: index * 0.1,
                ease: "power3.out",
              },
            );
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, [founders]);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-50">
      <Container className="py-14 sm:py-18 lg:py-20">
        {/* SECTION INTRO */}
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          {/* Heading */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-accent-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Our Founders
              </span>
            </div>

            <SectionHeading as="h2">
              People behind
              <br />
              <span className="text-accent-400">the vision.</span>
            </SectionHeading>
          </div>

          {/* Intro */}
          <div className="lg:pt-8">
            <p className="founders-intro max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The institution carries forward a vision shaped by leadership,
              commitment to education and a desire to create meaningful
              opportunities for students and society.
            </p>
          </div>
        </div>

        {/* FOUNDERS */}
        <div className="mt-12 border-t border-gray-200">
          {founders.map((founder, index) => (
            <FounderRow
              key={founder.id ?? `${founder.name}-${index}`}
              founder={founder}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
