"use client";

import Image from "next/image";
import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import Container from "@/src/components/ui/Container";

interface EditorialHeroProps {
  children: ReactNode;

  image: string;
  imageAlt: string;

  overlayClassName?: string;
  showOverlay?: boolean;

  imageClassName?: string;
  className?: string;

  minHeight?: string;
}

export default function EditorialHero({
  children,
  image,
  imageAlt,
  overlayClassName = "bg-linear-to-r from-primary-800 via-primary-800/80 to-transparent",
  showOverlay = true,
  imageClassName = "object-cover object-bottom-right",
  className = "",
  minHeight = "min-h-[680px] xl:min-h-screen 2xl:min-h-[800px]",
}: EditorialHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const content = section.querySelectorAll(".editorial-hero-content > *");

      const image = section.querySelector(".editorial-hero-image");

      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
        },
      );

      if (image) {
        gsap.fromTo(
          image,
          {
            clipPath: "inset(0 100% 0 0)",
            scale: 1.05,
          },
          {
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-gray-50 ${className}`}
    >
      {/* Background Image */}
      <div className="editorial-hero-image absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className={imageClassName}
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-1 ${overlayClassName}`}
        />
      )}

      {/* Content */}
      <Container className="relative z-2 mt-4">
        <div
          className={`editorial-hero-content flex ${minHeight} flex-col justify-center max-w-2xl py-24`}
        >
          {children}
        </div>
      </Container>
    </section>
  );
}
