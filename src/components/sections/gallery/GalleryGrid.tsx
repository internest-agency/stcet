"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GalleryCategory =
  | "All"
  | "Campus"
  | "Academics"
  | "Library"
  | "Hostel"
  | "Student Life";

interface GalleryItem {
  id: number;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  image: string;
}

const categories: GalleryCategory[] = [
  "All",
  "Campus",
  "Academics",
  "Library",
  "Hostel",
  "Student Life",
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Engineering Block",
    category: "Campus",
    image: "/images/gallery/stcet-engineering-block-entrance.jpg",
  },
  {
    id: 2,
    title: "Computer Laboratory",
    category: "Academics",
    image: "/images/gallery/stcet-computer-lab-1.jpg",
  },
  {
    id: 3,
    title: "Classroom",
    category: "Academics",
    image: "/images/gallery/stcet-classroom.jpg",
  },
  {
    id: 4,
    title: "College Library",
    category: "Library",
    image: "/images/gallery/stcet-college-library.jpg",
  },
  {
    id: 5,
    title: "Digital Library",
    category: "Library",
    image: "/images/gallery/stcet-library-computer.jpg",
  },
  {
    id: 6,
    title: "Boys Hostel",
    category: "Hostel",
    image: "/images/gallery/stcet-boys-hostel.jpg",
  },
  {
    id: 7,
    title: "Girls Hostel",
    category: "Hostel",
    image: "/images/gallery/stcet-girls-hostel.jpg",
  },
  {
    id: 8,
    title: "Girls Hostel Interior",
    category: "Hostel",
    image: "/images/gallery/stcet-girls-hostel-inside-1.jpg",
  },
  {
    id: 9,
    title: "Dining Hall",
    category: "Student Life",
    image: "/images/gallery/stcet-dining-hall.jpg",
  },
];

