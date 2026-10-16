"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

  // The website layout (and this smoother) persists across client-side
  // navigation, so it never remounts and the smoother's content height plus
  // every ScrollTrigger position become stale once a new page mounts. Refresh
  // once per route, on the next frame, so the incoming page's triggers measure
  // against the correct layout instead of the previous page's.
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
