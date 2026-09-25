"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   TYPES
========================================================= */

interface CSEConceptualVisualProps {
  className?: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CSEConceptualVisual({
  className = "",
}: CSEConceptualVisualProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const visualRef = useRef<HTMLDivElement>(null);

  const codeRef = useRef<HTMLDivElement>(null);

  const logicNodeRef = useRef<HTMLDivElement>(null);
  const dataNodeRef = useRef<HTMLDivElement>(null);
  const systemsNodeRef = useRef<HTMLDivElement>(null);
  const applicationNodeRef = useRef<HTMLDivElement>(null);

  const nodeRefs = useRef<HTMLDivElement[]>([]);

  const connectionRefs = useRef<SVGPathElement[]>([]);

  const pulseRefs = useRef<SVGCircleElement[]>([]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const addNodeRef = (element: HTMLDivElement | null) => {
    if (!element) return;

    if (!nodeRefs.current.includes(element)) {
      nodeRefs.current.push(element);
    }
  };

  const addConnectionRef = (element: SVGPathElement | null) => {
    if (!element) return;

    if (!connectionRefs.current.includes(element)) {
      connectionRefs.current.push(element);
    }
  };

  const addPulseRef = (element: SVGCircleElement | null) => {
    if (!element) return;

    if (!pulseRefs.current.includes(element)) {
      pulseRefs.current.push(element);
    }
  };

  /* =========================================================
     GSAP ANIMATION
  ========================================================= */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const visual = visualRef.current;
      const code = codeRef.current;

      const logicNode = logicNodeRef.current;
      const dataNode = dataNodeRef.current;
      const systemsNode = systemsNodeRef.current;
      const applicationNode = applicationNodeRef.current;

      const nodes = nodeRefs.current;
      const connections = connectionRefs.current;
      const pulses = pulseRefs.current;

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            visual,
            code,
            logicNode,
            dataNode,
            systemsNode,
            applicationNode,
            ...nodes,
            ...connections,
            ...pulses,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      /* =====================================================
         INITIAL STATES
      ===================================================== */

      gsap.set(visual, {
        opacity: 0,
        y: 40,
      });

      gsap.set(code, {
        opacity: 0,
        y: 20,
      });

      gsap.set(nodes, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "center center",
      });

      gsap.set(connections, {
        opacity: 0,
        strokeDasharray: 500,
        strokeDashoffset: 500,
      });

      gsap.set(pulses, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      /* =====================================================
         MAIN TIMELINE
      ===================================================== */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      /* =====================================================
         SECTION REVEAL
      ===================================================== */

      timeline.to(visual, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      /* =====================================================
         CODE PANEL
      ===================================================== */

      timeline.to(
        code,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.55",
      );

      /* =====================================================
         LOGIC NODE
      ===================================================== */

      timeline.to(
        logicNode,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.35",
      );

      /* =====================================================
         FIRST CONNECTION
      ===================================================== */

      if (connections[0]) {
        timeline.to(
          connections[0],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "-=0.15",
        );
      }

      /* =====================================================
         DATA NODE
      ===================================================== */

      timeline.to(
        dataNode,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.25",
      );

      /* =====================================================
         SECOND CONNECTION
      ===================================================== */

      if (connections[1]) {
        timeline.to(
          connections[1],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "-=0.15",
        );
      }

      /* =====================================================
         SYSTEMS NODE
      ===================================================== */

      timeline.to(
        systemsNode,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.25",
      );

      /* =====================================================
         THIRD CONNECTION
      ===================================================== */

      if (connections[2]) {
        timeline.to(
          connections[2],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "-=0.15",
        );
      }

      /* =====================================================
         APPLICATION NODE
      ===================================================== */

      timeline.to(
        applicationNode,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.25",
      );

      /* =====================================================
         REMAINING CONNECTIONS
      ===================================================== */

      timeline.to(
        connections.slice(3),
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.inOut",
        },
        "-=0.2",
      );

      /* =====================================================
         PULSES
      ===================================================== */

      timeline.to(
        pulses,
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.2",
      );

      /* =====================================================
         CONTINUOUS PULSE MOTION
      ===================================================== */

      pulses.forEach((pulse, index) => {
        gsap.to(pulse, {
          scale: 1.5,
          opacity: 0.25,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          delay: index * 0.18,
          ease: "sine.inOut",
        });
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className={`
        relative
        overflow-hidden
        bg-primary-800
        text-white
        ${className}
      `}
    >
      <Container>
        <div
          className="
            py-20
            sm:py-24
            lg:py-28
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              grid
              gap-8
              lg:grid-cols-[0.8fr_1.2fr]
              lg:items-end
              lg:gap-16
            "
          >
            {/* LEFT */}

            <div>
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-2.5
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-accent-400
                    sm:h-2
                    sm:w-2
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white/60
                  "
                >
                  Computer Science
                </span>
              </div>

              <SectionHeading
                as="h2"
                className="
                  text-white!
                "
              >
                From Logic to the Digital World
              </SectionHeading>
            </div>

            {/* RIGHT */}

            <div>
              <p
                className="
                  max-w-xl
                  text-[14px]
                  leading-6
                  text-white/60
                  sm:text-[15px]
                  sm:leading-7
                  lg:text-[17px]
                  lg:leading-8
                "
              >
                Computer science transforms logical thinking into software,
                systems and digital experiences that shape the modern world.
              </p>
            </div>
          </div>

          {/* =================================================
              CONCEPTUAL VISUAL
          ================================================= */}

          <div
            ref={visualRef}
            className="
              relative
              mt-14
              min-h-[520px]
              overflow-hidden
              border
              border-white/10
              bg-primary-900/40
              sm:mt-18
              lg:mt-20
              lg:min-h-[600px]
            "
          >
            {/* =================================================
                BACKGROUND GRID
            ================================================= */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.07]
                [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]
                [background-size:48px_48px]
              "
            />

            {/* =================================================
                CODE PANEL
            ================================================= */}

            <div
              ref={codeRef}
              className="
                absolute
                left-5
                top-5
                z-10
                hidden
                w-[210px]
                border
                border-white/10
                bg-black/20
                p-4
                font-mono
                text-[9px]
                leading-5
                text-white/40
                backdrop-blur-sm
                sm:left-7
                sm:top-7
                sm:block
                lg:left-10
                lg:top-10
                lg:w-[240px]
              "
            >
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </div>

              <div>
                <span className="text-accent-400">const</span> future ={" "}
                <span className="text-white/70">build</span>
                ();
              </div>

              <div>
                future.
                <span className="text-accent-400">connect</span>
                ();
              </div>

              <div>
                future.
                <span className="text-accent-400">scale</span>
                ();
              </div>

              <div>
                future.
                <span className="text-accent-400">evolve</span>
                ();
              </div>
            </div>

            {/* =================================================
                CENTRAL VISUAL
            ================================================= */}

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              {/* =================================================
                  SVG CONNECTIONS
              ================================================= */}

              <svg
                viewBox="0 0 1000 600"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                "
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* LOGIC → DATA */}

                <path
                  ref={addConnectionRef}
                  d="
                    M 500 135
                    C 500 170
                      500 180
                      500 215
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* DATA → SYSTEMS */}

                <path
                  ref={addConnectionRef}
                  d="
                    M 500 275
                    C 500 310
                      500 320
                      500 355
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* SYSTEMS → APPLICATION */}

                <path
                  ref={addConnectionRef}
                  d="
                    M 500 415
                    C 500 450
                      500 460
                      500 495
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* DATA → LEFT */}

