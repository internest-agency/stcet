"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "../../ui/Container";
import Button from "../../ui/Button";
import SectionHeading from "../../ui/SectionHeading";
import { FaCircleArrowRight } from "react-icons/fa6";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export interface DepartmentItem {
  id: string;
  name: string;
  image: string;
  description: string;
  href: string;
}

interface DepartmentsSectionProps {
  departmentList: DepartmentItem[];
}

export default function DepartmentsSection({
  departmentList,
}: DepartmentsSectionProps) {
  const [activeDepartment, setActiveDepartment] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset the selected index if the supplied data changes.
  useLayoutEffect(() => {
    setActiveDepartment((current) =>
      departmentList.length === 0
        ? 0
        : Math.min(current, departmentList.length - 1),
    );
  }, [departmentList.length]);

  const department = departmentList[activeDepartment];

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || departmentList.length === 0) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      // Heading animation
      const heading = section.querySelector(
        ".departments-heading",
      ) as HTMLElement | null;

      let split: SplitText | null = null;

      if (heading) {
        split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => {
            if (!split) return;

            gsap.fromTo(
              split.lines,
              { yPercent: 100 },
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

      // Intro text animation
      const intro = section.querySelector(
        ".departments-intro",
      ) as HTMLElement | null;

      if (intro) {
        gsap.fromTo(
          intro,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: intro,
              start: "top 90%",
              once: true,
            },
          },
        );
      }

      // Department list animation
      const departmentItems =
        section.querySelectorAll<HTMLElement>(".department-item");

      if (departmentItems.length > 0) {
        gsap.fromTo(
          departmentItems,
          { x: -20 },
          {
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section.querySelector(".department-list"),
              start: "top 90%",
              once: true,
            },
          },
        );
      }

      // Department image wrapper animation
      const imageWrapper = section.querySelector(
        ".department-image-wrapper",
      ) as HTMLElement | null;

      if (imageWrapper) {
        gsap.fromTo(
          imageWrapper,
          { y: 30 },
          {
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageWrapper,
              start: "top 90%",
              once: true,
            },
          },
        );
      }

      return () => {
        split?.revert();
      };
    }, section);

    return () => context.revert();
  }, [departmentList.length]);

  // Animate the image and content when the selected department changes.
  useLayoutEffect(() => {
    const image = imageRef.current;
    const content = contentRef.current;

    if (!image || !content || !department) return;

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

    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline.fromTo(
        image,
        { opacity: 0.7, scale: 1.04 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
        },
      );

      timeline.fromTo(
        content,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.35",
      );
    }, sectionRef);

    return () => context.revert();
  }, [activeDepartment, department]);

  // No fallback or hardcoded department data.
  if (departmentList.length === 0 || !department) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20"
      aria-labelledby="departments-heading"
    >
      {/* Introduction */}
      <Container className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <SectionHeading
            id="departments-heading"
            className="departments-heading"
          >
            Five Disciplines
            <br />
            <span className="text-accent-400">One Foundation</span>
          </SectionHeading>
        </div>

        <div>
          <p className="departments-intro text-primary-800 lg:text-left">
            STCET offers undergraduate programmes designed to help students
            build strong fundamentals, explore emerging technologies, and
            prepare for meaningful careers.
          </p>
        </div>
      </Container>

      {/* Departments */}
      <Container className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="department-list">
          {departmentList.map((item, index) => {
            const isActive = activeDepartment === index;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDepartment(index)}
                className={`
                  department-item group flex w-full cursor-pointer
                  items-center border-b border-gray-200 px-6 py-4
                  text-left text-lg font-bold uppercase
                  transition-all duration-300 rounded first:border-t
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
                    mr-4 font-extrabold transition-transform duration-300
                    ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}
                  `}
                >
                  {item.id}
                </span>

                <span>{item.name}</span>
              </button>
            );
          })}

          <div className="hero-cta mt-8">
            <Button
              href="/enquire-now#application"
              variant="primary"
              size="md"
              rightIcon={<FaCircleArrowRight />}
            >
              Enquire Now
            </Button>
          </div>
        </div>

        {/* Active department */}
        <div className="department-image-wrapper relative h-100 overflow-hidden rounded-lg xl:h-130">
          <Image
            key={`${department.id}-${department.image}`}
            ref={imageRef}
            src={department.image}
            alt={department.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={activeDepartment === 0}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

          <div
            key={department.id}
            ref={contentRef}
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
              href={department.href || "/"}
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
