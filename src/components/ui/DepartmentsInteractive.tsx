"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "@/src/components/ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

type DepartmentNode = {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  x: number;
  y: number;
};

const departmentNodes: DepartmentNode[] = [
  {
    id: "programming",
    number: "01",
    title: "Programming",
    description: "Algorithms, code and software development.",
    href: "/courses/computer-science-and-engineering",
    x: 600,
    y: 95,
  },
  {
    id: "data",
    number: "02",
    title: "Data",
    description: "Data analytics, engineering and intelligent systems.",
    href: "/courses/computer-science-and-engineering",
    x: 1035,
    y: 280,
  },
  {
    id: "networks",
    number: "03",
    title: "Networks & Security",
    description: "Connected systems, networks and cybersecurity.",
    href: "/courses/computer-science-and-engineering",
    x: 920,
    y: 545,
  },
  {
    id: "cloud",
    number: "04",
    title: "Cloud & Systems",
    description: "Cloud computing, operating systems and distributed systems.",
    href: "/courses/computer-science-and-engineering",
    x: 480,
    y: 545,
  },
  {
    id: "ai",
    number: "05",
    title: "AI & Emerging Tech",
    description: "Machine learning, intelligence and emerging technologies.",
    href: "/courses/computer-science-and-engineering",
    x: 260,
    y: 280,
  },
];

const paths = [
  {
    id: "programming-path",
    department: "programming",
    d: "M600 95 C600 170 600 220 600 300",
  },
  {
    id: "data-path",
    department: "data",
    d: "M1035 280 C930 300 820 330 700 355",
  },
  {
    id: "networks-path",
    department: "networks",
    d: "M920 545 C835 495 770 440 690 395",
  },
  {
    id: "cloud-path",
    department: "cloud",
    d: "M480 545 C535 490 565 440 585 395",
  },
  {
    id: "ai-path",
    department: "ai",
    d: "M260 280 C360 300 460 330 525 355",
  },
];

