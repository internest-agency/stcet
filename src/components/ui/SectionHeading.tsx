"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SectionHeadingProps {
  children: ReactNode;
  id?: string;
  className?: string;
  animate?: boolean;
  customSize?: boolean;
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeading({
  children,
  id = "",
  className = "",
  animate = true,
  customSize = false,
  as = "h2",
}: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;

    if (!heading || !animate) return;

    // Respect reduced-motion: never hide the text, just leave it visible.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(heading, { clearProps: "all" });
      return;
    }

    const context = gsap.context(() => {
      // The reveal is defined inside `onSplit` and returned so SplitText owns
      // it. Whenever the text is re-split (autoSplit on resize, font load or a
      // re-render), SplitText reverts the previous tween before building the
      // new one. This prevents a stale timeline from ever leaving words hidden,
      // and the hidden state is only applied once the split actually succeeds.
      const split = SplitText.create(heading, {
        type: "words",
        mask: "words",
        autoSplit: true,

        onSplit(self) {
          return gsap.from(self.words, {
            opacity: 0,
            yPercent: 110,
            rotateX: -70,
            transformOrigin: "50% 100%",
            duration: 0.8,
            stagger: 0.025,
            ease: "power4.out",

            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              once: true,
            },
          });
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
    h1: "text-4xl leading-[0.94] sm:text-5xl lg:text-5xl xl:text-6xl",
    h2: "text-3xl leading-[0.98] sm:text-4xl lg:text-4xl xl:text-5xl",
    h3: "text-2xl leading-[1.05] sm:text-3xl lg:text-3xl xl:text-4xl",
  } as const;

  const headingClasses = `
    font-extrabold
    uppercase
    leading-snug
    text-primary-700
    [perspective:800px]
    ${!customSize ? headingSizes[as] : ""}
    ${className}
  `;

  const content = <>{children}</>;

  if (as === "h1") {
    return (
      <h1 ref={headingRef} id={id} className={headingClasses}>
        {content}
      </h1>
    );
  }

  if (as === "h3") {
    return (
      <h3 ref={headingRef} id={id} className={headingClasses}>
        {content}
      </h3>
    );
  }

  return (
    <h2 ref={headingRef} id={id} className={headingClasses}>
      {content}
    </h2>
  );
}
