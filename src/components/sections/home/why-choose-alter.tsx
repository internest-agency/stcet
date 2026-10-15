"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";
import Button from "../../ui/Button";
import { FaCircleArrowRight } from "react-icons/fa6";
import SectionHeading from "../../ui/SectionHeading";

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
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stickyElement = stickyRef.current;
    const editorialContent = contentRef.current;

    if (!section || !stickyElement || !editorialContent) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const media = gsap.matchMedia();

      // Desktop: pin the left content below the fixed header.
      media.add("(min-width: 1024px)", () => {
        const pinTrigger = ScrollTrigger.create({
          trigger: stickyElement,
          pin: stickyElement,
          start: "top top+=130",
          endTrigger: editorialContent,
          end: "bottom-=400 bottom",
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        return () => {
          pinTrigger.kill();
          gsap.set(stickyElement, { clearProps: "all" });
        };
      });

      // Mobile and tablet: use normal document flow.
      media.add("(max-width: 1023px)", () => {
        gsap.set(stickyElement, {
          clearProps: "position,top,width",
        });
      });

      if (reducedMotion) return;

      // Animate heading lines without hiding the heading before animation.
      const heading = section.querySelector(
        "#why-choose-heading",
      ) as HTMLElement | null;

      if (heading) {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
        });

        gsap.from(split.lines, {
          yPercent: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            once: true,
          },
        });
      }

      const intro = section.querySelector(
        ".why-choose-intro",
      ) as HTMLElement | null;

      if (intro) {
        gsap.from(intro, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: intro,
            start: "top 90%",
            once: true,
          },
        });
      }

      const items = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".why-choose-item"),
      );

      items.forEach((item, index) => {
        gsap.from(item, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: Math.min(index * 0.025, 0.2),
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
          },
        });
      });
    }, section);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-clip py-16 sm:py-20 lg:py-24"
      aria-labelledby="why-choose-heading"
    >
      {/* Add horizontal padding independently of the shared Container styles. */}
      <Container className="px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Left introduction */}
          <div
            ref={stickyRef}
            className="sticky-element relative min-w-0 self-start lg:pr-2"
          >
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  Why STCET
                </span>
              </div>

              <SectionHeading id="why-choose-heading">
                Built for Students{" "}
                <span className="text-accent-400">Who Build the Future</span>
              </SectionHeading>

              <div className="why-choose-intro my-8 space-y-5">
                <p className="text-base leading-7 md:text-lg md:leading-8">
                  At{" "}
                  <strong>
                    S. Thangapazham College of Engineering and Technology
                    (STCET)
                  </strong>
                  , we believe engineering education is essentially about
                  building knowledge, confidence, skills and a vision for the
                  future.
                </p>

                <p className="text-base leading-7 md:text-lg md:leading-8">
                  As an{" "}
                  <strong>
                    AICTE-approved institution affiliated with Anna University
                  </strong>
                  , STCET offers an{" "}
                  <strong>
                    industry-oriented, student-centric learning environment
                  </strong>{" "}
                  supported by experienced and dedicated faculty, well-equipped
                  laboratories and exposure to emerging technologies such as{" "}
                  <strong>
                    Artificial Intelligence, Machine Learning, IoT, Embedded
                    Systems, Cloud Computing, Cybersecurity, Renewable Energy
                    and Automation.
                  </strong>
                </p>

                <p className="text-base leading-7 md:text-lg md:leading-8">
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
                  Know More
                </Button>
              </div>
            </div>
          </div>

          {/* Right editorial list */}
          <div
            ref={contentRef}
            className="editorial-content min-w-0 border-t border-gray-200"
          >
            {cards.map((card, index) => (
              <article
                key={card.title}
                className="why-choose-item group relative overflow-hidden border-b-2 border-gray-200 bg-white px-3 py-8 transition-colors duration-300 hover:border-accent-400 hover:bg-primary-700 sm:px-5 md:py-9"
              >
                <span
                  className="absolute left-0 top-0 h-0 w-1 bg-accent-400 transition-all duration-500 group-hover:h-full"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-6">
                  <span className="pt-1 text-sm font-bold tracking-[0.2em] text-gray-400 transition-colors duration-300 group-hover:text-accent-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <h3 className="text-lg font-extrabold uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-white sm:text-xl md:text-2xl">
                      {card.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 transition-colors duration-300 group-hover:text-white/85 sm:text-base sm:leading-7">
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