export default function GalleryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return galleryItems;
    }

    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;

    if (!section || !stage || !grid) {
      return;
    }

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>(".gallery-card"),
    );

    if (!cards.length) {
      return;
    }

    const ctx = gsap.context(() => {
      /*
       * ----------------------------------------------------
       * DESTINATION POSITIONS
       * ----------------------------------------------------
       */

      const stageRect = stage.getBoundingClientRect();

      const destinations = cards.map((card) => {
        const rect = card.getBoundingClientRect();

        return {
          x: rect.left - stageRect.left + rect.width / 2,

          y: rect.top - stageRect.top + rect.height / 2,

          width: rect.width,
          height: rect.height,
        };
      });

      /*
       * ----------------------------------------------------
       * HIDE DESTINATION CARDS
       * ----------------------------------------------------
       */

      gsap.set(cards, {
        opacity: 0,
      });

      /*
       * ----------------------------------------------------
       * CREATE FLOATING BALLS
       * ----------------------------------------------------
       */

      const floatingCards: HTMLElement[] = [];

      cards.forEach((card, index) => {
        const clone = card.cloneNode(true) as HTMLElement;

        clone.classList.remove("gallery-card");

        clone.classList.add("gallery-floating-card");

        clone.style.position = "absolute";
        clone.style.left = "0";
        clone.style.top = "0";
        clone.style.zIndex = String(100 + index);
        clone.style.pointerEvents = "none";

        stage.appendChild(clone);

        floatingCards.push(clone);

        /*
         * Start from bottom center.
         */
        gsap.set(clone, {
          x: stageRect.width / 2,
          y: stageRect.height - 30,

          xPercent: -50,
          yPercent: -50,

          width: 52,
          height: 52,

          borderRadius: "50%",

          overflow: "hidden",

          opacity: 0,

          scale: 1,

          rotation: 0,
        });

        /*
         * Hide card content while it is a ball.
         */
        const content = clone.querySelector<HTMLElement>(
          ".gallery-card-content",
        );

        if (content) {
          gsap.set(content, {
            opacity: 0,
          });
        }

        /*
         * Slightly zoom image while it is a ball.
         */
        const image = clone.querySelector<HTMLElement>(".gallery-image");

        if (image) {
          gsap.set(image, {
            scale: 1.15,
          });
        }
      });

      /*
       * ----------------------------------------------------
       * SCROLL ANIMATION
       * ----------------------------------------------------
       *
       * NO PIN.
       *
       * The section itself provides the animation distance.
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top 55%",

          end: () => {
            /*
             * Keep the scroll distance controlled.
             *
             * Previously this was too large.
             */
            return `+=${Math.max(1000, filteredItems.length * 190)}`;
          },

          scrub: 0.8,

          invalidateOnRefresh: true,
        },
      });

      /*
       * ----------------------------------------------------
       * ARRANGE ONE BY ONE
       * ----------------------------------------------------
       */

      floatingCards.forEach((floatingCard, index) => {
        const destination = destinations[index];

        if (!destination) {
          return;
        }

        /*
         * Each image gets a compact timeline slot.
         */
        const start = index * 1;

        /*
         * 1. Appear as small ball
         */
        timeline.to(
          floatingCard,
          {
            opacity: 1,
            duration: 0.12,
            ease: "none",
          },
          start,
        );

        /*
         * 2. Move from bottom center
         */
        timeline.to(
          floatingCard,
          {
            x: destination.x,
            y: destination.y,

            duration: 0.65,

            ease: "power3.inOut",
          },
          start + 0.05,
        );

        /*
         * 3. Expand from ball into card
         */
        timeline.to(
          floatingCard,
          {
            width: destination.width,
            height: destination.height,

            borderRadius: "16px",

            duration: 0.35,

            ease: "power3.out",
          },
          start + 0.55,
        );

        /*
         * 4. Image settles
         */
        const image = floatingCard.querySelector<HTMLElement>(".gallery-image");

        if (image) {
          timeline.to(
            image,
            {
              scale: 1,

              duration: 0.3,

              ease: "power2.out",
            },
            start + 0.55,
          );
        }

        /*
         * 5. Show title/category
         */
        const content = floatingCard.querySelector<HTMLElement>(
          ".gallery-card-content",
        );

        if (content) {
          timeline.to(
            content,
            {
              opacity: 1,

              duration: 0.2,

              ease: "power2.out",
            },
            start + 0.8,
          );
        }

        /*
         * 6. Reveal actual grid card.
         *
         * The grid now becomes the final static gallery.
         */
        timeline.set(
          cards[index],
          {
            opacity: 1,
          },
          start + 0.95,
        );

        /*
         * 7. Remove floating copy.
         */
        timeline.set(
          floatingCard,
          {
            opacity: 0,
          },
          start + 1,
        );
      });

      /*
       * ----------------------------------------------------
       * CLEANUP
       * ----------------------------------------------------
       */

      return () => {
        floatingCards.forEach((floatingCard) => {
          floatingCard.remove();
        });
      };
    }, section);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();

      stage.querySelectorAll(".gallery-floating-card").forEach((element) => {
        element.remove();
      });
    };
  }, [filteredItems]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-50">
      <div
        ref={stageRef}
        className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-10 flex flex-col gap-7 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
              Campus Gallery
            </p>

            <h2 className="text-4xl font-medium tracking-tight text-primary-800 sm:text-5xl lg:text-6xl">
              Explore STCET
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Explore the campus, academic spaces, laboratories, student
              facilities and everyday college life.
            </p>
          </div>

          {/* ==================================================
              FILTER
          ================================================== */}

          <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "rounded-full px-5 py-2.5 text-sm",
                    "transition-colors duration-300",
                    isActive
                      ? "bg-primary-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            DESTINATION GRID
        ================================================== */}

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {filteredItems.map((item, index) => (
            <article key={item.id} className="gallery-card relative">
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      33vw
                    "
                  className="gallery-image object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                <div className="gallery-card-content absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-[0.16em] text-white/70">
                        {item.category}
                      </p>

                      <h3 className="text-lg font-medium text-white sm:text-xl">
                        {item.title}
                      </h3>
                    </div>

                    <span className="shrink-0 text-sm text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-500">
              No gallery images available in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
