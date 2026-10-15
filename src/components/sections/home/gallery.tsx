"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export type HomeGalleryItem = {
  number: string;
  title: string;
  image: string;
};

const BASE_WIDTH = 24;
const ACTIVE_WIDTH = 44;

type GalleryCardProps = {
  item: HomeGalleryItem;
  isActive: boolean;
  inactiveWidth: number;
  onEnter: () => void;
  onSelect: () => void;
  interactive?: boolean;
};

function GalleryCard({
  item,
  isActive,
  inactiveWidth,
  onEnter,
  onSelect,
  interactive = true,
}: GalleryCardProps) {
  return (
    <article
      className={`gallery-item relative min-h-[460px] shrink-0 overflow-hidden ${
        interactive ? "cursor-pointer" : ""
      }`}
      style={{
        width: `${isActive ? ACTIVE_WIDTH : inactiveWidth}vw`,
        transition: "width 650ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseEnter={onEnter}
      onClick={interactive ? onSelect : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-label={interactive ? `View ${item.title}` : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
    >
      {/* Image */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="44vw"
        draggable={false}
        className={`gallery-image object-cover ${
          isActive ? "scale-[1.08]" : "scale-100"
        }`}
        style={{
          transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Overlay */}
      <div
        className={`gallery-overlay absolute inset-0 transition-colors duration-500 ${
          isActive ? "bg-black/10" : "bg-black/30"
        }`}
      />

      {/* Image number */}
      <div className="absolute left-5 top-5 z-10">
        <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-black/35 px-4 py-2 font-mono text-xs font-medium tracking-[0.15em] text-white backdrop-blur-md">
          {item.number}
        </span>
      </div>

      {/* Image content */}
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

interface GallerySectionProps {
  initialItems?: HomeGalleryItem[];
}

export default function GallerySection({
  initialItems,
}: GallerySectionProps = {}) {
  const items = initialItems ?? [];

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const secondSetRef = useRef<HTMLDivElement>(null);

  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);
  const navigationTweenRef = useRef<gsap.core.Tween | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const inactiveWidth =
    items.length > 1
      ? (BASE_WIDTH * items.length - ACTIVE_WIDTH) / (items.length - 1)
      : BASE_WIDTH;

  /**
   * Navigate directly to a gallery image.
   * Manual navigation stops the automatic marquee so that
   * the two animations never compete for the track position.
   */
  const navigateToImage = useCallback(
    (index: number) => {
      if (items.length === 0) return;

      const track = trackRef.current;
      const firstSet = firstSetRef.current;

      const nextIndex = (index + items.length) % items.length;

      setActiveIndex(nextIndex);

      // On mobile, the gallery remains a normal vertical layout.
      if (window.innerWidth < 1024 || !track || !firstSet) {
        return;
      }

      // Stop the automatic marquee and any previous navigation.
      marqueeTweenRef.current?.kill();
      navigationTweenRef.current?.kill();

      marqueeTweenRef.current = null;
      navigationTweenRef.current = null;

      // Reset to a known position when the viewport is resized
      // or when navigation begins from an existing marquee offset.
      requestAnimationFrame(() => {
        const currentTrack = trackRef.current;
        const currentFirstSet = firstSetRef.current;

        if (!currentTrack || !currentFirstSet) return;

        const card = currentFirstSet.children[nextIndex] as
          | HTMLElement
          | undefined;

        if (!card) return;

        navigationTweenRef.current = gsap.to(currentTrack, {
          x: () => -card.offsetLeft,
          duration: 0.85,
          ease: "power3.inOut",
          overwrite: true,
        });
      });
    },
    [items.length],
  );

  const navigatePrevious = useCallback(() => {
    navigateToImage(activeIndex - 1);
  }, [activeIndex, navigateToImage]);

  const navigateNext = useCallback(() => {
    navigateToImage(activeIndex + 1);
  }, [activeIndex, navigateToImage]);

  /**
   * Desktop marquee animation.
   * The duplicate set creates a continuous looping track.
   */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    const secondSet = secondSetRef.current;

    if (items.length === 0 || !section || !track || !firstSet || !secondSet) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) return;

        let loopDistance = 0;

        const calculateDistance = () => {
          loopDistance = secondSet.offsetLeft;
        };

        calculateDistance();

        const startTimer = window.setTimeout(() => {
          calculateDistance();

          if (!loopDistance) return;

          marqueeTweenRef.current = gsap.to(track, {
            x: () => -loopDistance,
            duration: 85,
            ease: "none",
            repeat: -1,
          });
        }, 100);

        const resizeObserver = new ResizeObserver(() => {
          calculateDistance();
        });

        resizeObserver.observe(section);
        resizeObserver.observe(firstSet);
        resizeObserver.observe(secondSet);

        return () => {
          window.clearTimeout(startTimer);
          resizeObserver.disconnect();

          marqueeTweenRef.current?.kill();
          marqueeTweenRef.current = null;

          navigationTweenRef.current?.kill();
          navigationTweenRef.current = null;

          gsap.killTweensOf(track);
        };
      });

      media.add("(max-width: 1023px)", () => {
        // Mobile uses a regular vertical gallery.
        gsap.set(track, { clearProps: "transform" });
      });

      return () => {
        media.revert();
      };
    }, section);

    return () => {
      context.revert();
      marqueeTweenRef.current?.kill();
      navigationTweenRef.current?.kill();
    };
  }, [items.length]);

  /**
   * Empty gallery state.
   */
  if (items.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-primary-700 text-white">
        <Container className="relative z-10 py-20 sm:py-24 lg:py-28">
          <div className="text-center">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-accent-300">
              Campus Gallery
            </p>

            <h2 className="text-4xl font-bold uppercase tracking-tight md:text-4xl lg:text-5xl">
              No gallery images available
            </h2>

            <p className="mt-4 text-base leading-7 text-white/70">
              Add gallery images via the admin panel to display them here.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-primary-700 text-white"
    >
      {/* INTRO */}
      <Container className="relative z-10 max-w-7xl pb-10 pt-20 md:pb-12 md:pt-24 lg:pb-14 lg:pt-28">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end lg:gap-16">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/95 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-primary-700">
              <span className="h-2 w-2 rounded-full bg-accent-400" />
              <span>Campus Gallery</span>
            </div>

            <SectionHeading as="h2" className="text-white">
              A closer look at <br />
              Life at STCET
            </SectionHeading>
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

      {/* RULER */}
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

      {/* DESKTOP MARQUEE */}
      <div className="hidden overflow-hidden lg:block">
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-5"
          style={{ willChange: "transform" }}
        >
          {/* First set */}
          <div ref={firstSetRef} className="flex shrink-0 gap-5">
            {items.map((item, index) => (
              <GalleryCard
                key={`first-${item.image}-${index}`}
                item={item}
                isActive={activeIndex === index}
                inactiveWidth={inactiveWidth}
                onEnter={() => setActiveIndex(index)}
                onSelect={() => navigateToImage(index)}
              />
            ))}
          </div>

          {/* Duplicate set for the seamless marquee */}
          <div
            ref={secondSetRef}
            className="flex shrink-0 gap-5"
            aria-hidden="true"
          >
            {items.map((item, index) => (
              <GalleryCard
                key={`second-${item.image}-${index}`}
                item={item}
                isActive={activeIndex === index}
                inactiveWidth={inactiveWidth}
                onEnter={() => setActiveIndex(index)}
                onSelect={() => navigateToImage(index)}
                interactive={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden items-center justify-between border-t border-white/15 px-6 py-5 lg:flex">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Explore the gallery
          </span>

          <span
            className="font-mono text-sm text-white/80"
            aria-live="polite"
            aria-atomic="true"
          >
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="mx-2 text-white/30">/</span>
            {String(items.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Previous */}
          <button
            type="button"
            onClick={navigatePrevious}
            aria-label="Previous gallery image"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-accent-400 hover:bg-accent-400 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 transition-transform group-hover:text-white"
              aria-hidden="true"
            >
              <path
                d="M19 12H5m7 7-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={navigateNext}
            aria-label="Next gallery image"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-accent-400 hover:bg-accent-400 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 group-hover:text-white"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-7-7 7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE GALLERY */}
      <div className="px-4 pb-12 lg:hidden">
        <div className="grid gap-4">
          {items.map((item, index) => (
            <article
              key={`mobile-${item.image}-${index}`}
              className="group relative min-h-[360px] overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />

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
