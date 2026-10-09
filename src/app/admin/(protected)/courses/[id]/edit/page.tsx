import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import CourseEditor, {
  type CourseEditorValues,
} from "@/src/components/admin/courses/CourseEditor";
import DeleteCourseForm from "@/src/components/admin/courses/DeleteCourseForm";
import { updateCourse } from "@/src/app/admin/(protected)/courses/actions";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminCourseById } from "@/src/lib/queries/admin-courses";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function errorMessage(error: string | undefined) {
  const messages: Record<string, string> = {
    duplicate: "That slug is already in use. Choose a unique slug.",
    invalid: "The submitted course details were invalid.",
    image: "Choose an existing STCET image or upload an image before saving.",
    save: "Course changes could not be saved. Check the database and try again.",
    forbidden:
      "Editors cannot update published courses. Ask an administrator to unpublish it first.",
  };
  return error
    ? (messages[error] ?? "The course operation could not be completed.")
    : undefined;
}

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const [{ id }, query, admin] = await Promise.all([
    params,
    searchParams,
    requireAdmin(),
  ]);
  const courseId = Number(id);
  if (!Number.isSafeInteger(courseId) || courseId <= 0) notFound();

  const course = await getAdminCourseById(courseId);
  if (!course) notFound();

  const initial: CourseEditorValues = {
    name: course.name,
    slug: course.slug,
    degree: course.degree,
    tagline: course.tagline ?? "",
    description: course.description ?? "",
    heroImage: course.heroImage ?? "",
    seoTitle: course.seoTitle ?? "",
    metaDescription: course.metaDescription ?? "",
    canonicalUrl: course.canonicalUrl ?? "",
    ogImage: course.ogImage ?? "",
    noIndex: course.noIndex,
    isPublished: course.isPublished,
    modules: course.modules.map((module) => ({
      number: String(module.number),
      title: module.title,
      description: module.description,
      image: module.image,
    })),
    opportunities: course.opportunities.map(({ title }) => ({ title })),
    reasons: course.reasons.map((reason) => ({
      number: String(reason.number),
      title: reason.title,
      description: reason.description,
    })),
    careerPathways: course.careerPathways.map((pathway) => ({
      number: String(pathway.number),
      title: pathway.title,
      image: pathway.image,
      rolesText: pathway.roles.map(({ role }) => role).join("\n"),
    })),
    futurePaths: course.futurePaths.map((futurePath) => ({
      number: String(futurePath.number),
      title: futurePath.title,
      description: futurePath.description,
    })),
  };
  const canPublish = isAdministrator(admin);

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700"
        href="/admin/courses"
      >
        <ArrowLeft aria-hidden className="size-4" /> Back to courses
      </Link>
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">
            Course management
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Edit course</h2>
          <p className="mt-2 text-sm text-gray-600">
            Changes save together with all ordered course content.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            href={`/admin/courses/${course.id}/preview`}
          >
            <ExternalLink aria-hidden className="size-4" /> Preview
          </Link>
          {course.isPublished ? (
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              href={`/courses/${course.slug}`}
              target="_blank"
            >
              <ExternalLink aria-hidden className="size-4" /> View public page
            </Link>
          ) : null}
        </div>
      </section>

      <CourseEditor
        action={updateCourse}
        canPublish={canPublish}
        courseId={course.id}
        error={errorMessage(scalar(query.error))}
        initial={initial}
        key={course.id}
        saved={Boolean(scalar(query.saved))}
      />

      {canPublish ? (
        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Delete this course
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              All nested course content will be deleted in the same operation.
            </p>
          </div>
          <DeleteCourseForm courseId={course.id} courseName={course.name} />
        </section>
      ) : null}
    </div>
  );
}
