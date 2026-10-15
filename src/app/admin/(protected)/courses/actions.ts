"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAdministrator,
  requireAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import { courseEditorSchema, collectFieldErrors } from "@/src/lib/admin/course-validation";
import type {
  CourseEditorInput,
  CourseFormState,
} from "@/src/lib/admin/course-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { sanitizeHtml } from "@/src/lib/content/html";
import { getPrismaClient } from "@/src/lib/prisma";

const COURSE_HTML_FIELDS = [
  "description",
  "overviewKeyStatement",
  "curriculumIntro",
  "whyStudyIntro",
  "careerIntro",
] as const;

function sanitizeHtmlValue(value: unknown): unknown {
  return typeof value === "string" ? sanitizeHtml(value) : value;
}

function sanitizeRecordArray(value: unknown, field: string): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((row) => {
    if (typeof row !== "object" || row === null) return row;
    const record = row as Record<string, unknown>;
    return { ...record, [field]: sanitizeHtmlValue(record[field]) };
  });
}

/**
 * Strip dangerous markup from every rich-text field before validation and
 * storage. Sanitizing first means the length/required checks below evaluate the
 * content that will actually be persisted.
 */
function sanitizeCoursePayload(value: unknown): unknown {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return value;
  }
  const record = value as Record<string, unknown>;
  const next: Record<string, unknown> = { ...record };
  for (const field of COURSE_HTML_FIELDS) {
    next[field] = sanitizeHtmlValue(record[field]);
  }
  next.modules = sanitizeRecordArray(record.modules, "description");
  next.reasons = sanitizeRecordArray(record.reasons, "description");
  next.futurePaths = sanitizeRecordArray(record.futurePaths, "description");
  return next;
}

type CourseParseResult =
  | { ok: true; data: CourseEditorInput }
  | { ok: false; formError: string; fieldErrors: Record<string, string> };

async function readCourse(formData: FormData): Promise<CourseParseResult> {
  const raw = formData.get("content");
  if (typeof raw !== "string") {
    return {
      ok: false,
      formError: "The submitted course details were invalid.",
      fieldErrors: {},
    };
  }
  if (raw.length > 900_000) {
    return {
      ok: false,
      formError: "The course details are too large to save.",
      fieldErrors: {},
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      formError: "The submitted course details were invalid.",
      fieldErrors: {},
    };
  }

  const result = courseEditorSchema.safeParse(sanitizeCoursePayload(parsed));
  if (!result.success) {
    return {
      ok: false,
      formError: "Review the highlighted fields and try again.",
      fieldErrors: collectFieldErrors(result.error),
    };
  }

  return { ok: true, data: result.data };
}

async function replaceChildren(
  transaction: Prisma.TransactionClient,
  courseId: number,
  content: CourseEditorInput,
) {
  await transaction.courseModule.deleteMany({ where: { courseId } });
  await transaction.courseOpportunity.deleteMany({ where: { courseId } });
  await transaction.courseReason.deleteMany({ where: { courseId } });
  await transaction.careerPathway.deleteMany({ where: { courseId } });
  await transaction.futurePath.deleteMany({ where: { courseId } });

  if (content.modules.length) {
    await transaction.courseModule.createMany({
      data: content.modules.map((module, sortOrder) => ({
        courseId,
        number: module.number,
        title: module.title,
        description: module.description,
        image: module.image,
        sortOrder,
      })),
    });
  }

  if (content.opportunities.length) {
    await transaction.courseOpportunity.createMany({
      data: content.opportunities.map((opportunity, sortOrder) => ({
        courseId,
        title: opportunity.title,
        sortOrder,
      })),
    });
  }

  if (content.reasons.length) {
    await transaction.courseReason.createMany({
      data: content.reasons.map((reason, sortOrder) => ({
        courseId,
        number: reason.number,
        title: reason.title,
        description: reason.description,
        sortOrder,
      })),
    });
  }

  for (const [sortOrder, pathway] of content.careerPathways.entries()) {
    await transaction.careerPathway.create({
      data: {
        courseId,
        number: pathway.number,
        title: pathway.title,
        image: pathway.image,
        sortOrder,
        roles: {
          create: pathway.roles.map((role, roleOrder) => ({
            role,
            sortOrder: roleOrder,
          })),
        },
      },
    });
  }

  if (content.futurePaths.length) {
    await transaction.futurePath.createMany({
      data: content.futurePaths.map((futurePath, sortOrder) => ({
        courseId,
        number: futurePath.number,
        title: futurePath.title,
        description: futurePath.description,
        sortOrder,
      })),
    });
  }
}

