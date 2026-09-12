"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

type GalleryItem = {
  number: string;
  title: string;
  image: string;
};

const galleryItems: GalleryItem[] = [
  {
    number: "01",
    title: "Engineering Block",
    image: "/images/gallery/stcet-engineering-block-entrance.jpg",
  },
  {
    number: "02",
    title: "Computer Laboratory",
    image: "/images/gallery/stcet-computer-lab-1.jpg",
  },
  {
    number: "03",
    title: "Classroom",
    image: "/images/gallery/stcet-classroom.jpg",
  },
  {
    number: "04",
    title: "College Library",
    image: "/images/gallery/stcet-college-library.jpg",
  },
  {
    number: "05",
    title: "Digital Library",
    image: "/images/gallery/stcet-library-computer.jpg",
  },
  {
    number: "06",
    title: "Boys Hostel",
    image: "/images/gallery/stcet-boys-hostel.jpg",
  },
  {
    number: "07",
    title: "Girls Hostel",
    image: "/images/gallery/stcet-girls-hostel.jpg",
  },
  {
    number: "08",
    title: "Girls Hostel Interior",
    image: "/images/gallery/stcet-girls-hostel-inside-1.jpg",
  },
  {
    number: "09",
    title: "Dining Hall",
    image: "/images/gallery/stcet-dining-hall.jpg",
  },
];

