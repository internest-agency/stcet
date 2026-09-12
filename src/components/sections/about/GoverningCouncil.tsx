"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Container from "../../ui/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const councilMembers = [
  {
    number: "01",
    name: "Shri.Murugesan T",
    role: "Chairman",
    image: "/images/council/murugesan-t.jpg",
  },
  {
    number: "02",
    name: "Shri.Balakrishnan G",
    role: "Trust Nominee",
    image: "/images/council/balakrishnan-g.jpg",
  },
  {
    number: "03",
    name: "Shri.Murugaiah A",
    role: "Trust Nominee",
    image: "/images/council/murugaiah-a.jpg",
  },
  {
    number: "04",
    name: "Shri.Tamil Veeran R",
    role: "Academic Expert",
    image: "/images/council/tamil-veeran-r.jpg",
  },
  {
    number: "05",
    name: "Shri.Bala Murugan C",
    role: "Academic Expert",
    image: "/images/council/bala-murugan-c.jpg",
  },
  {
    number: "06",
    name: "Prof.Dr.Manikandan V",
    role: "Faculty from Affiliated College",
    image: "/images/council/manikandan-v.jpg",
  },
  {
    number: "07",
    name: "Shri.Rajkumar C",
    role: "Industrial Expert",
    image: "/images/council/rajkumar-c.jpg",
  },
  {
    number: "08",
    name: "Prof.Dr.Sundaram M",
    role: "Member Secretary (ex-officio)",
    image: "/images/council/sundaram-m.jpg",
  },
];

export default function GoverningCouncil() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const section = sectionRef.current;

      if (!section) return;

      const eyebrow = section.querySelector(".council-eyebrow");
      const heading = section.querySelector(".council-heading");
      const intro = section.querySelector(".council-intro");
      const cards = gsap.utils.toArray<HTMLElement>(".council-card");

      /*
       * --------------------------------------------------
       * INTRO ANIMATION
       * --------------------------------------------------
       */

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
                y: 15,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
              },
            );
          },
        });
      }

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
                stagger: 0.08,
                ease: "power4.out",
              },
            );
          },
        });
      }

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
       * --------------------------------------------------
       * COUNCIL CARD ANIMATION
       * --------------------------------------------------
       */

      cards.forEach((card) => {
        const image = card.querySelector(".council-card-image");
        const content = card.querySelector(".council-card-content");

        const elements = [image, content].filter(
          (element): element is Element => Boolean(element),
        );

        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 40,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
            );

            if (elements.length) {
              gsap.fromTo(
                elements,
                {
                  opacity: 0,
                  y: 20,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.08,
                  delay: 0.12,
                  ease: "power3.out",
                },
              );
            }
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-0">
      <Container className="pt-20 sm:pt-24 lg:pt-32">
        {/* =================================================
            INTRO
        ================================================= */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:gap-28">
          {/* Heading */}
          <div>
            <div className="council-eyebrow mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-400"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
                Governing Council
              </span>
            </div>

            <h2 className="council-heading max-w-md text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-4xl lg:text-5xl">
              Leadership
              <br />
              with purpose.
            </h2>
          </div>

          {/* Intro */}
          <div className="lg:pt-8">
            <p className="council-intro max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              The Governing Council brings together institutional leadership,
              academic expertise, faculty representation and industry experience
              to guide the academic and developmental direction of the
              institution.
            </p>
          </div>
        </div>

        {/* =================================================
            COUNCIL GRID
        ================================================= */}
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-y-14 lg:mt-24 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-16">
          {councilMembers.map((member) => (
            <article key={member.number} className="council-card group">
              {/* Image */}
              <div className="council-card-image relative aspect-[4/5] overflow-hidden bg-primary-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-primary-900/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Number */}
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-5 text-xs font-black tracking-[0.2em] text-white/60 transition-colors duration-300 group-hover:text-white sm:left-6 sm:top-6"
                >
                  {member.number}
                </span>

                {/* Role */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
                    />

                    <span className="text-[10px] font-bold uppercase leading-4 tracking-[0.14em] text-white/75">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Bottom Accent */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-1 w-0 bg-accent-400 transition-all duration-500 ease-out group-hover:w-full"
                />
              </div>

              {/* Content */}
              <div className="council-card-content relative border-b border-gray-200 py-5 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-gray-900 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:text-xl">
                      {member.name}
                    </h3>

                    <p className="mt-2 text-[10px] font-bold uppercase leading-4 tracking-[0.14em] text-gray-400">
                      {member.role}
                    </p>
                  </div>

                  {/* Indicator */}
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-all duration-500 group-hover:border-primary-700 group-hover:bg-primary-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-700 transition-all duration-300 group-hover:scale-150 group-hover:bg-white" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
