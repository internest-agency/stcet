"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import Button from "../../ui/Button";
import { FaCircleArrowRight } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger, SplitText);

const cards = [
  {
    title: "Accreditation",
    description: "AICTE Approved & Anna University Affiliated",
  },
  {
    title: "Curriculum",
    description: "Industry-Oriented & Future-Ready Curriculum",
  },
  {
    title: "Faculty",
    description: "Experienced and Dedicated Faculty",
  },
  {
    title: "Learning",
    description: "Student-Centric Learning Environment",
  },
  {
    title: "Laboratories",
    description: "Modern Laboratories & Practical Learning",
  },
  {
    title: "Placements",
    description: "Placement Training from eraly on",
  },
  {
    title: "Career Readiness",
    description: "Personality Development & Career Readiness Programmes",
  },
  {
    title: "Entrepreneurship",
    description: "Innovation & Entrepreneurship Support",
  },
  {
    title: "Technology",
    description: "Exposure to Emerging Technologies",
  },
  {
    title: "Holistic Development",
    description: "Value-Based Education & Holistic Developement",
  },
  {
    title: "Opportunities",
    description: "Opportunities for Projects, Clubs, Competitors & Leadership",
  },
  {
    title: "Campus Facilities",
    description:
      "Supportive Campus Facilities for a Complete College Experience",
  },
  {
    title: "Our Approach",
    description:
      "At STCET we prepare the students to discover their potentials, embrace opportunities and build a successful future.",
  },
];

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      /* --------------------------------
       * Section Heading
       * -------------------------------- */
      const heading = document.querySelector(
        "#why-choose-heading",
      ) as HTMLElement | null;

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
        });

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
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      /* --------------------------------
       * Intro Text
       * -------------------------------- */
      const intro = document.querySelector(
        ".why-choose-intro",
      ) as HTMLElement | null;

      if (intro) {
        gsap.fromTo(
          intro,
          {
            y: 25,
          },
          {
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

      /* --------------------------------
       * Editorial List
       * -------------------------------- */
      const items = gsap.utils.toArray<HTMLElement>(".why-choose-item");

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            x: -25,
          },
          {
            x: 0,
            duration: 0.7,
            delay: index * 0.035,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      /* --------------------------------
       * Our Approach
       * -------------------------------- */
      const approach = document.querySelector(
        ".our-approach",
      ) as HTMLElement | null;

      if (approach) {
        gsap.fromTo(
          approach,
          {
            y: 35,
          },
          {
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: approach,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24 lg:py-28"
      aria-labelledby="why-choose-heading"
    >
      <Container>
        {/* --------------------------------
         * Main Editorial Layout
         * -------------------------------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20">
          {/* --------------------------------
           * Sticky Introduction
           * -------------------------------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="max-w-xl">
              {/* Eyebrow */}
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-primary-700" />

                <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary-700">
                  Why STCET
                </span>
              </div>

              {/* Heading */}
              <h2
                id="why-choose-heading"
                className="overflow-hidden text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
              >
                Built for Students <br />
                Who Build the Future
              </h2>

              {/* Intro */}
              <div className="why-choose-intro my-8 max-w-lg">
                <p className="text-base leading-7 text-gray-600 md:text-lg md:leading-8 mb-4">
                  At{" "}
                  <b>
                    S. Thangapazham College of Engineering and Technology
                    (STCET)
                  </b>
                  , we believe engineering education is essentially about
                  building knowledge, confidence, skills and a vision for the
                  future.
                </p>
                <p className="text-base leading-7 text-gray-600 md:text-lg md:leading-8 mb-4">
                  As an{" "}
                  <b>
                    AICTE-approved institution affiliated with Anna University
                  </b>
                  , STCET offers an{" "}
                  <b>industry-oriented, student-centric learning environment</b>
                  supported by experienced and dedicated faculty, well-equipped
                  laboratories and exposure to emerging technologies such as
                  <b>
                    Artificial Intelligence, Machine Learning, IoT, Embedded
                    Systems, Cloud Computing, Cybersecurity, Renewable Energy
                    and Automation.
                  </b>
                </p>

                <p className="text-base leading-7 text-gray-600 md:text-lg md:leading-8">
                  Students benefit from placement training activities,
                  personality development programmes, innovation and
                  entrepreneurship support, technical activities, projects and
                  opportunities to participate, compete and lead. With essential
                  campus amenities, transportation and canteen facilities, STCET
                  strives to create a supportive and engaging student
                  experience.
                </p>
              </div>
              <div className="hero-cta">
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
          </div>

          {/* --------------------------------
           * Editorial Benefits List
           * -------------------------------- */}
          <div className="border-t border-gray-200">
            {cards.map((card, index) => (
              <article
                key={card.title}
                className="why-choose-item group relative overflow-hidden border-b-2 border-gray-200 bg-white px-5 py-8 transition-all duration-400 ease-out hover:border-accent-400 hover:bg-primary-700 md:px-7 md:py-9"
              >
                {/* Hover Accent Line */}
                <span
                  className="absolute left-0 top-0 h-0 w-1 bg-accent-400 transition-all duration-500 ease-out group-hover:h-full"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-5 md:grid-cols-[72px_minmax(0,1fr)] md:gap-7">
                  {/* Number */}
                  <div>
                    <span className="text-sm font-bold tracking-[0.2em] text-gray-400 transition-colors duration-300 group-hover:text-accent-400 md:text-base">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="transition-transform duration-400 ease-out group-hover:translate-x-2">
                    <h3 className="text-xl font-extrabold uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-white md:text-2xl">
                      {card.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 transition-colors duration-300 group-hover:text-white/85 md:text-base md:leading-7">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