function courseImageReferences(
  content: CourseEditorInput,
) {
  return [
    content.heroImage,
    content.ogImage,
    ...content.modules.map((module) => module.image),
    ...content.careerPathways.map((pathway) => pathway.image),
  ].filter(Boolean);
}

function existingCourseImageReferences(course: {
  heroImage: string | null;
  ogImage: string | null;
  modules: { image: string }[];
  careerPathways: { image: string }[];
}) {
  return [
    course.heroImage,
    course.ogImage,
    ...course.modules.map((module) => module.image),
    ...course.careerPathways.map((pathway) => pathway.image),
  ].filter((image): image is string => Boolean(image));
}

function courseData(
  content: CourseEditorInput,
  isPublished: boolean,
) {
  return {
    name: content.name,
    slug: content.slug,
    degree: content.degree,
    tagline: content.tagline || null,
    description: content.description || null,
    heroImage: content.heroImage || null,
    overviewHeading: content.overviewHeading || null,
    overviewKeyStatement: content.overviewKeyStatement || null,
    curriculumTitle: content.curriculumTitle || null,
    curriculumIntro: content.curriculumIntro || null,
    opportunityTitle: content.opportunityTitle || null,
    whyStudyLabel: content.whyStudyLabel || null,
    whyStudyHeading: content.whyStudyHeading || null,
    whyStudyIntro: content.whyStudyIntro || null,
    careerTitle: content.careerTitle || null,
    careerIntro: content.careerIntro || null,
    seoTitle: content.seoTitle || null,
    metaDescription: content.metaDescription || null,
    canonicalUrl: content.canonicalUrl || null,
    ogImage: content.ogImage || null,
    noIndex: content.noIndex,
    isPublished,
  };
}

function isDuplicateError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function isDuplicateSlugError(error: unknown) {
  if (!isDuplicateError(error)) return false;
  const target = (error as Prisma.PrismaClientKnownRequestError).meta?.target;
  const fields = Array.isArray(target)
    ? target.map(String)
    : typeof target === "string"
      ? [target]
      : [];
  return fields.includes("slug");
}

function courseSaveFailure(error: unknown): CourseFormState {
  if (isDuplicateSlugError(error)) {
    return {
      fieldErrors: {
        slug: "That slug is already in use. Choose a unique slug.",
      },
    };
  }
  if (isDuplicateError(error)) {
    return {
      formError:
        "Some entries conflict with records that already exist. Review the ordered item numbers and try saving again.",
      fieldErrors: {},
    };
  }
  return {
    formError:
      "The course could not be saved. Check the database and try again.",
    fieldErrors: {},
  };
}

function redactSensitiveText(value: string) {
  return value.replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s"']+/gi, "<redacted>");
}

function logCourseSaveError(
  context: { operation: "create" | "update"; courseId?: number },
  content: CourseEditorInput,
  error: unknown,
) {
  let kind = "unknown";
  let detail: string | null = null;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    kind = `prisma-known:${error.code}`;
    detail = error.message;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    kind = "prisma-validation";
    detail = error.message;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    kind = "prisma-init";
    detail = error.message;
  } else if (error instanceof Error) {
    kind = error.name;
    detail = error.message;
  }
  console.error(`[courses] ${context.operation} failed`, {
    courseId: context.courseId,
    slug: content.slug,
    name: content.name,
    kind,
    detail: detail ? redactSensitiveText(detail) : null,
  });
}

