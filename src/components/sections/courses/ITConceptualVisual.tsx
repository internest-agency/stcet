"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface ITConceptualVisualProps {
  className?: string;
}

export default function ITConceptualVisual({
  className = "",
}: ITConceptualVisualProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const applicationRef = useRef<SVGGElement>(null);
  const dataRef = useRef<SVGGElement>(null);
  const networkRef = useRef<SVGGElement>(null);
  const cloudRef = useRef<SVGGElement>(null);
  const securityRef = useRef<SVGGElement>(null);
  const digitalWorldRef = useRef<SVGGElement>(null);

  const connectionRefs = useRef<SVGPathElement[]>([]);
  const pulseRefs = useRef<SVGCircleElement[]>([]);

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

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const visual = visualRef.current;

      const application = applicationRef.current;
      const data = dataRef.current;
      const network = networkRef.current;
      const cloud = cloudRef.current;
      const security = securityRef.current;
      const digitalWorld = digitalWorldRef.current;

      const connections = connectionRefs.current;
      const pulses = pulseRefs.current;

      if (
        !visual ||
        !application ||
        !data ||
        !network ||
        !cloud ||
        !security ||
        !digitalWorld
      ) {
        return;
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reducedMotion) {
        gsap.set(
          [
            visual,
            application,
            data,
            network,
            cloud,
            security,
            digitalWorld,
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

      gsap.set([application, data, network, cloud, security, digitalWorld], {
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
         APPLICATION
      ===================================================== */

      timeline.to(
        application,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
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
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

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
        "-=0.3",
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
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         NETWORK
      ===================================================== */

      timeline.to(
        network,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "-=0.3",
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
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         CLOUD
      ===================================================== */

      timeline.to(
        cloud,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "-=0.3",
      );

      /* =====================================================
         CONNECTION 4
      ===================================================== */

      if (connections[3]) {
        timeline.to(
          connections[3],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.2",
        );
      }

      /* =====================================================
         SECURITY
      ===================================================== */

      timeline.to(
        security,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "-=0.3",
      );

      /* =====================================================
         CONNECTION 5
      ===================================================== */

      if (connections[4]) {
        timeline.to(
          connections[4],
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
         DIGITAL WORLD
      ===================================================== */

      timeline.to(
        digitalWorld,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.3)",
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
        "-=0.25",
      );

      /* =====================================================
         CONTINUOUS DATA FLOW
      ===================================================== */

      pulses.forEach((pulse, index) => {
        gsap.to(pulse, {
          scale: 1.5,
          opacity: 0.2,
          duration: 1.1,
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
                  Information Technology
                </span>
              </div>

              <SectionHeading as="h2" className="!text-white">
                Build the Digital Infrastructure
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
                Information Technology connects applications, data, networks and
                cloud systems to create the digital infrastructure that modern
                organisations depend on.
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
              min-h-[540px]
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
                Digital Infrastructure / 01—06
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
                  MAIN CONNECTIONS
              ================================================= */}

              {/* APPLICATION → DATA */}

              <path
                ref={addConnectionRef}
                d="
                  M 145 300
                  C 205 300
                    250 300
                    315 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* DATA → NETWORK */}

              <path
                ref={addConnectionRef}
                d="
                  M 445 300
                  C 500 300
                    545 300
                    600 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* NETWORK → CLOUD */}

              <path
                ref={addConnectionRef}
                d="
                  M 730 300
                  C 780 300
                    815 300
                    870 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* CLOUD → SECURITY */}

              <path
                ref={addConnectionRef}
                d="
                  M 1000 300
                  C 1020 300
                    1035 300
                    1060 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* SECURITY → WORLD */}

              <path
                ref={addConnectionRef}
                d="
                  M 1120 300
                  C 1140 300
                    1155 300
                    1180 300
                "
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/20"
              />

              {/* =================================================
                  DATA FLOW PULSES
              ================================================= */}

              <circle
                ref={addPulseRef}
                cx="225"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="525"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="810"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="1035"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              <circle
                ref={addPulseRef}
                cx="1150"
                cy="300"
                r="4"
                fill="currentColor"
                className="text-accent-400"
              />

              {/* =================================================
                  APPLICATION
              ================================================= */}

              <g ref={applicationRef}>
                <rect
                  x="55"
                  y="235"
                  width="100"
                  height="130"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* Browser window */}

                <rect
                  x="72"
                  y="255"
                  width="66"
                  height="45"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/50"
                />

                <circle cx="79" cy="263" r="2" className="fill-accent-400" />

                <circle cx="86" cy="263" r="2" className="fill-white/20" />

                <path
                  d="
                    M 80 280
                    H 125
                    M 80 288
                    H 116
                    M 80 296
                    H 122
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* App blocks */}

                <rect
                  x="72"
                  y="315"
                  width="28"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <rect
                  x="108"
                  y="315"
                  width="30"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <text
                  x="105"
                  y="395"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  APPLICATIONS
                </text>

                <text
                  x="105"
                  y="412"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1.3"
                >
                  USER EXPERIENCE
                </text>
              </g>

              {/* =================================================
                  DATA
              ================================================= */}

              <g ref={dataRef}>
                <rect
                  x="315"
                  y="235"
                  width="130"
                  height="130"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                {/* Database cylinders */}

                <ellipse
                  cx="380"
                  cy="270"
                  rx="34"
                  ry="12"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/60"
                />

                <path
                  d="
                    M 346 270
                    V 330
                    C 346 342
                      414 342
                      414 330
                    V 270
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/60"
                />

                <path
                  d="
                    M 346 290
                    C 346 302
                      414 302
                      414 290

                    M 346 310
                    C 346 322
                      414 322
                      414 310
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                />

                <text
                  x="380"
                  y="395"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  DATA
                </text>

                <text
                  x="380"
                  y="412"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1.3"
                >
                  INFORMATION
                </text>
              </g>

              {/* =================================================
                  NETWORK
              ================================================= */}

              <g ref={networkRef}>
                <circle
                  cx="665"
                  cy="300"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                />

                {/* Network nodes */}

                <circle
                  cx="665"
                  cy="255"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <circle
                  cx="620"
                  cy="330"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <circle
                  cx="710"
                  cy="330"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <circle
                  cx="665"
                  cy="300"
                  r="12"
                  fill="currentColor"
                  className="fill-accent-400/10"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />

                <path
                  d="
                    M 665 263 L 665 288
                    M 658 306 L 627 326
                    M 672 306 L 703 326
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/30"
                />

                <text
                  x="665"
                  y="395"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  NETWORK
                </text>

                <text
                  x="665"
                  y="412"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1.3"
                >
                  CONNECTIVITY
                </text>
              </g>

              {/* =================================================
                  CLOUD
              ================================================= */}

              <g ref={cloudRef}>
                <path
                  d="
                    M 850 320
                    C 850 295
                      870 278
                      895 278
                    C 905 250
                      930 235
                      958 242
                    C 980 244
                      998 262
                      1000 285
                    C 1018 288
                      1030 302
                      1030 320
                    C 1030 344
                      1012 360
                      988 360
                    H 890
                    C 868 360
                      850 343
                      850 320
                    Z
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <path
                  d="
                    M 900 315
                    Q 940 285 980 315
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400"
                />

                <circle
                  cx="920"
                  cy="315"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <circle
                  cx="940"
                  cy="300"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <circle
                  cx="960"
                  cy="315"
                  r="4"
                  fill="currentColor"
                  className="text-accent-400"
                />

                <text
                  x="940"
                  y="395"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  CLOUD
                </text>

                <text
                  x="940"
                  y="412"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1.3"
                >
                  COMPUTING
                </text>
              </g>

              {/* =================================================
                  SECURITY
              ================================================= */}

              <g ref={securityRef}>
                <path
                  d="
                    M 1088 250
                    L 1120 262
                    V 300
                    C 1120 328
                      1103 345
                      1088 352
                    C 1073 345
                      1056 328
                      1056 300
                    V 262
                    Z
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent-400/60"
                />

                {/* Lock */}

                <rect
                  x="1076"
                  y="293"
                  width="24"
                  height="20"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/30"
                />

                <path
                  d="
                    M 1081 293
                    V 286
                    C 1081 277
                      1095 277
                      1095 286
                    V 293
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/30"
                />

                <circle cx="1088" cy="303" r="2" className="fill-accent-400" />

                <text
                  x="1088"
                  y="395"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.8"
                >
                  SECURITY
                </text>

                <text
                  x="1088"
                  y="412"
                  textAnchor="middle"
                  className="fill-white/30"
                  fontSize="7"
                  letterSpacing="1.3"
                >
                  PROTECTION
                </text>
              </g>

              {/* =================================================
                  DIGITAL WORLD
              ================================================= */}

              <g ref={digitalWorldRef}>
                <circle
                  cx="1170"
                  cy="300"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <circle
                  cx="1170"
                  cy="300"
                  r="27"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  className="text-accent-400/50"
                />

                {/* Digital nodes */}

                <circle cx="1170" cy="273" r="4" className="fill-accent-400" />

                <circle cx="1147" cy="314" r="4" className="fill-accent-400" />

                <circle cx="1193" cy="314" r="4" className="fill-accent-400" />

                <path
                  d="
                    M 1170 273 L 1147 314
                    M 1170 273 L 1193 314
                    M 1147 314 L 1193 314
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                />

                <text
                  x="1170"
                  y="375"
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="9"
                  fontWeight="700"
                  letterSpacing="1.5"
                >
                  DIGITAL WORLD
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
                Applications → Data → Infrastructure
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
                IT / 01—06
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
              Connect technology. Secure information. Build the digital world.
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
              Information Technology
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
