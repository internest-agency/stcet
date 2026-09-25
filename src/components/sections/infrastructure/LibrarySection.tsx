"use client";

import Image from "next/image";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const resources = [
  "Engineering Textbooks",
  "Reference Materials",
  "Academic Journals",
  "Reading & Study Spaces",
];

export default function LibrarySection() {
  return (
    <section className="border-t border-primary-800/10 bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-800/45">
              06 — Central Library
            </span>
          </div>
          <SectionHeading as="h2" className="max-w-4xl">
            A Place to Learn Beyond Classrooms
          </SectionHeading>
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:gap-16">
          <div>
            <p className="max-w-md text-gray-800">
              The library provides students with academic resources that
              complement classroom learning and support independent study.
            </p>

            <p className="mt-6 font-bold text-gray-800">Resources include:</p>

            <ul className="mt-4 space-y-3">
              {resources.map((resource) => (
                <li key={resource} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-accent-400" />
                  {resource}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-full">
            <Image
              src="/images/infrastructure/library.webp"
              alt="STCET central library"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