                <path
                  ref={addConnectionRef}
                  d="
                    M 470 245
                    C 380 245
                      350 300
                      290 300
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                />

                {/* DATA → RIGHT */}

                <path
                  ref={addConnectionRef}
                  d="
                    M 530 245
                    C 620 245
                      650 300
                      710 300
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                />

                {/* PULSE 1 */}

                <circle
                  ref={addPulseRef}
                  cx="500"
                  cy="170"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                {/* PULSE 2 */}

                <circle
                  ref={addPulseRef}
                  cx="500"
                  cy="310"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                {/* PULSE 3 */}

                <circle
                  ref={addPulseRef}
                  cx="500"
                  cy="450"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />
              </svg>

              {/* =================================================
                  LOGIC NODE
              ================================================= */}

              <div
                ref={logicNodeRef}
                className="
                  absolute
                  left-1/2
                  top-[14%]
                  z-10
                  -translate-x-1/2
                "
              >
                <div
                  className="
                    flex
                    h-[70px]
                    w-[150px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-accent-400/50
                    bg-primary-800
                    shadow-[0_0_40px_rgba(255,255,255,0.04)]
                    sm:h-[76px]
                    sm:w-[170px]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[9px]
                      tracking-[0.2em]
                      text-accent-400
                    "
                  >
                    01
                  </span>

                  <span
                    className="
                      mt-1
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-white
                    "
                  >
                    Logic
                  </span>
                </div>
              </div>

              {/* =================================================
                  DATA NODE
              ================================================= */}

              <div
                ref={dataNodeRef}
                className="
                  absolute
                  left-1/2
                  top-[36%]
                  z-10
                  -translate-x-1/2
                "
              >
                <div
                  className="
                    flex
                    h-[70px]
                    w-[150px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-white/15
                    bg-primary-800
                    sm:h-[76px]
                    sm:w-[170px]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[9px]
                      tracking-[0.2em]
                      text-accent-400
                    "
                  >
                    02
                  </span>

                  <span
                    className="
                      mt-1
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-white
                    "
                  >
                    Data
                  </span>
                </div>
              </div>

              {/* =================================================
                  SYSTEMS NODE
              ================================================= */}

              <div
                ref={systemsNodeRef}
                className="
                  absolute
                  left-1/2
                  top-[59%]
                  z-10
                  -translate-x-1/2
                "
              >
                <div
                  className="
                    flex
                    h-[70px]
                    w-[150px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-white/15
                    bg-primary-800
                    sm:h-[76px]
                    sm:w-[170px]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[9px]
                      tracking-[0.2em]
                      text-accent-400
                    "
                  >
                    03
                  </span>

                  <span
                    className="
                      mt-1
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-white
                    "
                  >
                    Systems
                  </span>
                </div>
              </div>

              {/* =================================================
                  APPLICATION NODE
              ================================================= */}

              <div
                ref={applicationNodeRef}
                className="
                  absolute
                  bottom-[7%]
                  left-1/2
                  z-10
                  -translate-x-1/2
                "
              >
                <div
                  className="
                    flex
                    h-[70px]
                    w-[150px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-accent-400/50
                    bg-accent-400
                    shadow-[0_0_50px_rgba(255,255,255,0.06)]
                    sm:h-[76px]
                    sm:w-[170px]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[9px]
                      tracking-[0.2em]
                      text-white/70
                    "
                  >
                    04
                  </span>

                  <span
                    className="
                      mt-1
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-white
                    "
                  >
                    Applications
                  </span>
                </div>
              </div>

              {/* =================================================
                  SIDE LABELS
              ================================================= */}

              <div
                className="
                  absolute
                  left-[7%]
                  top-[47%]
                  hidden
                  lg:block
                "
              >
                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                    text-white/30
                  "
                >
                  Algorithms
                </span>
              </div>

              <div
                className="
                  absolute
                  right-[7%]
                  top-[47%]
                  hidden
                  lg:block
                "
              >
                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                    text-white/30
                  "
                >
                  Architecture
                </span>
              </div>
            </div>

            {/* =================================================
                BOTTOM STATEMENT
            ================================================= */}

            <div
              className="
                absolute
                bottom-5
                left-5
                right-5
                flex
                items-end
                justify-between
                gap-5
                sm:bottom-7
                sm:left-7
                sm:right-7
                lg:bottom-10
                lg:left-10
                lg:right-10
              "
            >
              <span
                className="
                  max-w-[260px]
                  text-[10px]
                  uppercase
                  leading-4
                  tracking-[0.16em]
                  text-white/30
                "
              >
                Logic becomes technology. Technology becomes possibility.
              </span>

              <span
                className="
                  font-mono
                  text-[9px]
                  tracking-[0.15em]
                  text-white/30
                "
              >
                CSE / 01—04
              </span>
            </div>
          </div>

          {/* =================================================
              CLOSING STATEMENT
          ================================================= */}

          <div
            className="
              mt-10
              flex
              flex-col
              gap-5
              border-t
              border-white/10
              pt-7
              sm:mt-12
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <p
              className="
                max-w-2xl
                text-[18px]
                font-semibold
                leading-7
                text-white
                sm:text-[21px]
                sm:leading-8
                lg:text-[24px]
                lg:leading-9
              "
            >
              Think logically. Build intelligently. Create technology that
              matters.
            </p>

            <span
              className="
                shrink-0
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              Computer Science & Engineering
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
