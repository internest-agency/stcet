"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",

      // Main smoothness
      smooth: 1.2,

      // Slightly reduced smoothing on touch devices
      smoothTouch: 0.15,

      // Keep mobile scrolling feeling natural
      normalizeScroll: false,

      // Enable data-speed / data-lag effects
      effects: true,

      // Smoother easing
      ease: "expo",
    });

    ScrollTrigger.refresh();

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
