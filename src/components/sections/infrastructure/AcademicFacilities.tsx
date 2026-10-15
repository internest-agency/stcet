"use client";

import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "@/src/components/ui/Container";
import SectionHeading from "@/src/components/ui/SectionHeading";
import { getPublishedInfrastructureFacilities } from "@/src/lib/queries/infrastructure";

gsap.registerPlugin(ScrollTrigger);

const sectionId = "academic";

export default function AcademicFacilities({ facilities }: { facilities?: any[] }) {
  const [academicFacilities, setAcademicFacilities] = useState<any[]>([]);

  useLayoutEffect(() => {
    getPublishedInfrastructureFacilities().then((data) => {
      const academic = data.filter(
        (f) => f.sectionId === sectionId || f.category === "academic"
      );
      setAcademicFacilities(
        academic.map((f) => ({
          id: f.id,
          title: f.title ?? "Facility",
          image: f.imagePath ?? "/images/infrastructure/academic/default.webp",
          number: f.sortOrder?.toString().padStart(2, "0") ?? "01",
          description: f.description ?? "",
        }))
      );
    });
  }, []);

  const renderedFacilities = academicFacilities.length > 0
    ? academicFacilities
    : [
        {
          number: "01",
          title: "Spacious Classrooms",
          image: "/images/infrastructure/academic/classrooms.webp",
        },
        {
          number: "02",
          title: "Technology-Enabled Learning Spaces",
          image: "/images/infrastructure/academic/technology-learning.webp",
        },
        {
          number: "03",
          title: "Department Laboratories",
          image: "/images/infrastructure/academic/department-labs.webp",
        },
        {
          number: "04",
          title: "Seminar & Discussion Spaces",
          image: "/images/infrastructure/academic/seminar.webp",
        },
      ];

  return (
    <section className="bg-white py-14 sm:py-18 lg:py-20">
      <Container>
        <SectionHeading as="h2" className="text-primary-700 mb-6">
          Academic Facilities
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {renderedFacilities.map((facility) => (
            <div key={facility.id} className="rounded-md border border-gray-200 bg-white p-4 hover:border-primary-500 transition-colors">
              <Image
                src={facility.image}
                alt={facility.title}
                className="h-40 w-full object-cover mb-4"
                width={200}
                height={200}
                priority
              />
              <h3 className="font-bold text-gray-900 mb-2">{facility.title}</h3>
              <p className="text-sm text-gray-600">{facility.number}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}