export default function GalleryGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const eyebrow = section.querySelector(".gallery-eyebrow");
      const heading = section.querySelector(".gallery-heading");
      const intro = section.querySelector(".gallery-intro");
      const grid = section.querySelector(".gallery-grid");
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");

      if (prefersReducedMotion) {
        gsap.set([eyebrow, heading, intro, cards], {
          clearProps: "all",
        });

        return;
      }

      /* --------------------------------------------------
         EYEBROW
      -------------------------------------------------- */

      if (eyebrow) {
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              eyebrow,
              {
                opacity: 0,
                y: 18,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: "power3.out",
              },
            );
          },
        });
      }

      /* --------------------------------------------------
         HEADING
      -------------------------------------------------- */

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
                yPercent: 110,
              },
              {
                yPercent: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
              },
            );
          },
        });
      }

      /* --------------------------------------------------
         INTRO
      -------------------------------------------------- */

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

      /* --------------------------------------------------
         GRID
      -------------------------------------------------- */

      if (grid) {
        ScrollTrigger.create({
          trigger: grid,
          start: "top 85%",
          once: true,
          onEnter: () => {
            cards.forEach((card, index) => {
              const imageWrap = card.querySelector(".gallery-image-wrap");

              const image = card.querySelector(".gallery-image");

              const info = card.querySelector(".gallery-info");

              /* Card entrance */
              gsap.fromTo(
                card,
                {
                  opacity: 0,
                  y: 60,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.85,
                  delay: index * 0.07,
                  ease: "power3.out",
                },
              );

              /* Image clip reveal */
              if (imageWrap) {
                gsap.fromTo(
                  imageWrap,
                  {
                    clipPath: "inset(12% 0% 12% 0%)",
                  },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.1,
                    delay: index * 0.07,
                    ease: "power4.out",
                  },
                );
              }

              /* Image movement */
              if (image) {
                gsap.fromTo(
                  image,
                  {
                    scale: 1.12,
                    yPercent: 4,
                  },
                  {
                    scale: 1,
                    yPercent: 0,
                    duration: 1.2,
                    delay: index * 0.07,
                    ease: "power3.out",
                  },
                );
              }

              /* Info entrance */
              if (info) {
                gsap.fromTo(
                  info,
                  {
                    opacity: 0,
                    y: 12,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.07 + 0.35,
                    ease: "power3.out",
                  },
                );
              }
            });
          },
        });
      }

      /* --------------------------------------------------
         PARALLAX
      -------------------------------------------------- */

      cards.forEach((card) => {
        const image = card.querySelector(".gallery-image");

        if (!image) return;

        gsap.to(image, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-0">
      <Container className="pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="gallery-eyebrow mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Campus Gallery
              </span>
            </div>

            <div className="overflow-hidden">
              <h1 className="gallery-heading max-w-2xl text-4xl font-extrabold uppercase leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                A closer look
                <br />
                at life at STCET.
              </h1>
            </div>
          </div>

          {/* Introduction */}
          <div className="flex items-end lg:pb-2">
            <div>
              <span
                aria-hidden="true"
                className="mb-6 block h-px w-14 bg-accent-400"
              />

              <p className="gallery-intro max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Explore the spaces and experiences that shape everyday life at
                S. Thangapazham College of Engineering and Technology — from
                classrooms and laboratories to libraries, hostels and campus
                facilities.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            GALLERY GRID
        ================================================= */}
        <div className="gallery-grid mt-16 grid grid-cols-1 gap-x-5 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:mt-28 lg:grid-cols-12 lg:gap-x-7 lg:gap-y-20">
          {galleryItems.map((item, index) => {
            /*
             * Editorial asymmetric layout
             */
            const layoutClasses = [
              "lg:col-span-7",
              "lg:col-span-5 lg:pt-24",
              "lg:col-span-5",
              "lg:col-span-7 lg:pt-20",
              "lg:col-span-6",
              "lg:col-span-6 lg:pt-28",
              "lg:col-span-7",
              "lg:col-span-5 lg:pt-20",
              "lg:col-span-8 lg:mx-auto lg:col-start-3",
            ];

            const aspectClasses = [
              "aspect-[16/10]",
              "aspect-[4/5]",
              "aspect-[4/5]",
              "aspect-[16/10]",
              "aspect-[4/5]",
              "aspect-[4/5]",
              "aspect-[16/10]",
              "aspect-[4/5]",
              "aspect-[16/9]",
            ];

            return (
              <article
                key={item.number}
                className={`gallery-card group ${layoutClasses[index]}`}
              >
                {/* Image */}
                <div
                  className={`gallery-image-wrap relative overflow-hidden bg-primary-800 ${aspectClasses[index]}`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.title} - S. Thangapazham College of Engineering and Technology`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
                    className="gallery-image object-cover will-change-transform"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-primary-900/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Number */}
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-5 text-xs font-black tracking-[0.2em] text-white/70 transition-colors duration-300 group-hover:text-white sm:left-6 sm:top-6"
                  >
                    {item.number}
                  </span>

                  {/* Title on image */}
                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-accent-400 transition-all duration-500 group-hover:w-12"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                        STCET
                      </span>
                    </div>

                    <h2 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-white sm:text-2xl">
                      {item.title}
                    </h2>
                  </div>

                  {/* Hover frame */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 border border-white/0 transition-all duration-500 group-hover:inset-5 group-hover:border-white/20"
                  />
                </div>

                {/* Information */}
                <div className="gallery-info flex items-center justify-between border-b border-gray-200 py-4 sm:py-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    {item.number} /{" "}
                    {String(galleryItems.length).padStart(2, "0")}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-accent-400 transition-transform duration-300 group-hover:scale-150"
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* =================================================
            CLOSING STATEMENT
        ================================================= */}
        <div className="relative mt-20 overflow-hidden border-y border-gray-200 py-12 sm:mt-28 sm:py-16 lg:mt-36 lg:py-20">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-12 select-none text-[11rem] font-black leading-none tracking-[-0.08em] text-primary-700/[0.035] sm:-right-8 sm:text-[16rem] lg:text-[20rem]"
          >
            09
          </span>

          <div className="relative z-10 grid gap-6 lg:grid-cols-[100px_1fr] lg:gap-10">
            <div className="flex items-start">
              <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Campus Life
                </span>
              </div>
            </div>

            <p className="max-w-4xl text-2xl font-extrabold leading-[1.3] tracking-[-0.025em] text-primary-700 sm:text-3xl lg:text-4xl lg:leading-[1.25]">
              Every space at STCET is part of a larger journey — learning,
              discovering, collaborating and growing together.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
