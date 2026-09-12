"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../../ui/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

const careerGroups = [
  {
    number: "01",
    title: "Software Development",
    roles: ["Software Developer", "Application Developer"],
    image: "/images/courses/it/software-development.webp",
  },
  {
    number: "02",
    title: "Web Technologies",
    roles: ["Web Developer", "Application Developer"],
    image: "/images/courses/it/web-technologies.webp",
  },
  {
    number: "03",
    title: "Cloud & Systems",
    roles: ["Cloud Engineer", "Systems Analyst"],
    image: "/images/courses/it/cloud-and-systems.webp",
  },
  {
    number: "04",
    title: "Data & Databases",
    roles: ["Data Analyst", "Database Administrator"],
    image: "/images/courses/it/data-and-databases.webp",
  },
  {
    number: "05",
    title: "Networks & Cybersecurity",
    roles: ["Network Engineer", "Cybersecurity Analyst"],
    image: "/images/courses/it/networks-cybersecurity.webp",
  },
  {
    number: "06",
    title: "IT Services & DevOps",
    roles: ["IT Consultant", "DevOps Professional"],
    image: "/images/courses/it/it-services-devops.webp",
  },
];

const futurePaths = [
  {
    number: "01",
    title: "Higher Studies",
    description:
      "Pursue higher studies to deepen knowledge and specialise in computing, information systems, data, cloud and cybersecurity.",
  },
  {
    number: "02",
    title: "Specialised Certifications",
    description:
      "Build specialised expertise through professional certifications across computing, information systems, data, cloud and cybersecurity.",
  },
  {
    number: "03",
    title: "Continuous Technology Learning",
    description:
      "Continue developing skills as technologies and digital business environments evolve.",
  },
];

