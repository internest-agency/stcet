import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseHero from "@/src/components/sections/courses/CourseHero";
import CourseOverview from "@/src/components/sections/courses/CourseOverview";
import OpportunityAreas from "@/src/components/sections/courses/OpportunityAreas";
import CareerPathways from "@/src/components/sections/courses/CareerPathways";
import CurriculumExplorer from "@/src/components/sections/courses/CurriculumExplorer";
import WhyStudy from "@/src/components/sections/courses/WhyStudy";
import { requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminCourseById } from "@/src/lib/queries/admin-courses";
import { notFound } from "next/navigation";

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const courseId = Number(id);
  if (!Number.isSafeInteger(courseId) || courseId <= 0) notFound();

  const course = await getAdminCourseById(courseId);
  if (!course) notFound();

  const slides = course.modules.map((module) => ({
    number: String(module.number).padStart(2, "0"),
    title: module.title,
    description: module.description,
    image: module.image,
  }));
  const reasons = course.reasons.map((reason) => ({
    number: String(reason.number).padStart(2, "0"),
    title: reason.title,
    description: reason.description,
  }));
  const careerGroups = course.careerPathways.map((pathway) => ({
    number: String(pathway.number).padStart(2, "0"),
    title: pathway.title,
    image: pathway.image,
    roles: pathway.roles.map((role) => role.role),
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-950">
          Private preview. This content is not being published by previewing it.
        </p>
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-900 hover:underline"
          href={`/admin/courses/${course.id}/edit`}
        >
          <ArrowLeft aria-hidden className="size-4" /> Return to editor
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <CourseHero
          breadcrumbItems={[
            { label: "Courses", href: "/courses" },
            { label: course.name },
          ]}
          heading={course.name}
          image={course.heroImage ?? ""}
          programmeLabel={`${course.degree} Programme`}
          tagline={course.tagline ?? ""}
        />
        <CourseOverview
          heading={course.name}
          paragraphs={[
            {
              content:
                course.description || "No course overview has been entered.",
            },
          ]}
        />
        <CurriculumExplorer
          intro="Preview of the saved learning modules."
          slides={slides}
          title="Learning modules"
        />
        <OpportunityAreas
          data={course.opportunities.map((opportunity) => opportunity.title)}
          title="Opportunities"
        />
        <WhyStudy
          heading={`Why study ${course.name}`}
          reasons={reasons}
          label="Why study"
          intro="Preview of saved course reasons."
        />
        <CareerPathways
          careerGroups={careerGroups}
          careerIntro="Preview of saved career pathways."
          careerTitle="Career pathways"
        />
      </div>
    </div>
  );
}
