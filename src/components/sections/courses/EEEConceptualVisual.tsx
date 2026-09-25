"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface EEEConceptualVisualProps {
  className?: string;
}

export default function EEEConceptualVisual({
  className = "",
}: EEEConceptualVisualProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const generationRef = useRef<SVGGElement>(null);
  const powerRef = useRef<SVGGElement>(null);
  const controlRef = useRef<SVGGElement>(null);
  const futureRef = useRef<SVGGElement>(null);

  const connectionRefs = useRef<SVGPathElement[]>([]);
  const pulseRefs = useRef<SVGCircleElement[]>([]);
  const outputRefs = useRef<SVGGElement[]>([]);

  const addConnectionRef = (el: SVGPathElement | null) => {
    if (el && !connectionRefs.current.includes(el)) {
      connectionRefs.current.push(el);
    }
  };

  const addPulseRef = (el: SVGCircleElement | null) => {
    if (el && !pulseRefs.current.includes(el)) {
      pulseRefs.current.push(el);
    }
  };

  const addOutputRef = (el: SVGGElement | null) => {
    if (el && !outputRefs.current.includes(el)) {
      outputRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const visual = visualRef.current;

      const generation = generationRef.current;
      const power = powerRef.current;
      const control = controlRef.current;
      const future = futureRef.current;

      const connections = connectionRefs.current;
      const pulses = pulseRefs.current;
      const outputs = outputRefs.current;

      if (!visual || !generation || !power || !control || !future) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            visual,
            generation,
            power,
            control,
            future,
            ...connections,
            ...pulses,
            ...outputs,
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

      gsap.set([generation, power, control, future], {
        opacity: 0,
        scale: 0.88,
        transformOrigin: "center center",
      });

      gsap.set(connections, {
        opacity: 0,
        strokeDasharray: 800,
        strokeDashoffset: 800,
      });

      gsap.set(pulses, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      gsap.set(outputs, {
        opacity: 0,
        scale: 0.85,
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
         VISUAL
      ===================================================== */

      timeline.to(visual, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      /* =====================================================
         GENERATION
      ===================================================== */

      timeline.to(
        generation,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.4)",
        },
        "-=0.45",
      );

      /* =====================================================
         CONNECTION 1
      ===================================================== */

      if (connections[0]) {
        timeline.to(
          connections[0],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         POWER
      ===================================================== */

      timeline.to(
        power,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.4)",
        },
        "-=0.35",
      );

      /* =====================================================
         CONNECTION 2
      ===================================================== */

      if (connections[1]) {
        timeline.to(
          connections[1],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         CONTROL
      ===================================================== */

      timeline.to(
        control,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.4)",
        },
        "-=0.35",
      );

      /* =====================================================
         MAIN FUTURE CONNECTION
      ===================================================== */

      if (connections[2]) {
        timeline.to(
          connections[2],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         FUTURE
      ===================================================== */

      timeline.to(
        future,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.3)",
        },
        "-=0.3",
      );

      /* =====================================================
         OUTPUT CONNECTIONS
      ===================================================== */

      timeline.to(
        connections.slice(3),
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.inOut",
        },
        "-=0.25",
      );

      /* =====================================================
         OUTPUT SYSTEMS
      ===================================================== */

      timeline.to(
        outputs,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.12,
          ease: "back.out(1.4)",
        },
        "-=0.25",
      );

      /* =====================================================
         PULSES
      ===================================================== */

      timeline.to(
        pulses,
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.2",
      );

      /* =====================================================
         CONTINUOUS ENERGY PULSE
      ===================================================== */

      pulses.forEach((pulse, index) => {
        gsap.to(pulse, {
          scale: 1.55,
          opacity: 0.2,
          duration: 1.15,
          repeat: -1,
          yoyo: true,
          delay: index * 0.16,
          ease: "sine.inOut",
        });
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

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
        <div className="py-20 sm:py-24 lg:py-28">
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
                  Electrical & Electronics
                </span>
              </div>

              <SectionHeading as="h2" className="text-white!">
                Powering Tomorrow
              </SectionHeading>
            </div>

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
                Electrical and electronics engineering transforms energy into
                controlled, intelligent systems that power industries,
                transportation and the technologies of tomorrow.
              </p>
            </div>
          </div>

          {/* =================================================
              VISUAL
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
                GRID
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
                TOP LABEL
            ================================================= */}

            <div
              className="
                absolute
                left-5
                top-5
                z-10
                sm:left-7
                sm:top-7
                lg:left-10
                lg:top-10
              "
            >
              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                "
              >
                Energy Architecture / 01—04
              </span>
            </div>

            {/* =================================================
                SVG
            ================================================= */}

            <svg
              viewBox="0 0 1200 600"
              className="
                absolute
                inset-0
                h-full
                w-full
              "
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* =================================================
                  GENERATION → POWER
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 185 300
                  C 260 300
                    305 300
                    365 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  POWER → CONTROL
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 515 300
                  C 590 300
                    635 300
                    690 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  CONTROL → FUTURE
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 840 300
                  C 900 300
                    950 300
                    1015 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  FUTURE → EV
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 1045 270
                  C 1030 215
                    975 175
                    925 155
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  FUTURE → INDUSTRY
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 1045 330
                  C 1030 385
                    975 425
                    925 445
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  FUTURE → SMART GRID
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 1075 300
                  C 1120 300
                    1145 300
                    1170 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  ENERGY PULSES
              ================================================= */}

              <circle
                ref={addPulseRef}
                cx="270"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="600"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="900"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  GENERATION
              ================================================= */}

              <g ref={generationRef}>
                <circle
                  cx="125"
                  cy="300"
                  r="62"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="125"
                  cy="300"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className="text-accent-400/40"
                />

                {/* Sun / energy */}

                <circle
                  cx="125"
                  cy="300"
                  r="18"
                  fill="currentColor"
                  className="fill-accent-400/10"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="
                    M 125 270 V 258
                    M 125 330 V 342
                    M 95 300 H 83
                    M 155 300 H 167
                    M 103 278 L 94 269
                    M 147 322 L 156 331
                    M 147 278 L 156 269
                    M 103 322 L 94 331
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <text
                  x="125"
                  y="390"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  GENERATION
                </text>

                <text
                  x="125"
                  y="408"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  ENERGY
                </text>
              </g>

              {/* =================================================
                  POWER
              ================================================= */}

              <g ref={powerRef}>
                <rect
                  x="365"
                  y="240"
                  width="150"
                  height="120"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* Transformer */}

                <circle
                  cx="420"
                  cy="300"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/60"
                />

                <circle
                  cx="420"
                  cy="300"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <path
                  d="
                    M 450 300 H 480
                    M 390 300 H 365
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/30"
                />

                <text
                  x="440"
                  y="390"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  POWER
                </text>

                <text
                  x="440"
                  y="408"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  CONVERSION
                </text>
              </g>

              {/* =================================================
                  CONTROL
              ================================================= */}

              <g ref={controlRef}>
                <circle
                  cx="765"
                  cy="300"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                />

                <circle
                  cx="765"
                  cy="300"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/40"
                />

                {/* Control symbol */}

                <path
                  d="
                    M 735 285
                    H 795
                    M 735 300
                    H 795
                    M 735 315
                    H 795
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/30"
                />

                <circle
                  cx="750"
                  cy="285"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <circle
                  cx="780"
                  cy="300"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <circle
                  cx="760"
                  cy="315"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <text
                  x="765"
                  y="410"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  CONTROL
                </text>

                <text
                  x="765"
                  y="428"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  INTELLIGENCE
                </text>
              </g>

              {/* =================================================
                  FUTURE
              ================================================= */}

              <g ref={futureRef}>
                <circle
                  cx="1045"
                  cy="300"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/50"
                />

                <circle
                  cx="1045"
                  cy="300"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className="text-white/20"
                />

                {/* Core */}

                <circle
                  cx="1045"
                  cy="300"
                  r="9"
                  fill="currentColor"
                  className="text-accent-400"
                />

                {/* Energy rays */}

                <path
                  d="
                    M 1045 260 V 240
                    M 1045 340 V 360
                    M 1005 300 H 985
                    M 1085 300 H 1105
                    M 1017 272 L 1003 258
                    M 1073 328 L 1087 342
                    M 1073 272 L 1087 258
                    M 1017 328 L 1003 342
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <text
                  x="1045"
                  y="400"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  SMART FUTURE
                </text>

                <text
                  x="1045"
                  y="418"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  SUSTAINABILITY
                </text>
              </g>

              {/* =================================================
                  EV OUTPUT
              ================================================= */}

              <g ref={addOutputRef}>
                <rect
                  x="895"
                  y="125"
                  width="62"
                  height="38"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <path
                  d="
                    M 910 150
                    L 918 138
                    H 938
                    L 946 150
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <circle cx="912" cy="156" r="3" className="fill-white/30" />

                <circle cx="942" cy="156" r="3" className="fill-white/30" />

                <text
                  x="926"
                  y="185"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1"
                >
                  EV
                </text>
              </g>

              {/* =================================================
                  INDUSTRY OUTPUT
              ================================================= */}

              <g ref={addOutputRef}>
                <rect
                  x="895"
                  y="425"
                  width="62"
                  height="38"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <path
                  d="
                    M 907 451
                    V 440
                    H 916
                    V 434
                    H 926
                    V 440
                    H 936
                    V 432
                    H 946
                    V 451
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <text
                  x="926"
                  y="480"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1"
                >
                  INDUSTRY
                </text>
              </g>

              {/* =================================================
                  SMART GRID OUTPUT
              ================================================= */}

              <g ref={addOutputRef}>
                <circle
                  cx="1160"
                  cy="300"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <path
                  d="
                    M 1148 308
                    L 1158 288
                    L 1163 298
                    L 1172 290
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <text
                  x="1160"
                  y="342"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1"
                >
                  SMART GRID
                </text>
              </g>
            </svg>

            {/* =================================================
                BOTTOM LABEL
            ================================================= */}

            <div
              className="
                absolute
                bottom-5
                left-5
                sm:bottom-7
                sm:left-7
                lg:bottom-10
                lg:left-10
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
                Energy → Power → Control → Future
              </span>
            </div>

            <div
              className="
                absolute
                bottom-5
                right-5
                sm:bottom-7
                sm:right-7
                lg:bottom-10
                lg:right-10
              "
            >
              <span
                className="
                  font-mono
                  text-[9px]
                  tracking-[0.15em]
                  text-white/30
                "
              >
                EEE / 01—04
              </span>
            </div>
          </div>

          {/* =================================================
              CLOSING
          ================================================= */}

          <div
            className="
              mt-10
              border-t
              border-white/10
              pt-7
              sm:mt-12
              sm:flex
              sm:items-end
              sm:justify-between
              sm:gap-8
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
              Understand power. Control systems. Build a more connected and
              sustainable future.
            </p>

            <span
              className="
                mt-5
                block
                shrink-0
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white/30
                sm:mt-0
              "
            >
              Electrical & Electronics Engineering
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
