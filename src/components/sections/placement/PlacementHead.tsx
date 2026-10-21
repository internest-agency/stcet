"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import RichText from "../../ui/RichText";
import SectionHeading from "../../ui/SectionHeading";
import {
  placementLeadershipContent as defaultContent,
  type PlacementLeadershipContent,
} from "@/src/lib/content/placement-leadership-content";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function PlacementHead({
  content = defaultContent,
}: {
  content?: PlacementLeadershipContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const eyebrow = content.eyebrow || defaultContent.eyebrow;
  const heading = content.heading || defaultContent.heading;
  const description = content.description || defaultContent.description;
  const officerName = content.officerName || defaultContent.officerName;
  const officerDesignation =
    content.officerDesignation || defaultContent.officerDesignation;
  const officerImagePath =
    content.officerImagePath || defaultContent.officerImagePath;
  const officerImageAlt =
    content.officerImageAlt ||
    `${officerName ?? "Placement officer"}, ${officerDesignation ?? ""}`.trim();
  const items = content.items;

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const heading = section.querySelector(
        ".placement-head-heading",
      ) as HTMLElement | null;

      const image = section.querySelector(
        ".placement-head-image",
      ) as HTMLElement | null;

      const content = section.querySelector(
        ".placement-head-content",
      ) as HTMLElement | null;

      const qualificationItems = Array.from(
        section.querySelectorAll<HTMLElement>(".qualification-item"),
      );

      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      gsap.set(split.lines, {
        yPercent: 100,
      });

      gsap.set(image, {
        opacity: 0,
        y: 25,
      });

      gsap.set(content, {
        opacity: 0,
        y: 25,
      });

      gsap.set(qualificationItems, {
        opacity: 0,
        x: 15,
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        once: true,

        onEnter: () => {
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power4.out",
          });

          gsap.to(image, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.2,
            ease: "power3.out",
          });

          gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.3,
            ease: "power3.out",
          });

          gsap.to(qualificationItems, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.55,
            ease: "power3.out",
          });
        },
      });

      return () => split.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-100">
      <Container className="py-14 sm:py-18 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20 xl:grid-cols-[0.6fr_1.4fr]">
          {/* =========================================
              LEFT — SECTION INTRO
          ========================================= */}

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                {eyebrow}
              </span>
            </div>

            <SectionHeading as="h2" html={heading ?? undefined} />
          </div>

          {/* =========================================
              RIGHT — PROFILE
          ========================================= */}

          <div className="grid items-start gap-8 sm:grid-cols-[220px_1fr] sm:gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
            {/* =====================================
                PHOTO
            ===================================== */}

            <div className="placement-head-image">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                {officerImagePath ? (
                  <Image
                    src={officerImagePath}
                    alt={officerImageAlt}
                    fill
                    sizes="230px"
                    className="object-cover"
                    unoptimized={!officerImagePath.startsWith("/images/")}
                  />
                ) : null}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-lg font-extrabold tracking-tight text-primary-700">
                  {officerName}
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-400">
                  {officerDesignation}
                </p>
              </div>
            </div>

            {/* =====================================
                CONTENT
            ===================================== */}

            <div className="placement-head-content max-w-2xl">
              <RichText html={description} className="text-gray-800" />

              {/* Qualifications */}
              <div className="border-t border-gray-300 pt-7 mt-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Qualifications &amp; Experience
                </span>

                <div className="mt-5">
                  {items.map((item, index) => (
                    <div
                      key={item.id ?? `${index}-${item.title}`}
                      className="qualification-item flex items-center gap-4 border-b border-gray-200 py-4 first:pt-0"
                    >
                      <span className="text-[10px] font-bold text-accent-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-gray-700">
                          {item.title}
                        </span>

                        {item.description ? (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
