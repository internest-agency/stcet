"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface ECEConceptualVisualProps {
  className?: string;
}

export default function ECEConceptualVisual({
  className = "",
}: ECEConceptualVisualProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const signalRef = useRef<SVGGElement>(null);
  const processingRef = useRef<SVGGElement>(null);
  const communicationRef = useRef<SVGGElement>(null);
  const worldRef = useRef<SVGGElement>(null);

  const connectionRefs = useRef<SVGPathElement[]>([]);
  const pulseRefs = useRef<SVGCircleElement[]>([]);
  const deviceRefs = useRef<SVGGElement[]>([]);

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

  const addDeviceRef = (el: SVGGElement | null) => {
    if (el && !deviceRefs.current.includes(el)) {
      deviceRefs.current.push(el);
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

      const signal = signalRef.current;
      const processing = processingRef.current;
      const communication = communicationRef.current;
      const world = worldRef.current;

      const connections = connectionRefs.current;
      const pulses = pulseRefs.current;
      const devices = deviceRefs.current;

      if (!visual || !signal || !processing || !communication || !world) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            visual,
            signal,
            processing,
            communication,
            world,
            ...connections,
            ...pulses,
            ...devices,
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

      gsap.set([signal, processing, communication, world], {
        opacity: 0,
        scale: 0.9,
        transformOrigin: "center center",
      });

      gsap.set(connections, {
        opacity: 0,
        strokeDasharray: 700,
        strokeDashoffset: 700,
      });

      gsap.set(pulses, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      gsap.set(devices, {
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
         VISUAL REVEAL
      ===================================================== */

      timeline.to(visual, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      /* =====================================================
         SIGNAL
      ===================================================== */

      timeline.to(
        signal,
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
            duration: 0.9,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         PROCESSING
      ===================================================== */

      timeline.to(
        processing,
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
            duration: 0.9,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         COMMUNICATION
      ===================================================== */

      timeline.to(
        communication,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.4)",
        },
        "-=0.35",
      );

      /* =====================================================
         CONNECTION 3
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
         WORLD
      ===================================================== */

      timeline.to(
        world,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.3)",
        },
        "-=0.3",
      );

      /* =====================================================
         SIDE CONNECTIONS
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
         DEVICES
      ===================================================== */

      timeline.to(
        devices,
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
         SIGNAL PULSES
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
         CONTINUOUS PULSE
      ===================================================== */

      pulses.forEach((pulse, index) => {
        gsap.to(pulse, {
          scale: 1.5,
          opacity: 0.2,
          duration: 1.15,
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
                  Electronics & Communication
                </span>
              </div>

              <SectionHeading as="h2" className="text-white!">
                Connect the World
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
                Electronics and communication engineering transforms signals and
                information into the connected systems that bring people,
                devices and technologies together.
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
                Signal Architecture / 01—04
              </span>
            </div>

            {/* =================================================
                MAIN SVG
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
                  MAIN SIGNAL PATH
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 120 300
                  C 220 300
                    260 300
                    340 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              <path
                ref={addConnectionRef}
                d="
                  M 500 300
                  C 590 300
                    630 300
                    700 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              <path
                ref={addConnectionRef}
                d="
                  M 860 300
                  C 930 300
                    980 300
                    1080 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  LEFT DEVICE CONNECTION
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 780 275
                  C 820 220
                    880 190
                    940 175
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  RIGHT DEVICE CONNECTION
              ================================================= */}

              <path
                ref={addConnectionRef}
                d="
                  M 780 325
                  C 830 380
                    890 410
                    950 425
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/15"
              />

              {/* =================================================
                  SIGNAL PULSES
              ================================================= */}

              <circle
                ref={addPulseRef}
                cx="240"
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
                cx="940"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  SIGNAL
              ================================================= */}

              <g ref={signalRef}>
                <circle
                  cx="120"
                  cy="300"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="120"
                  cy="300"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/10"
                />

                {/* Waveform */}

                <path
                  d="
                    M 72 300
                    C 82 270
                      92 270
                      102 300
                    C 112 330
                      122 330
                      132 300
                    C 142 270
                      152 270
                      162 300
                  "
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent-400"
                />

                <text
                  x="120"
                  y="390"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  SIGNAL
                </text>

                <text
                  x="120"
                  y="408"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  INFORMATION
                </text>
              </g>

              {/* =================================================
                  PROCESSING
              ================================================= */}

              <g ref={processingRef}>
                <rect
                  x="340"
                  y="240"
                  width="160"
                  height="120"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <rect
                  x="365"
                  y="263"
                  width="110"
                  height="74"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/50"
                />

                {/* Chip */}

                <rect
                  x="390"
                  y="280"
                  width="60"
                  height="40"
                  fill="currentColor"
                  className="fill-accent-400/10"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  strokeOpacity="0.5"
                />

                {/* Pins */}

                <path
                  d="
                    M 378 280 H 365
                    M 378 290 H 365
                    M 378 300 H 365
                    M 378 310 H 365
                    M 450 280 H 463
                    M 450 290 H 463
                    M 450 300 H 463
                    M 450 310 H 463
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/30"
                />

                <text
                  x="420"
                  y="390"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  PROCESSING
                </text>

                <text
                  x="420"
                  y="408"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  ELECTRONICS
                </text>
              </g>

              {/* =================================================
                  COMMUNICATION
              ================================================= */}

              <g ref={communicationRef}>
                <circle
                  cx="780"
                  cy="300"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/10"
                />

                <circle
                  cx="780"
                  cy="300"
                  r="55"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* Antenna */}

                <path
                  d="
                    M 780 300
                    L 780 235
                    M 750 275
                    Q 780 245 810 275
                    M 735 260
                    Q 780 215 825 260
                  "
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent-400"
                />

                <circle
                  cx="780"
                  cy="300"
                  r="6"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <text
                  x="780"
                  y="410"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  COMMUNICATION
                </text>

                <text
                  x="780"
                  y="428"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  TRANSMISSION
                </text>
              </g>

              {/* =================================================
                  CONNECTED WORLD
              ================================================= */}

              <g ref={worldRef}>
                <circle
                  cx="1080"
                  cy="300"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="1080"
                  cy="300"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className="text-accent-400/50"
                />

                {/* Globe-like network */}

                <ellipse
                  cx="1080"
                  cy="300"
                  rx="28"
                  ry="45"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <path
                  d="
                    M 1035 300
                    H 1125
                    M 1045 280
                    Q 1080 295 1115 280
                    M 1045 320
                    Q 1080 305 1115 320
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="1080"
                  cy="300"
                  r="5"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <text
                  x="1080"
                  y="400"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  CONNECTED
                </text>

                <text
                  x="1080"
                  y="418"
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-white/30"
                  fontSize="8"
                  letterSpacing="1.5"
                >
                  DIGITAL WORLD
                </text>
              </g>

              {/* =================================================
                  DEVICE 1
              ================================================= */}

              <g ref={addDeviceRef}>
                <rect
                  x="925"
                  y="135"
                  width="52"
                  height="34"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="951"
                  cy="152"
                  r="6"
                  fill="currentColor"
                  className="text-accent-400"
                />
              </g>

              {/* =================================================
                  DEVICE 2
              ================================================= */}

              <g ref={addDeviceRef}>
                <rect
                  x="945"
                  y="410"
                  width="52"
                  height="34"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="971"
                  cy="427"
                  r="6"
                  fill="currentColor"
                  className="text-accent-400"
                />
              </g>
            </svg>

            {/* =================================================
                SIDE LABELS
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
                Signal → System → Connection
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
                ECE / 01—04
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
              Understand the signal. Build the system. Connect the world.
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
              Electronics & Communication Engineering
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
