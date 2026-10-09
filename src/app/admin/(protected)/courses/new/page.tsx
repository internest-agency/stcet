import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseEditor from "@/src/components/admin/courses/CourseEditor";
import { createCourse } from "@/src/app/admin/(protected)/courses/actions";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function messageFor(error: string | undefined) {
  if (error === "duplicate")
    return "That slug is already in use. Choose a unique slug.";
  if (error === "invalid")
    return "Review the required fields and make sure ordered item numbers are valid.";
  if (error === "image")
    return "Choose an existing STCET image or upload an image before saving.";
  if (error)
    return "The course could not be saved. Check the database and try again.";
  return undefined;
}

export default async function NewCoursePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700"
        href="/admin/courses"
      >
        <ArrowLeft aria-hidden className="size-4" /> Back to courses
      </Link>
      <div>
        <p className="text-sm font-semibold text-primary-700">
          Course management
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-950">Create course</h2>
        <p className="mt-2 text-sm text-gray-600">
          Save a draft first, then publish it when the public content is ready.
        </p>
      </div>
      <CourseEditor
        action={createCourse}
        canPublish={isAdministrator(admin)}
        error={messageFor(scalar(params.error))}
      />
    </div>
  );
}
