"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const trainingAreas = [
  {
    number: "01",
    title: "Aptitude & Logical Reasoning",
    description:
      "Building quantitative, analytical and problem-solving abilities.",
    image: "/images/placements/icons/critical-thinking.png",
  },
  {
    number: "02",
    title: "Communication Skills",
    description:
      "Developing spoken English, presentation and professional communication.",
    image: "/images/placements/icons/communication.png",
  },
  {
    number: "03",
    title: "Technical Skill Development",
    description:
      "Strengthening core technical knowledge relevant to students' chosen disciplines.",
    image: "/images/placements/icons/skills.png",
  },
  {
    number: "04",
    title: "Programming & Coding",
    description:
      "Developing coding ability and computational problem-solving skills.",
    image: "/images/placements/icons/web-programming.png",
  },
  {
    number: "05",
    title: "Resume & Profile Building",
    description:
      "Helping students present their skills, projects and achievements effectively.",
    image: "/images/placements/icons/curriculum-vitae.png",
  },
  {
    number: "06",
    title: "Group Discussions & Interviews",
    description:
      "Preparing students for different stages of recruitment processes.",
    image: "/images/placements/icons/interview.png",
  },
  {
    number: "07",
    title: "Soft Skills & Professional Skills",
    description:
      "Developing teamwork, leadership, workplace etiquette and professional confidence.",
    image: "/images/placements/icons/problem-solving-skills.png",
  },
  {
    number: "08",
    title: "Career Awareness",
    description:
      "Helping students understand career options, industry expectations and opportunities for higher studies.",
    image: "/images/placements/icons/success.png",
  },
];

export default function CareerReadiness() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const horizontalSection = horizontalSectionRef.current;
    const track = trackRef.current;

    if (!section || !horizontalSection || !track) return;

    const context = gsap.context(() => {
      const eyebrow = section.querySelector(
        ".career-eyebrow",
      ) as HTMLElement | null;

      const heading = section.querySelector(
        ".career-heading",
      ) as HTMLElement | null;

      const intro = section.querySelector(
        ".career-intro",
      ) as HTMLElement | null;

      const slides = Array.from(
        section.querySelectorAll<HTMLElement>(".career-slide"),
      );

      if (!eyebrow || !heading || !intro || !slides.length) return;

      /* ============================================
         INTRO ANIMATION
      ============================================ */

      gsap.set([eyebrow, heading, intro], {
        opacity: 0,
        y: 30,
      });

      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      introTimeline
        .to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.3",
        )
        .to(
          intro,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45",
        );

      /* ============================================
         HORIZONTAL DISTANCE
      ============================================ */

      const getDistance = () => {
        const distance = track.scrollWidth - horizontalSection.clientWidth;

        return Math.max(0, distance);
      };

      /* ============================================
         HORIZONTAL SCROLL + PIN
      ============================================ */

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",

        scrollTrigger: {
          trigger: section,

          // Pin exactly when the carousel reaches
          // the top of the viewport.
          start: "top top",

          // Vertical scroll distance equals
          // horizontal movement distance.
          end: () => `+=${getDistance()}`,

          pin: true,
          scrub: 1,

          anticipatePin: 1,
          invalidateOnRefresh: true,

          // Prevent the pinned section from jumping
          // when ScrollTrigger refreshes.
          pinSpacing: true,
        },
      });

      /* ============================================
         SLIDE CONTENT ANIMATION
      ============================================ */

      slides.forEach((slide, index) => {
        const content = slide.querySelector(
          ".career-slide-content",
        ) as HTMLElement | null;

        if (!content) return;

        gsap.set(content, {
          opacity: index === 0 ? 1 : 0.35,
          y: index === 0 ? 0 : 20,
        });

        ScrollTrigger.create({
          trigger: slide,
          containerAnimation: horizontalTween,

          start: "left 70%",
          end: "right 30%",

          onEnter: () => {
            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true,
            });
          },

          onEnterBack: () => {
            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true,
            });
          },

          onLeave: () => {
            gsap.to(content, {
              opacity: 0.35,
              y: 20,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
          },

          onLeaveBack: () => {
            gsap.to(content, {
              opacity: 0.35,
              y: 20,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
          },
        });
      });

      /* ============================================
         REFRESH AFTER IMAGES / LAYOUT
      ============================================ */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-primary-800 py-14 sm:py-16 lg:py-20"
    >
      {/* ============================================
          SECTION INTRO
      ============================================ */}

      <Container>
        <div className="mb-12">
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            {/* Label */}

            <div>
              <div className="career-eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Career Readiness
                </span>
              </div>
            </div>

            {/* Heading */}

            <div>
              <SectionHeading as="h2" className="career-heading text-white">
                Building Career{" "}
                <span className="text-accent-400">Readiness</span>
              </SectionHeading>

              <p className="career-intro mt-7 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                Placement preparation begins well before the final year.
                Students are encouraged to progressively develop the technical,
                analytical and interpersonal skills expected in today's
                workplace.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* ============================================
          HORIZONTAL TRAINING CAROUSEL
      ============================================ */}
      <Container>
        <div ref={horizontalSectionRef} className="relative overflow-hidden">
          <div ref={trackRef} className="flex gap-2 h-full w-max">
            {trainingAreas.map((item) => (
              <article
                key={item.number}
                className="career-slide flex items-center h-auto max-w-lg border-r border-gray-200 py-3 sm:py-5 lg:py-8 px-7 sm:px-10 lg:px-16 bg-gray-50"
              >
                <div className="career-slide-content max-w-2xl">
                  {/* Icon */}

                  <div className="mb-6">
                    <Image
                      src={item.image}
                      width={56}
                      height={56}
                      alt=""
                      className="h-14 w-14 object-contain"
                    />
                  </div>

                  {/* Heading */}

                  <SectionHeading as="h3" className="career-slide-heading">
                    {item.title}
                  </SectionHeading>

                  {/* Description */}

                  <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

            {/* End spacing */}

            <div aria-hidden="true" className="w-[10vw] shrink-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
