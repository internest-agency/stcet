"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAdministrator,
  requireAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import { courseEditorSchema } from "@/src/lib/admin/course-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

async function readCourse(formData: FormData) {
  const raw = formData.get("content");
  if (typeof raw !== "string" || raw.length > 900_000) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = courseEditorSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

async function replaceChildren(
  transaction: Prisma.TransactionClient,
  courseId: number,
  content: NonNullable<Awaited<ReturnType<typeof readCourse>>>,
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
  content: NonNullable<Awaited<ReturnType<typeof readCourse>>>,
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
  content: NonNullable<Awaited<ReturnType<typeof readCourse>>>,
  isPublished: boolean,
) {
  return {
    name: content.name,
    slug: content.slug,
    degree: content.degree,
    tagline: content.tagline || null,
    description: content.description || null,
    heroImage: content.heroImage || null,
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

function revalidateCoursePaths(slug: string) {
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${slug}`);
}

export async function createCourse(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const content = await readCourse(formData);
  if (!content) redirect("/admin/courses/new?error=invalid");
  if (!(await validateImageReferences(courseImageReferences(content)))) {
    redirect("/admin/courses/new?error=image");
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
    await cleanupUnreferencedUploads(courseImageReferences(content));
    if (isDuplicateError(error)) redirect("/admin/courses/new?error=duplicate");
    redirect("/admin/courses/new?error=save");
  }

  redirect(`/admin/courses/${createdId}/edit?saved=1`);
}

export async function updateCourse(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const id = Number(formData.get("courseId"));
  const content = await readCourse(formData);
  if (!Number.isSafeInteger(id) || id <= 0 || !content) {
    redirect("/admin/courses?error=invalid");
  }

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
    redirect(`/admin/courses/${id}/edit?error=image`);
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
    await cleanupUnreferencedUploads(newImages);
    if (isDuplicateError(error))
      redirect(`/admin/courses/${id}/edit?error=duplicate`);
    redirect(`/admin/courses/${id}/edit?error=save`);
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