function revalidateCoursePaths(slug: string) {
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${slug}`);
  revalidatePath("/");
}

export async function createCourse(
  _previousState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const admin = await requireAdmin();
  const parsed = await readCourse(formData);
  if (!parsed.ok) {
    return { formError: parsed.formError, fieldErrors: parsed.fieldErrors };
  }
  const content = parsed.data;

  if (!(await validateImageReferences(courseImageReferences(content)))) {
    return {
      formError:
        "Choose an existing STCET image or upload an image before saving.",
      fieldErrors: {},
    };
  }

  let createdId: number;
  const isPublished = isAdministrator(admin) && content.isPublished;

  try {
    const course = await getPrismaClient().$transaction(async (transaction) => {
      const created = await transaction.course.create({
        data: courseData(content, isPublished),
      });
      await replaceChildren(transaction, created.id, content);
      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: isPublished ? "create_publish" : "create",
          entityType: "Course",
          entityId: String(created.id),
          details: { name: created.name, slug: created.slug, isPublished },
        },
      });
      return created;
    });
    createdId = course.id;
    revalidateCoursePaths(course.slug);
  } catch (error) {
    logCourseSaveError({ operation: "create" }, content, error);
    await cleanupUnreferencedUploads(courseImageReferences(content));
    return courseSaveFailure(error);
  }

  redirect(`/admin/courses/${createdId}/edit?saved=1`);
}

export async function updateCourse(
  _previousState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get("courseId"));
  const parsed = await readCourse(formData);
  if (!Number.isSafeInteger(id) || id <= 0) {
    redirect("/admin/courses?error=invalid");
  }
  if (!parsed.ok) {
    return { formError: parsed.formError, fieldErrors: parsed.fieldErrors };
  }
  const content = parsed.data;

  const prisma = getPrismaClient();
  const previous = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      name: true,
      isPublished: true,
      heroImage: true,
      ogImage: true,
      modules: { select: { image: true } },
      careerPathways: { select: { image: true } },
    },
  });
  if (!previous) redirect("/admin/courses?error=missing");
  if (!isAdministrator(admin) && previous.isPublished) {
    redirect("/admin/courses?error=forbidden");
  }

  const previousImages = existingCourseImageReferences(previous);
  const newImages = courseImageReferences(content).filter(
    (image) => !previousImages.includes(image),
  );
  if (
    !(await validateImageReferences(
      courseImageReferences(content),
      previousImages,
    ))
  ) {
    return {
      formError:
        "Choose an existing STCET image or upload an image before saving.",
      fieldErrors: {},
    };
  }

  const isPublished = isAdministrator(admin) ? content.isPublished : false;

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.course.update({
        where: { id },
        data: courseData(content, isPublished),
      });
      await replaceChildren(transaction, id, content);
      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action:
            previous.isPublished === isPublished
              ? "update"
              : isPublished
                ? "publish"
                : "unpublish",
          entityType: "Course",
          entityId: String(id),
          details: { name: content.name, slug: content.slug, isPublished },
        },
      });
    });
  } catch (error) {
    logCourseSaveError({ operation: "update", courseId: id }, content, error);
    await cleanupUnreferencedUploads(newImages);
    return courseSaveFailure(error);
  }

  revalidateCoursePaths(previous.slug);
  revalidateCoursePaths(content.slug);
  await cleanupUnreferencedUploads(
    previousImages.filter(
      (image) => !courseImageReferences(content).includes(image),
    ),
  );
  redirect(`/admin/courses/${id}/edit?saved=1`);
}

export async function deleteCourse(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("courseId"));
  if (!Number.isSafeInteger(id) || id <= 0)
    redirect("/admin/courses?error=invalid");

  const prisma = getPrismaClient();
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: { select: { image: true } },
      careerPathways: { select: { image: true } },
    },
  });
  if (!course) redirect("/admin/courses?error=missing");
  const previousImages = existingCourseImageReferences(course);

  await prisma.$transaction(async (transaction) => {
    await transaction.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "Course",
        entityId: String(id),
        details: {
          name: course.name,
          slug: course.slug,
          isPublished: course.isPublished,
        },
      },
    });
    await transaction.course.delete({ where: { id } });
  });

  revalidateCoursePaths(course.slug);
  await cleanupUnreferencedUploads(previousImages);
  redirect("/admin/courses?deleted=1");
}