function ProgrammingIcon() {
  return (
    <g>
      <path
        d="M-20 -10L-34 0L-20 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M20 -10L34 0L20 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 -20L-8 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

function DataIcon() {
  return (
    <g>
      <ellipse
        cx="0"
        cy="-15"
        rx="23"
        ry="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M-23 -15V13C-23 25 23 25 23 13V-15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M-23 0C-23 12 23 12 23 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </g>
  );
}

function NetworkIcon() {
  return (
    <g>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M-25 -20L0 0L25 -20" />
        <path d="M0 0L-15 25" />
        <path d="M0 0L15 25" />
      </g>

      <g fill="currentColor">
        <circle cx="-25" cy="-20" r="5" />
        <circle cx="0" cy="0" r="5" />
        <circle cx="25" cy="-20" r="5" />
        <circle cx="-15" cy="25" r="5" />
        <circle cx="15" cy="25" r="5" />
      </g>
    </g>
  );
}

function CloudIcon() {
  return (
    <g>
      <path
        d="
          M-28 12
          C-38 12 -42 4 -40 -4
          C-38 -14 -29 -19 -20 -17
          C-15 -30 0 -34 11 -26
          C18 -22 20 -17 20 -12
          C32 -14 40 -7 40 2
          C40 10 34 15 25 15
          H-28
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function AIIcon() {
  return (
    <g>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M-27 -12L-8 -25L10 -12L27 -24" />
        <path d="M-27 -12L-8 8L10 -12L27 8" />
        <path d="M-8 8L0 27L10 -12" />
      </g>

      <g fill="currentColor">
        <circle cx="-27" cy="-12" r="5" />
        <circle cx="-8" cy="-25" r="5" />
        <circle cx="10" cy="-12" r="5" />
        <circle cx="27" cy="-24" r="5" />
        <circle cx="-8" cy="8" r="5" />
        <circle cx="27" cy="8" r="5" />
        <circle cx="0" cy="27" r="5" />
      </g>
    </g>
  );
}

function TechnologyIcon({ id }: { id: string }) {
  switch (id) {
    case "programming":
      return <ProgrammingIcon />;

    case "data":
      return <DataIcon />;

    case "networks":
      return <NetworkIcon />;

    case "cloud":
      return <CloudIcon />;

    case "ai":
      return <AIIcon />;

    default:
      return null;
  }
}

function Character() {
  return (
    <g className="cse-character">
      {/* chair / shadow */}
      <ellipse cx="605" cy="690" rx="125" ry="14" fill="#000" opacity=".25" />

      {/* body */}
      <path
        d="
          M535 635
          C540 555 570 510 615 510
          C660 510 690 555 695 635
          Z
        "
        fill="#0a2b5e"
        stroke="#65d7ff"
        strokeWidth="2"
      />

      {/* hoodie inner */}
      <path
        d="M575 535C588 565 638 565 653 535"
        fill="none"
        stroke="#8ca4c9"
        strokeWidth="2"
        opacity=".6"
      />

      {/* neck */}
      <path
        d="M595 510V530"
        stroke="#e9a47e"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* head */}
      <ellipse
        cx="615"
        cy="470"
        rx="43"
        ry="48"
        fill="#efb38c"
        stroke="#ff6b2c"
        strokeWidth="2"
      />

      {/* hair */}
      <path
        d="
          M575 466
          C570 430 584 398 619 397
          C653 397 674 422 663 457
          C649 441 636 439 622 429
          C609 445 594 455 575 466
          Z
        "
        fill="#111a2c"
      />

      {/* glasses */}
      <g fill="none" stroke="#101827" strokeWidth="3">
        <rect x="583" y="462" width="27" height="20" rx="5" />

        <rect x="620" y="462" width="27" height="20" rx="5" />

        <path d="M610 471H620" />
      </g>

      {/* eyes */}
      <circle cx="597" cy="472" r="2" fill="#111" />

      <circle cx="633" cy="472" r="2" fill="#111" />

      {/* left arm */}
      <path
        d="M566 565C535 590 510 610 492 632"
        fill="none"
        stroke="#efb38c"
        strokeWidth="17"
        strokeLinecap="round"
      />

      {/* right arm */}
      <path
        d="M660 565C690 580 712 602 730 625"
        fill="none"
        stroke="#efb38c"
        strokeWidth="17"
        strokeLinecap="round"
      />

      {/* laptop */}
      <path
        d="
          M500 575
          H700
          L730 650
          H470
          Z
        "
        fill="#07172f"
        stroke="#65d7ff"
        strokeWidth="2"
      />

      {/* laptop screen */}
      <path d="M520 590H680L700 635H500Z" fill="#081d42" />

      {/* laptop code */}
      <g className="character-code" fontFamily="monospace" fontSize="9">
        <text x="532" y="604" fill="#65d7ff">
          {"< build()"}
        </text>

        <text x="532" y="617" fill="#ff6b2c">
          {"const idea"}
        </text>

        <text x="532" y="630" fill="#9fb1d0">
          {"deploy();"}
        </text>
      </g>

      {/* laptop base */}
      <path
        d="M470 650H730L750 660H450Z"
        fill="#0b2d61"
        stroke="#65d7ff"
        strokeWidth="2"
      />

      <circle cx="600" cy="630" r="4" fill="#65d7ff" />
    </g>
  );
}

export default function CSEComputingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [activeNode, setActiveNode] = useState<string | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;

    if (!section || !svg) return;

    const splitInstances: SplitText[] = [];

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = section.querySelector<HTMLElement>("[data-cse-heading]");

      const eyebrow = section.querySelector<HTMLElement>("[data-cse-eyebrow]");

      const description = section.querySelector<HTMLElement>(
        "[data-cse-description]",
      );

      const listItems = Array.from(
        section.querySelectorAll<HTMLElement>("[data-cse-list-item]"),
      );

      const svgPaths = Array.from(
        svg.querySelectorAll<SVGPathElement>(".cse-connection"),
      );

      const svgNodes = Array.from(
        svg.querySelectorAll<SVGGElement>(".cse-tech-node"),
      );

      const rings = Array.from(
        svg.querySelectorAll<SVGCircleElement>(".cse-ring"),
      );

      const particles = Array.from(
        svg.querySelectorAll<SVGCircleElement>(".cse-particle"),
      );

      const character = svg.querySelector<SVGGElement>(".cse-character");

      /*
       * ---------------------------------------------
       * INITIAL STATE
       * ---------------------------------------------
       */

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        splitInstances.push(split);

        gsap.set(split.lines, {
          yPercent: 110,
        });
      }

      gsap.set([eyebrow, description, ...listItems].filter(Boolean), {
        opacity: 0,
        y: 20,
      });

      svgPaths.forEach((path) => {
        const length = path.getTotalLength();

        gsap.set(path, {
          opacity: 0,
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      gsap.set(svgNodes, {
        opacity: 0,
        scale: 0.65,
        transformOrigin: "center center",
      });

      gsap.set(rings, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "center center",
      });

      gsap.set(character, {
        opacity: 0,
        y: 35,
      });

      gsap.set(particles, {
        opacity: 0,
      });

      /*
       * ---------------------------------------------
       * REDUCED MOTION
       * ---------------------------------------------
       */

      if (reducedMotion) {
        if (heading) {
          const split = splitInstances[0];

          if (split) {
            gsap.set(split.lines, {
              yPercent: 0,
            });
          }
        }

        gsap.set([eyebrow, description, ...listItems].filter(Boolean), {
          opacity: 1,
          y: 0,
        });

        gsap.set(svgPaths, {
          opacity: 0.4,
          strokeDashoffset: 0,
        });

        gsap.set(svgNodes, {
          opacity: 1,
          scale: 1,
        });

        gsap.set(rings, {
          opacity: 1,
          scale: 1,
        });

        gsap.set(character, {
          opacity: 1,
          y: 0,
        });

        gsap.set(particles, {
          opacity: 0.7,
        });

        return;
      }

      /*
       * ---------------------------------------------
       * ENTRANCE TIMELINE
       * ---------------------------------------------
       */

      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      entrance.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      if (heading) {
        const split = splitInstances[0];

        if (split) {
          entrance.to(
            split.lines,
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power4.out",
            },
            "-=0.25",
          );
        }
      }

      entrance.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.4",
      );

      entrance.to(
        listItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.35",
      );

      entrance.to(
        rings,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.2",
      );

      entrance.to(
        svgPaths,
        {
          opacity: 0.35,
          strokeDashoffset: 0,
          duration: 1.25,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.6",
      );

      entrance.to(
        svgNodes,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.7",
      );

      entrance.to(
        character,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.4",
      );

      entrance.to(
        particles,
        {
          opacity: 0.8,
          duration: 0.5,
        },
        "-=0.5",
      );

      /*
       * ---------------------------------------------
       * CORE / RING MOTION
       * ---------------------------------------------
       */

      const core = svg.querySelector<SVGGElement>(".cse-core");

      if (core) {
        gsap.to(core, {
          scale: 1.025,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "600px 375px",
        });
      }

      gsap.to(svg.querySelectorAll(".cse-orbit"), {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
        transformOrigin: "600px 375px",
      });

      /*
       * ---------------------------------------------
       * CHARACTER MICRO MOTION
       * ---------------------------------------------
       */

      if (character) {
        gsap.to(character, {
          y: -4,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /*
       * ---------------------------------------------
       * PARTICLE MOTION
       * ---------------------------------------------
       */

      svgPaths.forEach((path, index) => {
        const particle = particles[index];

        if (!particle) return;

        const length = path.getTotalLength();

        const progress = {
          value: index % 2 === 0 ? 0 : 1,
        };

        gsap.to(progress, {
          value: index % 2 === 0 ? 1 : 0,
          duration: 3 + index * 0.45,
          delay: index * 0.35,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            const point = path.getPointAtLength(progress.value * length);

            gsap.set(particle, {
              attr: {
                cx: point.x,
                cy: point.y,
              },
            });
          },
        });
      });

      /*
       * ---------------------------------------------
       * SMALL DATA PULSES
       * ---------------------------------------------
       */

      const pulseDots = Array.from(
        svg.querySelectorAll<SVGCircleElement>(".cse-pulse-dot"),
      );

      pulseDots.forEach((dot, index) => {
        gsap.to(dot, {
          opacity: 0.15,
          scale: 0.65,
          duration: 1.2 + index * 0.1,
          repeat: -1,
          yoyo: true,
          delay: index * 0.15,
          ease: "sine.inOut",
          transformOrigin: "center center",
        });
      });
    }, section);

    return () => {
      splitInstances.forEach((split) => split.revert());
      context.revert();
    };
  }, []);

  /*
   * ---------------------------------------------
   * NODE HOVER
   * ---------------------------------------------
   */

  const activateNode = (id: string) => {
    setActiveNode(id);

    const svg = svgRef.current;

    if (!svg) return;

    const allNodes = Array.from(
      svg.querySelectorAll<SVGGElement>(".cse-tech-node"),
    );

    const allPaths = Array.from(
      svg.querySelectorAll<SVGPathElement>(".cse-connection"),
    );

    gsap.to(allNodes, {
      opacity: 0.28,
      scale: 0.9,
      duration: 0.35,
      ease: "power2.out",
    });

    gsap.to(allPaths, {
      opacity: 0.08,
      strokeWidth: 1,
      duration: 0.35,
      ease: "power2.out",
    });

    const selectedNode = svg.querySelector<SVGGElement>(
      `.cse-tech-node[data-node="${id}"]`,
    );

    const selectedPath = svg.querySelector<SVGPathElement>(
      `.cse-connection[data-node="${id}"]`,
    );

    if (selectedNode) {
      gsap.to(selectedNode, {
        opacity: 1,
        scale: 1.1,
        duration: 0.45,
        ease: "back.out(1.5)",
      });
    }

    if (selectedPath) {
      gsap.to(selectedPath, {
        opacity: 1,
        strokeWidth: 3,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  };

  const deactivateNode = () => {
    setActiveNode(null);

    const svg = svgRef.current;

    if (!svg) return;

    const nodes = Array.from(
      svg.querySelectorAll<SVGGElement>(".cse-tech-node"),
    );

    const paths = Array.from(
      svg.querySelectorAll<SVGPathElement>(".cse-connection"),
    );

    gsap.to(nodes, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "power2.out",
    });

    gsap.to(paths, {
      opacity: 0.35,
      strokeWidth: 1,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="
        relative overflow-hidden
        bg-[#061B45]
        py-20
        text-white
        sm:py-24
        lg:py-32
      "
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
          {/* =========================================
              LEFT CONTENT
          ========================================= */}

          <div className="relative z-10 max-w-xl">
            <div data-cse-eyebrow className="mb-6 flex items-center gap-3">
              <span className="h-[5px] w-[5px] rounded-full bg-[#FF6B2C]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9FB1D0]">
                Department of
              </span>
            </div>

            <h2
              data-cse-heading
              className="
                overflow-hidden
                text-[42px]
                font-extrabold
                uppercase
                leading-[0.91]
                tracking-[-0.055em]
                sm:text-[54px]
                lg:text-[66px]
              "
            >
              Computer
              <br />
              Science &
              <br />
              Engineering
            </h2>

            <div className="mt-8 h-[2px] w-20 bg-[#FF6B2C]" />

            <p
              data-cse-description
              className="
                mt-8
                max-w-md
                text-sm
                leading-7
                text-[#9FB1D0]
                sm:text-base
              "
            >
              Think in logic. Build with code. Turn ideas into systems that
              matter.
            </p>

            <div className="mt-10 space-y-4">
              {[
                ["01", "THINK"],
                ["02", "BUILD"],
                ["03", "SOLVE"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  data-cse-list-item
                  className="flex items-center gap-6"
                >
                  <span className="w-6 text-[10px] font-bold tracking-[0.2em] text-[#65D7FF]">
                    {number}
                  </span>

                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white">
                    {label}
                  </span>

                  <span className="h-px w-10 bg-white/10" />
                </div>
              ))}
            </div>
          </div>

          {/* =========================================
              SVG SYSTEM
          ========================================= */}

          <div className="relative min-w-0">
            <svg
              ref={svgRef}
              viewBox="0 0 1200 700"
              className="
                h-auto
                w-full
                overflow-visible
              "
              role="img"
              aria-label="Computer Science technology ecosystem"
            >
              <defs>
                <radialGradient
                  id="cse-core-gradient"
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop offset="0%" stopColor="#123d7c" />

                  <stop offset="65%" stopColor="#082555" />

                  <stop offset="100%" stopColor="#061B45" />
                </radialGradient>

                <filter
                  id="cse-glow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur stdDeviation="5" result="blur" />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <pattern
                  id="cse-grid"
                  width="45"
                  height="45"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M45 0H0V45"
                    fill="none"
                    stroke="#8DA1C2"
                    strokeOpacity=".07"
                  />
                </pattern>
              </defs>

              {/* =======================================
                  BACKGROUND
              ======================================= */}

              <rect
                width="1200"
                height="700"
                fill="url(#cse-grid)"
                opacity=".6"
              />

              {/* dotted details */}
              <g fill="#65D7FF" opacity=".22">
                <circle cx="100" cy="90" r="2" />
                <circle cx="125" cy="90" r="2" />
                <circle cx="150" cy="90" r="2" />
                <circle cx="100" cy="115" r="2" />
                <circle cx="125" cy="115" r="2" />
                <circle cx="150" cy="115" r="2" />

                <circle cx="1090" cy="110" r="2" />
                <circle cx="1115" cy="110" r="2" />
                <circle cx="1140" cy="110" r="2" />
                <circle cx="1090" cy="135" r="2" />
                <circle cx="1115" cy="135" r="2" />
                <circle cx="1140" cy="135" r="2" />
              </g>

              {/* =======================================
                  ORBITS
              ======================================= */}

              <g className="cse-orbit">
                <ellipse
                  className="cse-ring"
                  cx="600"
                  cy="375"
                  rx="345"
                  ry="255"
                  fill="none"
                  stroke="#65D7FF"
                  strokeOpacity=".16"
                  strokeWidth="1"
                />

                <ellipse
                  className="cse-ring"
                  cx="600"
                  cy="375"
                  rx="290"
                  ry="205"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity=".09"
                  strokeWidth="1"
                  strokeDasharray="5 12"
                />
              </g>

              {/* =======================================
                  CONNECTIONS
              ======================================= */}

              <g fill="none" strokeLinecap="round">
                {paths.map((path) => (
                  <path
                    key={path.id}
                    d={path.d}
                    data-node={path.department}
                    className="cse-connection"
                    stroke={
                      path.department === "ai" || path.department === "networks"
                        ? "#FF6B2C"
                        : "#65D7FF"
                    }
                    strokeWidth="1"
                    strokeDasharray="8 12"
                    opacity=".35"
                  />
                ))}
              </g>

              {/* =======================================
                  PARTICLES
              ======================================= */}

              <g>
                {paths.map((path, index) => (
                  <circle
                    key={`particle-${path.id}`}
                    className="cse-particle"
                    cx="600"
                    cy="375"
                    r={index % 2 === 0 ? 4 : 3}
                    fill={index % 2 === 0 ? "#65D7FF" : "#FF6B2C"}
                    filter="url(#cse-glow)"
                  />
                ))}
              </g>

              {/* =======================================
                  PULSE DOTS
              ======================================= */}

              <g fill="#65D7FF">
                <circle className="cse-pulse-dot" cx="725" cy="290" r="3" />

                <circle className="cse-pulse-dot" cx="760" cy="500" r="3" />

                <circle className="cse-pulse-dot" cx="430" cy="430" r="3" />

                <circle className="cse-pulse-dot" cx="880" cy="350" r="3" />
              </g>

              {/* =======================================
                  TECHNOLOGY NODES
              ======================================= */}

              {departmentNodes.map((node) => (
                <g
                  key={node.id}
                  data-node={node.id}
                  className="cse-tech-node"
                  transform={`translate(${node.x} ${node.y})`}
                >
                  <circle
                    r="62"
                    fill="#082555"
                    stroke={
                      node.id === "ai" || node.id === "networks"
                        ? "#FF6B2C"
                        : "#65D7FF"
                    }
                    strokeWidth="2"
                  />

                  <circle
                    r="49"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeOpacity=".08"
                  />

                  <g
                    transform="translate(0 -2)"
                    fill="none"
                    color={
                      node.id === "ai" || node.id === "networks"
                        ? "#FF6B2C"
                        : "#65D7FF"
                    }
                  >
                    <TechnologyIcon id={node.id} />
                  </g>

                  <circle
                    cx="0"
                    cy="-62"
                    r="4"
                    fill={
                      node.id === "ai" || node.id === "networks"
                        ? "#FF6B2C"
                        : "#65D7FF"
                    }
                    filter="url(#cse-glow)"
                  />
                </g>
              ))}

              {/* =======================================
                  CENTRAL CORE
              ======================================= */}

              <g className="cse-core">
                <circle
                  cx="600"
                  cy="375"
                  r="135"
                  fill="none"
                  stroke="#65D7FF"
                  strokeOpacity=".08"
                  strokeWidth="1"
                />

                <circle
                  cx="600"
                  cy="375"
                  r="115"
                  fill="url(#cse-core-gradient)"
                  stroke="#65D7FF"
                  strokeWidth="2"
                />

                <circle
                  cx="600"
                  cy="375"
                  r="94"
                  fill="none"
                  stroke="#65D7FF"
                  strokeOpacity=".2"
                  strokeWidth="1"
                />

                <circle
                  cx="600"
                  cy="375"
                  r="78"
                  fill="none"
                  stroke="#FF6B2C"
                  strokeOpacity=".16"
                  strokeWidth="1"
                  strokeDasharray="4 10"
                />

                <text
                  x="600"
                  y="370"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="50"
                  fontWeight="800"
                  letterSpacing="-2"
                >
                  CSE
                </text>

                <text
                  x="600"
                  y="397"
                  textAnchor="middle"
                  fill="#65D7FF"
                  fontSize="9"
                  fontWeight="700"
                  letterSpacing="4"
                >
                  CODE · CREATE
                </text>

                <text
                  x="600"
                  y="416"
                  textAnchor="middle"
                  fill="#9FB1D0"
                  fontSize="9"
                  fontWeight="700"
                  letterSpacing="4"
                >
                  CONNECT · SOLVE
                </text>
              </g>

              {/* =======================================
                  CHARACTER
              ======================================= */}

              <Character />

              {/* =======================================
                  FLOATING CODE
              ======================================= */}

              <g fontFamily="monospace" fontSize="13">
                <text x="930" y="100" fill="#65D7FF" opacity=".7">
                  {"<code />"}
                </text>

                <text x="960" y="122" fill="#9FB1D0" opacity=".5">
                  {"0101 1010"}
                </text>

                <text x="245" y="470" fill="#FF6B2C" opacity=".7">
                  {"function()"}
                </text>

                <text x="270" y="492" fill="#9FB1D0" opacity=".5">
                  {"solve(problem)"}
                </text>
              </g>

              {/* =======================================
                  BOTTOM SYSTEM LINE
              ======================================= */}

              <line
                x1="170"
                y1="675"
                x2="1030"
                y2="675"
                stroke="#8DA1C2"
                strokeOpacity=".22"
              />

              <text
                x="600"
                y="698"
                textAnchor="middle"
                fill="#9FB1D0"
                fontSize="9"
                fontWeight="700"
                letterSpacing="4"
              >
                COMPUTE × CREATE × CONNECT × SOLVE
              </text>
            </svg>

            {/* =========================================
                INTERACTION OVERLAY
            ========================================= */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-1/2
                w-full
                -translate-x-1/2
                text-center
              "
            >
              {activeNode ? (
                (() => {
                  const node = departmentNodes.find(
                    (item) => item.id === activeNode,
                  );

                  if (!node) return null;

                  return (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#65D7FF]">
                        {node.number} — {node.title}
                      </p>

                      <p className="mt-1 text-xs text-[#9FB1D0]">
                        {node.description}
                      </p>
                    </div>
                  );
                })()
              ) : (
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9FB1D0]/50">
                  Explore the CSE ecosystem
                </p>
              )}
            </div>

            {/* =========================================
                ACCESSIBLE INTERACTION BUTTONS
            ========================================= */}

            <div className="absolute inset-0">
              {departmentNodes.map((node) => (
                <Link
                  key={`interactive-${node.id}`}
                  href={node.href}
                  aria-label={`Explore ${node.title}`}
                  className="
                    absolute
                    h-[92px]
                    w-[92px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#65D7FF]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#061B45]
                  "
                  style={{
                    left: `${(node.x / 1200) * 100}%`,
                    top: `${(node.y / 700) * 100}%`,
                  }}
                  onMouseEnter={() => activateNode(node.id)}
                  onMouseLeave={deactivateNode}
                  onFocus={() => activateNode(node.id)}
                  onBlur={deactivateNode}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
