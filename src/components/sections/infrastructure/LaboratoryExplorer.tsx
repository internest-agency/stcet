"use client";

import Image from "next/image";
import { useState } from "react";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const laboratories = [
  {
    number: "01",
    title: "Computer Science & IT Labs",
    description:
      "Programming, computing and technology-based practical learning.",
    image: "/images/infrastructure/labs/computer-science.webp",
  },
  {
    number: "02",
    title: "AI & ML Labs",
    description:
      "Practical exposure to artificial intelligence, machine learning and emerging technologies.",
    image: "/images/infrastructure/labs/ai-ml.webp",
  },
  {
    number: "03",
    title: "Electronics & Communication Labs",
    description:
      "Hands-on learning in electronics, communication systems and embedded technologies.",
    image: "/images/infrastructure/labs/ece.webp",
  },
  {
    number: "04",
    title: "Electrical & Electronics Labs",
    description:
      "Practical learning in electrical systems, circuits and engineering applications.",
    image: "/images/infrastructure/labs/eee.webp",
  },
];

export default function LaboratoryExplorer() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-800/45">
              05 — Laboratory Explorer
            </span>
          </div>
          <SectionHeading as="h2" className="max-w-5xl">
            Explore Our Engineering Laboratories
          </SectionHeading>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {laboratories.map((lab) => (
            <button
              key={lab.number}
              type="button"
              className="group relative aspect-[0.9/1] overflow-hidden text-left"
            >
              <Image
                src={lab.image}
                alt={lab.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-primary-800 via-primary-800/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-mono text-[10px] font-bold text-accent-400">
                  {lab.number}
                </span>

                <h3 className="mt-2 text-[15px] font-bold leading-5 text-white">
                  {lab.title}
                </h3>

                <p className="mt-3 text-[14px] leading-snug text-white/60">
                  {lab.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
