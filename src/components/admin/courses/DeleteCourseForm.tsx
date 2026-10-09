"use client";

import { Trash2 } from "lucide-react";
import { deleteCourse } from "@/src/app/admin/(protected)/courses/actions";

export default function DeleteCourseForm({
  courseId,
  courseName,
}: {
  courseId: number;
  courseName: string;
}) {
  return (
    <form
      action={deleteCourse}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete "${courseName}" and all its course content? This cannot be undone.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="courseId" type="hidden" value={courseId} />
      <button
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        type="submit"
      >
        <Trash2 aria-hidden className="size-4" /> Delete course
      </button>
    </form>
  );
}
