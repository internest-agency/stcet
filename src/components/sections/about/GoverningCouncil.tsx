"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FaUser } from "react-icons/fa";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

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

            <SectionHeading as="h2">
              Leadership
              <br />
              with Vision.
            </SectionHeading>
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
            FUTURISTIC GOVERNING COUNCIL GRID
        ================================================= */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5 xl:gap-7">
          {councilMembers.map((member) => (
            <article
              key={member.number}
              className="council-card group relative"
            >
              {/* Profile card */}
              <div className="relative isolate overflow-hidden rounded-lg border border-primary-900/10 bg-primary-900 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent-400/60 hover:shadow-xl hover:shadow-primary-900/15">
                {/* Portrait */}
                <div className="council-card-image flex flex-col items-center justify-center relative aspect-[4/5] overflow-hidden bg-primary-800">
                  <FaUser className="text-gray-200/20 text-9xl" />

                  {/* Cinematic image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/25 to-primary-900/10 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Subtle futuristic grid */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Member identity */}
                  <div className="council-card-content absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="text-lg uppercase font-semibold leading-tight tracking-tight text-white">
                      {member.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
