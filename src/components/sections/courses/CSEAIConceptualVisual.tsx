"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface CSEAIConceptualVisualProps {
  className?: string;
}

export default function CSEAIConceptualVisual({
  className = "",
}: CSEAIConceptualVisualProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<SVGGElement>(null);
  const learningRef = useRef<SVGGElement>(null);
  const intelligenceRef = useRef<SVGGElement>(null);
  const predictionRef = useRef<SVGGElement>(null);

  const connectionRefs = useRef<SVGLineElement[]>([]);
  const nodeRefs = useRef<SVGCircleElement[]>([]);
  const pulseRefs = useRef<SVGCircleElement[]>([]);

  const addConnectionRef = (el: SVGLineElement | null) => {
    if (el && !connectionRefs.current.includes(el)) {
      connectionRefs.current.push(el);
    }
  };

  const addNodeRef = (el: SVGCircleElement | null) => {
    if (el && !nodeRefs.current.includes(el)) {
      nodeRefs.current.push(el);
    }
  };

  const addPulseRef = (el: SVGCircleElement | null) => {
    if (el && !pulseRefs.current.includes(el)) {
      pulseRefs.current.push(el);
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

      const data = dataRef.current;
      const learning = learningRef.current;
      const intelligence = intelligenceRef.current;
      const prediction = predictionRef.current;

      const connections = connectionRefs.current;
      const nodes = nodeRefs.current;
      const pulses = pulseRefs.current;

      if (!visual || !data || !learning || !intelligence || !prediction) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            visual,
            data,
            learning,
            intelligence,
            prediction,
            ...connections,
            ...nodes,
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

      gsap.set([data, learning, intelligence, prediction], {
        opacity: 0,
        scale: 0.88,
        transformOrigin: "center center",
      });

      gsap.set(nodes, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      gsap.set(connections, {
        opacity: 0,
        strokeDasharray: 300,
        strokeDashoffset: 300,
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
         VISUAL REVEAL
      ===================================================== */

      timeline.to(visual, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      /* =====================================================
         DATA
      ===================================================== */

      timeline.to(
        data,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "-=0.45",
      );

      /* =====================================================
         DATA NODES
      ===================================================== */

      timeline.to(
        nodes.slice(0, 4),
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: "back.out(1.6)",
        },
        "-=0.25",
      );

      /* =====================================================
         CONNECTIONS INTO LEARNING
      ===================================================== */

      timeline.to(
        connections.slice(0, 4),
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.inOut",
        },
        "-=0.15",
      );

      /* =====================================================
         LEARNING
      ===================================================== */

      timeline.to(
        learning,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "-=0.25",
      );

      /* =====================================================
         MIDDLE CONNECTIONS
      ===================================================== */

      timeline.to(
        connections.slice(4, 12),
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        "-=0.2",
      );

      /* =====================================================
         HIDDEN / LEARNING NODES
      ===================================================== */

      timeline.to(
        nodes.slice(4, 10),
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.06,
          ease: "back.out(1.5)",
        },
        "-=0.35",
      );

      /* =====================================================
         INTELLIGENCE
      ===================================================== */

      timeline.to(
        intelligence,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.4)",
        },
        "-=0.2",
      );

      /* =====================================================
         FINAL CONNECTIONS
      ===================================================== */

      timeline.to(
        connections.slice(12),
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.inOut",
        },
        "-=0.2",
      );

      /* =====================================================
         PREDICTION
      ===================================================== */

      timeline.to(
        prediction,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.3)",
        },
        "-=0.25",
      );

      /* =====================================================
         FINAL NODES
      ===================================================== */

      timeline.to(
        nodes.slice(10),
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: "back.out(1.5)",
        },
        "-=0.3",
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
         CONTINUOUS NEURAL ACTIVITY
      ===================================================== */

      pulses.forEach((pulse, index) => {
        gsap.to(pulse, {
          scale: 1.5,
          opacity: 0.2,
          duration: 1.15,
          repeat: -1,
          yoyo: true,
          delay: index * 0.15,
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
                  Artificial Intelligence & Machine Learning
                </span>
              </div>

              <SectionHeading as="h2" className="text-white!">
                Teach the Machine
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
                Artificial intelligence transforms data into patterns, patterns
                into learning and learning into intelligent systems that can
                predict, adapt and make decisions.
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
              min-h-[540px]
              overflow-hidden
              border
              border-white/10
              bg-primary-900/40
              sm:mt-18
              lg:mt-20
              lg:min-h-[620px]
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
                Neural Architecture / 01—06
              </span>
            </div>

            {/* =================================================
                MAIN SVG
            ================================================= */}

            <svg
              viewBox="0 0 1200 620"
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
                  DATA → LEARNING CONNECTIONS
              ================================================= */}

              <line
                ref={addConnectionRef}
                x1="130"
                y1="250"
                x2="390"
                y2="190"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              <line
                ref={addConnectionRef}
                x1="130"
                y1="290"
                x2="390"
                y2="250"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              <line
                ref={addConnectionRef}
                x1="130"
                y1="330"
                x2="390"
                y2="350"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              <line
                ref={addConnectionRef}
                x1="130"
                y1="370"
                x2="390"
                y2="410"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  LEARNING → HIDDEN LAYER
              ================================================= */}

              <line
                ref={addConnectionRef}
                x1="410"
                y1="190"
                x2="600"
                y2="150"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="190"
                x2="600"
                y2="250"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="250"
                x2="600"
                y2="150"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="250"
                x2="600"
                y2="250"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="250"
                x2="600"
                y2="350"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="350"
                x2="600"
                y2="250"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="350"
                x2="600"
                y2="350"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="410"
                x2="600"
                y2="350"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="410"
                y1="410"
                x2="600"
                y2="450"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  HIDDEN → INTELLIGENCE
              ================================================= */}

              <line
                ref={addConnectionRef}
                x1="620"
                y1="150"
                x2="790"
                y2="210"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="620"
                y1="250"
                x2="790"
                y2="210"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="620"
                y1="350"
                x2="790"
                y2="310"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              <line
                ref={addConnectionRef}
                x1="620"
                y1="450"
                x2="790"
                y2="310"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  INTELLIGENCE → PREDICTION
              ================================================= */}

              <line
                ref={addConnectionRef}
                x1="810"
                y1="210"
                x2="1010"
                y2="260"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              <line
                ref={addConnectionRef}
                x1="810"
                y1="310"
                x2="1010"
                y2="340"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  DATA NODES
              ================================================= */}

              <circle
                ref={addNodeRef}
                cx="130"
                cy="250"
                r="7"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="130"
                cy="290"
                r="7"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="130"
                cy="330"
                r="7"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="130"
                cy="370"
                r="7"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  LEARNING NODES
              ================================================= */}

              <circle
                ref={addNodeRef}
                cx="400"
                cy="190"
                r="9"
                fill="currentColor"
                className="text-white/70"
              />

              <circle
                ref={addNodeRef}
                cx="400"
                cy="250"
                r="9"
                fill="currentColor"
                className="text-white/70"
              />

              <circle
                ref={addNodeRef}
                cx="400"
                cy="350"
                r="9"
                fill="currentColor"
                className="text-white/70"
              />

              <circle
                ref={addNodeRef}
                cx="400"
                cy="410"
                r="9"
                fill="currentColor"
                className="text-white/70"
              />

              {/* =================================================
                  HIDDEN LAYER NODES
              ================================================= */}

              <circle
                ref={addNodeRef}
                cx="610"
                cy="150"
                r="8"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="610"
                cy="250"
                r="8"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="610"
                cy="350"
                r="8"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="610"
                cy="450"
                r="8"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  INTELLIGENCE NODES
              ================================================= */}

              <circle
                ref={addNodeRef}
                cx="800"
                cy="210"
                r="11"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addNodeRef}
                cx="800"
                cy="310"
                r="11"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  PREDICTION NODES
              ================================================= */}

              <circle
                ref={addNodeRef}
                cx="1020"
                cy="260"
                r="8"
                fill="currentColor"
                className="text-white"
              />

              <circle
                ref={addNodeRef}
                cx="1020"
                cy="340"
                r="8"
                fill="currentColor"
                className="text-white"
              />

              {/* =================================================
                  PULSES
              ================================================= */}

              <circle
                ref={addPulseRef}
                cx="250"
                cy="270"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="500"
                cy="220"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="700"
                cy="280"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="900"
                cy="230"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  DATA GROUP
              ================================================= */}

              <g ref={dataRef}>
                <text
                  x="130"
                  y="440"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  DATA
                </text>

                <text
                  x="130"
                  y="458"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  INPUT
                </text>
              </g>

              {/* =================================================
                  LEARNING GROUP
              ================================================= */}

              <g ref={learningRef}>
                <rect
                  x="350"
                  y="110"
                  width="100"
                  height="340"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/10"
                />

                <text
                  x="400"
                  y="485"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  LEARNING
                </text>

                <text
                  x="400"
                  y="503"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  PATTERNS
                </text>
              </g>

              {/* =================================================
                  INTELLIGENCE GROUP
              ================================================= */}

              <g ref={intelligenceRef}>
                <circle
                  cx="800"
                  cy="260"
                  r="75"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                />

                <circle
                  cx="800"
                  cy="260"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className="text-accent-400/50"
                />

                <circle
                  cx="800"
                  cy="260"
                  r="18"
                  fill="currentColor"
                  className="fill-accent-400/10"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />

                <text
                  x="800"
                  y="365"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  INTELLIGENCE
                </text>

                <text
                  x="800"
                  y="383"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  LEARNED MODEL
                </text>
              </g>

              {/* =================================================
                  PREDICTION GROUP
              ================================================= */}

              <g ref={predictionRef}>
                <rect
                  x="985"
                  y="190"
                  width="100"
                  height="180"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/40"
                />

                {/* Prediction chart */}

                <path
                  d="
                    M 1005 330
                    L 1020 300
                    L 1032 315
                    L 1045 270
                    L 1060 285
                  "
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-accent-400"
                />

                <text
                  x="1035"
                  y="405"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  PREDICTION
                </text>

                <text
                  x="1035"
                  y="423"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1.3"
                >
                  OUTPUT
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
                Data → Learning → Intelligence → Prediction
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
                AI & ML / 01—06
              </span>
            </div>
          </div>

          {/* =================================================
              CLOSING STATEMENT
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
              Give machines the ability to learn. Build intelligence that
              creates possibilities.
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
              CSE — AI & ML
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
