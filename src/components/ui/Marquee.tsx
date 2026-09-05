"use client";

import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import gsap from "gsap";

export type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Creates a continuously scrolling marquee animation for the supplied element. */
export function useMarquee<T extends HTMLElement>({
  speed = 50,
  direction = "left",
  pauseOnHover = true,
}: Omit<MarqueeProps, "children" | "className" | "style"> = {}) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const context = gsap.context(() => {
      const distance = element.scrollWidth / 2;
      const duration = Math.max(distance / Math.max(speed, 1), 0.1);

      gsap.set(element, { x: direction === "left" ? 0 : -distance });
      const animation = gsap.to(element, {
        x: direction === "left" ? -distance : 0,
        duration,
        ease: "none",
        repeat: -1,
      });

      if (pauseOnHover) {
        element.addEventListener("mouseenter", () => animation.pause());
        element.addEventListener("mouseleave", () => animation.resume());
      }
    }, element);

    return () => context.revert();
  }, [direction, pauseOnHover, speed]);

  return ref;
}

export function Marquee({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className,
  style,
}: MarqueeProps) {
  const ref = useMarquee<HTMLDivElement>({ speed, direction, pauseOnHover });

  return (
    <div className={className} style={{ overflow: "hidden", ...style }}>
      <div ref={ref} style={{ display: "flex", width: "max-content" }}>
        <div style={{ display: "flex", flexShrink: 0 }}>{children}</div>
        <div aria-hidden="true" style={{ display: "flex", flexShrink: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
