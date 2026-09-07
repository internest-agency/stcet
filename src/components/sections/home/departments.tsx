"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "../../ui/Container";
import Button from "../../ui/Button";
import { FaCircleArrowRight } from "react-icons/fa6";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import ComputerScienceImage from "@/public/images/computer-science-engineering.jpg";
import ElectronicsImage from "@/public/images/electronics-and-communication-engineering.jpg";
import ElectricalImage from "@/public/images/electrical-engineering.jpg";
import InformationTechnologyImage from "@/public/images/information-technology.jpg";
import ComputerScienceAIImage from "@/public/images/artificial-intelligence.jpg";

gsap.registerPlugin(SplitText, ScrollTrigger);

const departments = [
  {
    id: "01",
    name: "Computer Science and Engineering",
    image: ComputerScienceImage,
    description:
      "Build expertise in software development, computing systems, artificial intelligence, and emerging technologies.",
    href: "/courses/computer-science-engineering",
  },
  {
    id: "02",
    name: "Computer Science and Engineering (AI/ML)",
    image: ComputerScienceAIImage,
    description:
      "Explore artificial intelligence and machine learning through practical learning, innovation, and advanced computing.",
    href: "/courses/computer-science-ai-ml",
  },
  {
    id: "03",
    name: "Information Technology",
    image: InformationTechnologyImage,
    description:
      "Develop strong foundations in information systems, software technologies, networking, and digital transformation.",
    href: "/courses/information-technology",
  },
  {
    id: "04",
    name: "Electronics and Communication Engineering",
    image: ElectronicsImage,
    description:
      "Learn electronics, communication systems, embedded technologies, signal processing, and modern digital systems.",
    href: "/courses/electronics-communication-engineering",
  },
  {
    id: "05",
    name: "Electrical and Electronics Engineering",
    image: ElectricalImage,
    description:
      "Gain practical knowledge in electrical systems, power engineering, automation, control systems, and electronics.",
    href: "/courses/electrical-electronics-engineering",
  },
];

export default function DepartmentsSection() {
  const [activeDepartment, setActiveDepartment] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const department = departments[activeDepartment];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      /*
       * ==========================================
       * HEADING
       * ==========================================
       */

      const heading = sectionRef.current?.querySelector(
        ".departments-heading",
      ) as HTMLElement | null;

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,

          onEnter: () => {
            gsap.fromTo(
              split.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power4.out",
              },
            );
          },
        });
      }

      /*
       * ==========================================
       * INTRO TEXT
       * ==========================================
       */

      const intro = sectionRef.current?.querySelector(
        ".departments-intro",
      ) as HTMLElement | null;

      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          start: "top 90%",
          once: true,

          onEnter: () => {
            gsap.fromTo(
              intro,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );
          },
        });
      }

      /*
       * ==========================================
       * DEPARTMENT LIST
       * ==========================================
       *
       * IMPORTANT:
       * We do NOT animate opacity here.
       *
       * The titles remain visible even if
       * ScrollTrigger doesn't fire.
       */

      const departmentItems =
        gsap.utils.toArray<HTMLElement>(".department-item");

      ScrollTrigger.create({
        trigger: ".department-list",
        start: "top 90%",
        once: true,

        onEnter: () => {
          gsap.fromTo(
            departmentItems,
            {
              x: -20,
            },
            {
              x: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            },
          );
        },
      });

      /*
       * ==========================================
       * IMAGE CONTAINER
       * ==========================================
       */

      const imageWrapper = sectionRef.current?.querySelector(
        ".department-image-wrapper",
      ) as HTMLElement | null;

      if (imageWrapper) {
        ScrollTrigger.create({
          trigger: imageWrapper,
          start: "top 90%",
          once: true,

          onEnter: () => {
            gsap.fromTo(
              imageWrapper,
              {
                y: 30,
              },
              {
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              },
            );
          },
        });
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  /*
   * ==========================================
   * DEPARTMENT CHANGE
   * ==========================================
   */

  useLayoutEffect(() => {
    const image = imageRef.current;
    const content = contentRef.current;

    if (!image || !content) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set([image, content], {
        opacity: 1,
        y: 0,
        scale: 1,
      });

      return;
    }

    const timeline = gsap.timeline();

    /*
     * Image transition
     */
    timeline.fromTo(
      image,
      {
        opacity: 0.7,
        scale: 1.04,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      },
    );

    /*
     * Content transition
     */
    timeline.fromTo(
      content,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      "-=0.35",
    );

    return () => {
      timeline.kill();
    };
  }, [activeDepartment]);

  return (
    <section
      ref={sectionRef}
      className="py-20"
      aria-labelledby="departments-heading"
    >
      {/* ==========================================
          INTRO
      ========================================== */}

      <Container className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <h2
            id="departments-heading"
            className="departments-heading mb-4 lg:pr-6 text-2xl md:text-4xl lg:text-5xl font-bold uppercase text-gray-900"
          >
            Five Disciplines One{" "}
            <span className="text-primary-700">Foundation</span>
          </h2>
        </div>

        <div>
          <p className="departments-intro lg:text-left text-primary-800">
            STCET offers undergraduate programmes in{" "}
            <strong>
              Computer Science and Engineering, CSE with Artificial Intelligence
              & Machine Learning, Electronics and Communication Engineering,
              Electrical and Electronics Engineering, and Information
              Technology,
            </strong>{" "}
            designed to help students build strong fundamentals, explore
            emerging technologies and prepare for meaningful careers.
          </p>
        </div>
      </Container>

      {/* ==========================================
          DEPARTMENTS
      ========================================== */}

      <Container className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* ----------------------------------------
            Department List
        ---------------------------------------- */}

        <div className="department-list">
          {departments.map((item, index) => {
            const isActive = activeDepartment === index;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDepartment(index)}
                className={`
                  department-item
                  group
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  border-b
                  border-gray-200
                  px-6
                  py-5
                  text-left
                  text-lg
                  font-bold
                  uppercase
                  transition-all
                  duration-300
                  first:border-t

                  ${
                    isActive
                      ? "bg-primary-700 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }
                `}
                aria-pressed={isActive}
              >
                <span
                  className={`
                    mr-4
                    font-extrabold
                    transition-transform
                    duration-300
                    ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}
                  `}
                >
                  {item.id}
                </span>

                <span>{item.name}</span>
              </button>
            );
          })}

          <div className="hero-cta mt-4">
            <Button
              href="/admissions"
              variant="primary"
              size="md"
              rightIcon={<FaCircleArrowRight />}
            >
              Enquire Now
            </Button>
          </div>
        </div>

        {/* ----------------------------------------
            Department Image
        ---------------------------------------- */}

        <div className="department-image-wrapper relative h-[400px] overflow-hidden rounded-lg">
          <Image
            ref={imageRef}
            src={department.image}
            alt={department.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={activeDepartment === 0}
            className="h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

          {/* Content */}
          <div
            ref={contentRef}
            key={department.id}
            className="absolute inset-x-0 bottom-0 z-10 p-8 text-white"
          >
            <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
              Department
            </span>

            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              {department.name}
            </h3>

            <p className="mb-6 max-w-xl text-sm leading-6 text-white">
              {department.description}
            </p>

            <Button
              href="/admissions"
              variant="accent"
              size="md"
              rightIcon={<FaCircleArrowRight />}
            >
              Explore Department
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
