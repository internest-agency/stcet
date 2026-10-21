"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaCircleArrowRight,
  FaGraduationCap,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import Container from "@/src/components/ui/Container";

export interface CourseListItem {
  id: number;
  name: string;
  slug: string;
  degree: string;
  tagline: string | null;
  description: string | null;
  heroImage: string | null;
}

interface CoursesExplorerProps {
  courses: CourseListItem[];
}

export default function CoursesExplorer({ courses }: CoursesExplorerProps) {
  const [selectedDegree, setSelectedDegree] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const degrees = useMemo(() => {
    const set = new Set(courses.map((c) => c.degree).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesDegree =
        selectedDegree === "All" ||
        course.degree.toLowerCase() === selectedDegree.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === "" ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tagline &&
          course.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.description &&
          course.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDegree && matchesSearch;
    });
  }, [courses, selectedDegree, searchQuery]);

  return (
    <section className="bg-gray-50/75 py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Controls Bar: Degree Filter Tabs + Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Degree Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {degrees.map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => setSelectedDegree(deg)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm ${
                  selectedDegree === deg
                    ? "bg-primary-800 text-white shadow-md shadow-primary-900/10"
                    : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {deg === "All" ? "All Programmes" : `${deg} Programmes`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
            <input
              type="text"
              placeholder="Search programmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 sm:text-sm"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const imageSrc =
                course.heroImage && course.heroImage.startsWith("/")
                  ? course.heroImage
                  : "/images/cse-hero-bg.webp";

              return (
                <article
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-300 hover:shadow-xl"
                >
                  {/* Hero / Thumbnail Banner */}
                  <div className="relative h-52 w-full overflow-hidden bg-primary-900">
                    <Image
                      src={imageSrc}
                      alt={course.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />

                    {/* Degree & Duration Badges */}
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full bg-accent-400 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary-950 shadow-sm">
                        {course.degree}
                      </span>
                      <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-gray-800 backdrop-blur-xs">
                        4 Years
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/90">
                        <FaGraduationCap className="text-accent-400" />
                        Anna University Affiliated • AICTE Approved
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-lg font-extrabold text-gray-900 transition-colors group-hover:text-primary-700 sm:text-xl">
                      {course.name}
                    </h3>

                    {course.tagline && (
                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-primary-700 sm:text-sm">
                        {course.tagline}
                      </p>
                    )}

                    {course.description ? (
                      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
                        {course.description}
                      </p>
                    ) : (
                      <p className="mt-3 text-xs leading-relaxed text-gray-500 sm:text-sm">
                        Comprehensive four-year undergraduate curriculum
                        offering foundational computing and practical industry
                        training.
                      </p>
                    )}

                    {/* Card Footer Action */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary-800 transition group-hover:text-accent-600 sm:text-sm"
                      >
                        Explore Curriculum
                        <FaCircleArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <Link
                        href="/enquire-now#application"
                        className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-primary-700"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <FaGraduationCap className="mx-auto size-12 text-gray-300" />
            <h4 className="mt-4 text-base font-bold text-gray-800">
              No Programmes Found
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              No course matches the selected criteria. Try resetting your search
              or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDegree("All");
                setSearchQuery("");
              }}
              className="mt-5 rounded-full bg-primary-800 px-5 py-2 text-xs font-bold text-white transition hover:bg-primary-900"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
