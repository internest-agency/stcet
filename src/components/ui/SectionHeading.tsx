"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeading({
  children,
  className = "",
  animate = true,
  as = "h2",
}: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;

    if (!heading || !animate) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const split = SplitText.create(heading, {
        type: "words",
        mask: "words",
        autoSplit: true,
      });

      if (reducedMotion) {
        gsap.set(split.words, {
          clearProps: "all",
        });

        return;
      }

      gsap.set(split.words, {
        opacity: 0,
        yPercent: 110,
        rotateX: -70,
        transformOrigin: "50% 100%",
      });

      gsap.to(split.words, {
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.025,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
      });

      return () => {
        split.revert();
      };
    }, headingRef);

    return () => {
      context.revert();
    };
  }, [children, animate]);

  const headingSizes = {
    h1: "text-[36px] leading-[0.94] sm:text-[48px] lg:text-[48px] xl:text-[64px]",
    h2: "text-[32px] leading-[0.98] sm:text-[40px] lg:text-[40px] xl:text-[48px]",
    h3: "text-[22px] leading-[1.05] sm:text-[24px] lg:text-[24px] xl:text-[28px]",
  } as const;

  const headingClasses = `
    font-extrabold
    uppercase
    leading-snug
    text-primary-700
    [perspective:800px]
    ${headingSizes[as]}
    ${className}
  `;

  const content = <>{children}</>;

  if (as === "h1") {
    return (
      <h1 ref={headingRef} className={headingClasses}>
        {content}
      </h1>
    );
  }

  if (as === "h3") {
    return (
      <h3 ref={headingRef} className={headingClasses}>
        {content}
      </h3>
    );
  }

  return (
    <h2 ref={headingRef} className={headingClasses}>
      {content}
    </h2>
  );
}
