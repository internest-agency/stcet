"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Container from "../../ui/Container";

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

const BASE_WIDTH = 24;
const ACTIVE_WIDTH = 44;

const INACTIVE_WIDTH =
  (BASE_WIDTH * galleryItems.length - ACTIVE_WIDTH) / (galleryItems.length - 1);

type GalleryCardProps = {
  item: GalleryItem;
  isActive: boolean;
  onEnter: () => void;
};

function GalleryCard({ item, isActive, onEnter }: GalleryCardProps) {
  return (
    <article
      className="gallery-item relative min-h-[460px] shrink-0 overflow-hidden"
      style={{
        width: `${isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH}vw`,
        transition: "width 650ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseEnter={onEnter}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="44vw"
        className={`gallery-image object-cover ${
          isActive ? "scale-[1.08]" : "scale-100"
        }`}
        style={{
          transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Overlay */}
      <div
        className={`gallery-overlay absolute inset-0 transition-opacity duration-500 ${
          isActive ? "bg-black/10" : "bg-black/30"
        }`}
      />

      {/* Number */}
      <div className="absolute left-5 top-5 z-10">
        <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-black/35 px-4 py-2 font-mono text-xs font-medium tracking-[0.15em] text-white backdrop-blur-md">
          {item.number}
        </span>
      </div>

      {/* Content */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 p-7 transition-all duration-500 md:p-8 ${
          isActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
          STCET Campus
        </span>

        <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {item.title}
        </h3>
      </div>

      {/* Bottom accent */}
      <div
        className={`absolute bottom-0 left-0 z-20 h-1 bg-accent-400 transition-all duration-500 ${
          isActive ? "w-full" : "w-0"
        }`}
      />
    </article>
  );
}

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const secondSetRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    const secondSet = secondSetRef.current;

    if (!section || !track || !firstSet || !secondSet) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        /*
         * ==========================================================
         * MARQUEE
         * ==========================================================
         *
         * The marquee is completely independent from:
         *
         * - mouse wheel
         * - hover
         * - ScrollTrigger
         * - card animations
         *
         * It continuously moves from left to right at a fixed speed.
         */

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
          return;
        }

        let loopDistance = 0;

        const calculateDistance = () => {
          /*
           * The second set starts exactly where the first set ends.
           *
           * offsetLeft includes the complete width of:
           *
           * - first set
           * - its internal gaps
           * - the gap between the two sets
           */
          loopDistance = secondSet.offsetLeft;
        };

        calculateDistance();

        /*
         * Wait for layout/images to settle before starting.
         */
        const startTimer = window.setTimeout(() => {
          calculateDistance();

          if (!loopDistance) {
            return;
          }

          /*
           * The complete first set travels one full width.
           *
           * 85 seconds gives a slow, premium editorial movement.
           */
          gsap.to(track, {
            x: () => -loopDistance,
            duration: 85,
            ease: "none",
            repeat: -1,
          });
        }, 50);

        /*
         * Recalculate dimensions when viewport changes.
         *
         * We do NOT restart the animation here unnecessarily.
         */
        const resizeObserver = new ResizeObserver(() => {
          calculateDistance();
        });

        resizeObserver.observe(section);

        return () => {
          window.clearTimeout(startTimer);
          resizeObserver.disconnect();

          /*
           * Kill only the marquee animation during cleanup.
           */
          gsap.killTweensOf(track);
        };
      });

      /*
       * ==========================================================
       * MOBILE
       * ==========================================================
       */

      media.add("(max-width: 1023px)", () => {
        /*
         * Mobile does not use the desktop marquee.
         * The mobile layout remains a normal vertical gallery.
         */
      });

      return () => {
        media.revert();
      };
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-primary-700 text-white"
    >
      {/* ==========================================================
          INTRO
          ========================================================== */}

      <Container className="relative z-10 max-w-7xl pb-10 pt-20 md:pb-12 md:pt-24 lg:pb-14 lg:pt-28">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end lg:gap-16">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/95 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-primary-700">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span>Campus Gallery</span>
            </div>

            {/* Title */}
            <h2 className="max-w-4xl text-4xl font-bold tracking-tight md:text-4xl lg:text-5xl uppercase">
              A closer look at
              <br className="hidden md:block" />
              life at STCET
            </h2>
          </div>

          {/* Right */}
          <div className="md:pb-1 lg:pb-2">
            <p className="max-w-2xl text-base leading-7 text-white/80 md:text-lg md:leading-8">
              Explore the campus, learning spaces, laboratories, library,
              hostels and facilities that shape the everyday student experience
              at STCET.
            </p>
          </div>
        </div>
      </Container>

      {/* ==========================================================
          RULER
          ========================================================== */}

      <div className="relative z-10 hidden overflow-hidden border-y border-white/25 lg:block">
        <div className="flex h-16 min-w-[1400px] items-start">
          {Array.from({ length: 51 }).map((_, index) => {
            const isMajor = index % 5 === 0;

            return (
              <div
                key={index}
                className="relative flex h-full flex-1 justify-center"
              >
                <span
                  className={`block w-px bg-white/50 ${
                    isMajor ? "h-7" : "h-3"
                  }`}
                />

                {isMajor && index > 0 && (
                  <span className="absolute left-1/2 top-9 -translate-x-1/2 text-[10px] font-medium tracking-wider text-white/60">
                    {String(index).padStart(2, "0")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================================
          DESKTOP MARQUEE
          ========================================================== */}

      <div className="hidden overflow-hidden lg:block">
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-5"
          style={{
            willChange: "transform",
          }}
        >
          {/* First set */}
          <div ref={firstSetRef} className="flex shrink-0 gap-5">
            {galleryItems.map((item, index) => (
              <GalleryCard
                key={`first-${item.image}`}
                item={item}
                isActive={activeIndex === index}
                onEnter={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* Duplicate set */}
          <div
            ref={secondSetRef}
            className="flex shrink-0 gap-5"
            aria-hidden="true"
          >
            {galleryItems.map((item, index) => (
              <GalleryCard
                key={`second-${item.image}`}
                item={item}
                isActive={activeIndex === index}
                onEnter={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================================
          MOBILE GALLERY
          ========================================================== */}

      <div className="px-4 pb-12 lg:hidden">
        <div className="grid gap-4">
          {galleryItems.map((item) => (
            <article
              key={item.image}
              className="group relative min-h-[360px] overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

              {/* Number */}
              <div className="absolute left-5 top-5">
                <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-black/40 px-4 py-2 font-mono text-xs tracking-[0.15em] text-white backdrop-blur-md">
                  {item.number}
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
                  STCET Campus
                </span>

                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