function CareerCard({
  group,
  isDecorative = false,
}: {
  group: (typeof careerGroups)[number];
  isDecorative?: boolean;
}) {
  return (
    <article
      tabIndex={isDecorative ? -1 : undefined}
      aria-hidden={isDecorative ? true : undefined}
      className="
        career-marquee-card
        group
        relative
        aspect-[4/3]
        w-[300px]
        shrink-0
        overflow-hidden
        bg-gray-950
        transition-transform
        duration-500
        ease-out
        hover:-translate-y-1
        hover:shadow-2xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent-400
        focus-visible:ring-offset-2
        sm:w-[360px]
        lg:w-[500px]
        xl:w-[540px]
      "
    >
      <Image
        src={group.image}
        alt={isDecorative ? "" : group.title}
        fill
        sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 500px"
        className="
          object-cover
          transition-transform
          duration-1000
          ease-out
          group-hover:scale-[1.06]
        "
      />

      {/* Image readability gradient */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/5
          via-black/10
          to-black/90
        "
      />

      {/* Subtle bottom gradient */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          bottom-0
          h-1/2
          bg-linear-to-t
          from-black/80
          to-transparent
        "
      />

      {/* Card content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 lg:p-7">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="
              font-mono
              text-[10px]
              font-bold
              tracking-[0.16em]
              text-accent-400
            "
          >
            {group.number}
          </span>

          <span className="h-px w-7 bg-white/30" />

          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/55
            "
          >
            Career Pathway
          </span>
        </div>

        <h3
          className="
            max-w-[430px]
            text-[24px]
            font-extrabold
            uppercase
            leading-[0.98]
            tracking-[-0.04em]
            text-white
            transition-transform
            duration-500
            ease-out
            group-hover:translate-x-1
            sm:text-[28px]
            lg:text-[34px]
          "
        >
          {group.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {group.roles.map((role) => (
            <span
              key={role}
              className="
                text-[11px]
                font-medium
                leading-5
                text-white/65
                sm:text-xs
              "
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Hover accent */}
      <span
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-0
          z-20
          h-1
          w-0
          bg-accent-400
          transition-all
          duration-500
          ease-out
          group-hover:w-full
        "
      />
    </article>
  );
}

export default function ITCareers() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const marquee = marqueeRef.current;

    if (!section || !marquee) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * ============================================================
       * REDUCED MOTION
       * ============================================================
       */

      if (reducedMotion) {
        gsap.set(
          section.querySelectorAll(
            "[data-career-label], [data-career-heading], [data-career-intro], [data-career-marquee], [data-beyond-label], [data-beyond-heading], [data-beyond-intro], [data-future-path]",
          ),
          {
            clearProps: "all",
          },
        );

        return;
      }

      /*
       * ============================================================
       * CAREER PATHWAYS LABEL
       * ============================================================
       */

      const careerLabel = section.querySelector<HTMLElement>(
        "[data-career-label]",
      );

      if (careerLabel) {
        const dot = careerLabel.querySelector<HTMLElement>("[data-career-dot]");

        const text = careerLabel.querySelector<HTMLElement>(
          "[data-career-label-text]",
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: careerLabel,
            start: "top 90%",
            once: true,
          },
        });

        if (dot) {
          timeline.fromTo(
            dot,
            {
              scale: 0,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: "back.out(2.5)",
            },
          );
        }

        if (text) {
          timeline.fromTo(
            text,
            {
              opacity: 0,
              x: -15,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.55,
              ease: "power3.out",
            },
            "-=0.25",
          );
        }
      }

      /*
       * ============================================================
       * CAREER HEADING
       * ============================================================
       */

      const careerHeading = section.querySelector<HTMLElement>(
        "[data-career-heading]",
      );

      if (careerHeading) {
        const split = SplitText.create(careerHeading, {
          type: "lines",
          mask: "lines",
        });

        gsap.set(split.lines, {
          yPercent: 110,
          rotateX: -65,
          transformOrigin: "50% 100%",
        });

        gsap.to(split.lines, {
          yPercent: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: careerHeading,
            start: "top 84%",
            once: true,
          },
        });
      }

      /*
       * ============================================================
       * CAREER INTRO
       * ============================================================
       */

      const careerIntro = section.querySelector<HTMLElement>(
        "[data-career-intro]",
      );

      if (careerIntro) {
        gsap.fromTo(
          careerIntro,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: careerIntro,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      /*
       * ============================================================
       * MARQUEE REVEAL
       * ============================================================
       */

      const marqueeWrapper = section.querySelector<HTMLElement>(
        "[data-career-marquee]",
      );

      if (marqueeWrapper) {
        gsap.fromTo(
          marqueeWrapper,
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: marqueeWrapper,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      /*
       * ============================================================
       * CAREER CARD ENTRANCE
       * ============================================================
       */

      const cards = gsap.utils.toArray<HTMLElement>(".career-marquee-card");

      if (cards.length) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            scale: 0.94,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: marquee,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      /*
       * ============================================================
       * INFINITE MARQUEE
       * ============================================================
       */

      const firstSetWidth = marquee.scrollWidth / 2;

      const marqueeTween = gsap.to(marquee, {
        x: -firstSetWidth,
        duration: 35,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((value) => {
            const x = Number.parseFloat(value);

            return x <= -firstSetWidth ? x + firstSetWidth : x;
          }),
        },
      });

      /*
       * Pause marquee when outside viewport.
       */

      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => marqueeTween.resume(),
        onEnterBack: () => marqueeTween.resume(),
        onLeave: () => marqueeTween.pause(),
        onLeaveBack: () => marqueeTween.pause(),
      });

      /*
       * ============================================================
       * BEYOND THE DEGREE LABEL
       * ============================================================
       */

      const beyondLabel = section.querySelector<HTMLElement>(
        "[data-beyond-label]",
      );

      if (beyondLabel) {
        const dot = beyondLabel.querySelector<HTMLElement>("[data-beyond-dot]");

        const text = beyondLabel.querySelector<HTMLElement>(
          "[data-beyond-label-text]",
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: beyondLabel,
            start: "top 90%",
            once: true,
          },
        });

        if (dot) {
          timeline.fromTo(
            dot,
            {
              scale: 0,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: "back.out(2.5)",
            },
          );
        }

        if (text) {
          timeline.fromTo(
            text,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.25",
          );
        }
      }

      /*
       * ============================================================
       * BEYOND THE DEGREE HEADING
       * ============================================================
       */

      const beyondHeading = section.querySelector<HTMLElement>(
        "[data-beyond-heading]",
      );

      if (beyondHeading) {
        const split = SplitText.create(beyondHeading, {
          type: "lines",
          mask: "lines",
        });

        gsap.set(split.lines, {
          yPercent: 100,
          opacity: 0,
        });

        gsap.to(split.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: beyondHeading,
            start: "top 84%",
            once: true,
          },
        });
      }

      /*
       * ============================================================
       * BEYOND THE DEGREE INTRO
       * ============================================================
       */

      const beyondIntro = section.querySelector<HTMLElement>(
        "[data-beyond-intro]",
      );

      if (beyondIntro) {
        gsap.fromTo(
          beyondIntro,
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: beyondIntro,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      /*
       * ============================================================
       * FUTURE PATH CARDS
       * ============================================================
       */

      const futureCards = gsap.utils.toArray<HTMLElement>("[data-future-path]");

      if (futureCards.length) {
        futureCards.forEach((card, index) => {
          const number = card.querySelector<HTMLElement>(
            "[data-future-number]",
          );

          const title = card.querySelector<HTMLElement>("[data-future-title]");

          const description = card.querySelector<HTMLElement>(
            "[data-future-description]",
          );

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 87%",
              once: true,
            },
          });

          gsap.set(card, {
            opacity: 0,
            y: 45,
          });

          if (number) {
            gsap.set(number, {
              opacity: 0,
              scale: 0.7,
            });
          }

          if (title) {
            gsap.set(title, {
              opacity: 0,
              y: 18,
            });
          }

          if (description) {
            gsap.set(description, {
              opacity: 0,
              y: 18,
            });
          }

          timeline.to(
            card,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            index * 0.08,
          );

          if (number) {
            timeline.to(
              number,
              {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
              },
              "<0.12",
            );
          }

          if (title) {
            timeline.to(
              title,
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
              },
              "<0.08",
            );
          }

          if (description) {
            timeline.to(
              description,
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
              },
              "<0.08",
            );
          }
        });
      }
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={sectionRef}>
      {/* =========================================================
          CAREER PATHWAYS
      ========================================================== */}

      <section className="overflow-hidden bg-gray-50">
        <Container>
          <div className="py-14 sm:py-18 lg:py-20">
            {/* Header */}
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20 xl:gap-28">
              <div>
                <div data-career-label className="mb-5 flex items-center gap-3">
                  <span
                    data-career-dot
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-accent-400"
                  />

                  <span
                    data-career-label-text
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700"
                  >
                    Career Pathways
                  </span>
                </div>

                <h2
                  data-career-heading
                  className="
                    max-w-xl
                    [perspective:900px]
                    text-[34px]
                    font-extrabold
                    uppercase
                    leading-[0.97]
                    tracking-[-0.045em]
                    text-primary-700
                    sm:text-[42px]
                    lg:text-[50px]
                  "
                >
                  Shape your IT future.
                </h2>
              </div>

              <p
                data-career-intro
                className="
                  max-w-xl
                  text-[14px]
                  leading-6
                  text-gray-500
                  sm:text-[15px]
                  sm:leading-7
                  lg:text-[16px]
                  lg:leading-7
                "
              >
                The broad nature of Information Technology allows graduates to
                work across software, technology services and digital
                businesses.
              </p>
            </div>
          </div>
        </Container>

        {/* Marquee */}
        <div
          data-career-marquee
          className="
            relative
            w-full
            overflow-hidden
            border-y
            border-gray-200
          "
        >
          <div
            ref={marqueeRef}
            className="
              flex
              w-max
              gap-4
              py-5
              sm:gap-5
              sm:py-6
            "
          >
            {[...careerGroups, ...careerGroups].map((group, index) => (
              <CareerCard
                key={`${group.number}-${index}`}
                group={group}
                isDecorative={index >= careerGroups.length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          BEYOND THE DEGREE
      ========================================================== */}

      <section className="bg-gray-50">
        <Container>
          <div className="py-14 sm:py-16 lg:py-20">
            {/* Header */}
            <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16 xl:gap-24">
              <div>
                <div
                  data-beyond-label
                  className="mb-4 flex items-center gap-2.5"
                >
                  <span
                    data-beyond-dot
                    aria-hidden="true"
                    className="
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-accent-400
                      sm:h-2
                      sm:w-2
                    "
                  />

                  <span
                    data-beyond-label-text
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700"
                  >
                    Beyond the Degree
                  </span>
                </div>

                <h2
                  data-beyond-heading
                  className="
                    max-w-2xl
                    text-[32px]
                    font-extrabold
                    uppercase
                    leading-[0.98]
                    tracking-[-0.045em]
                    text-primary-700
                    sm:text-[40px]
                    lg:text-[48px]
                  "
                >
                  Keep learning. Keep specialising.
                </h2>
              </div>

              <p
                data-beyond-intro
                className="
                  max-w-xl
                  text-[14px]
                  leading-6
                  text-gray-500
                  sm:text-[15px]
                  sm:leading-7
                  lg:text-[17px]
                  lg:leading-8
                "
              >
                Students can pursue higher studies and specialised
                certifications in computing, information systems, data, cloud
                and cybersecurity.
              </p>
            </div>

            {/* Future Paths */}
            <div className="mt-10 border-y border-gray-200 sm:mt-12 lg:mt-14">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {futurePaths.map((path, index) => (
                  <article
                    key={path.number}
                    data-future-path
                    className={`
                      px-5
                      py-7
                      sm:px-7
                      sm:py-8
                      lg:px-8
                      lg:py-9
                      xl:px-9
                      xl:py-10
                      ${
                        index > 0
                          ? "border-t border-gray-200 sm:border-t-0 sm:border-l"
                          : ""
                      }
                    `}
                  >
                    <span
                      data-future-number
                      className="
                        inline-block
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-[0.14em]
                        text-accent-400
                      "
                    >
                      {path.number}
                    </span>

                    <h3
                      data-future-title
                      className="
                        mt-5
                        text-[18px]
                        font-extrabold
                        leading-[1.08]
                        tracking-[-0.03em]
                        text-primary-700
                        sm:text-[20px]
                        lg:text-[21px]
                      "
                    >
                      {path.title}
                    </h3>

                    <p
                      data-future-description
                      className="
                        mt-3
                        text-[13px]
                        leading-5
                        text-gray-500
                        sm:mt-4
                        sm:text-[14px]
                        sm:leading-6
                        lg:text-[15px]
                        lg:leading-7
                      "
                    >
                      {path.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
