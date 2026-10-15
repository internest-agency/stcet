"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAdministrator,
  requireAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";
import { sanitizeHtml } from "@/src/lib/content/html";
import { Prisma } from "@/src/generated/prisma/client";
import {
  admissionsIntroSchema,
  admissionRouteSchema,
  tneaCounsellingSchema,
  managementQuotaSchema,
  admissionDocumentSchema,
  importantNoticeSchema,
  applicationLinkSchema,
  admissionContactSchema,
  collectFieldErrors,
} from "@/src/lib/admin/admissions-validation";
import type { TNEAStepFormState } from "@/src/lib/admin/admissions-validation";

function refresh() {
  revalidatePath("/admin/admissions");
  revalidatePath("/admissions");
  revalidatePath("/");
}

export async function saveAdmissionsIntro(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = admissionsIntroSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || null,
    description: formData.get("description") || null,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.admissionsIntro.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.admissionsIntro.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "AdmissionsIntro",
        entityId: String(id || "new"),
        details: { title: parsed.data.title },
      },
    });
  } catch (error) {
    console.error("Save admissions intro failed:", error);
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=intro");
}

export async function saveAdmissionRoute(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = admissionRouteSchema.safeParse({
    number: formData.get("number") || null,
    title: formData.get("title"),
    description: formData.get("description") || null,
    imagePath: formData.get("imagePath") || null,
    linkHref: formData.get("linkHref") || null,
    linkText: formData.get("linkText") || null,
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.admissionRoute.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.admissionRoute.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "AdmissionRoute",
        entityId: String(id || "new"),
        details: { title: parsed.data.title },
      },
    });
  } catch (error) {
    console.error("Save admission route failed:", error);
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=route");
}

export async function deleteAdmissionRoute(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!id || !Number.isSafeInteger(id)) redirect("/admin/admissions?error=invalid");

  const prisma = getPrismaClient();
  try {
    await prisma.admissionRoute.delete({ where: { id } });
    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "AdmissionRoute",
        entityId: String(id),
      },
    });
  } catch {
    redirect("/admin/admissions?error=delete");
  }

  refresh();
  redirect("/admin/admissions?deleted=route");
}

function parseInstructionList(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function errorCodeOf(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

function safeJsonForLog(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Builds a single-line, log-safe description of a save failure. Kept as a
 * string so dev loggers cannot collapse the details into `{}`, which is what
 * previously hid the real Prisma error from the server logs.
 */
function compactErrorForLog(error: unknown): string {
  if (error instanceof Error) {
    const code = errorCodeOf(error);
    const meta = (error as { meta?: unknown }).meta;
    return [
      error.constructor?.name ?? "Error",
      code ? `code=${code}` : null,
      meta !== undefined ? `meta=${safeJsonForLog(meta)}` : null,
      `message=${error.message.replace(/\s+/g, " ").trim()}`,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return `non-error=${safeJsonForLog(error)}`;
}

/**
 * Maps a thrown error to a safe, stable code plus an admin-facing message.
 * Detailed diagnostics (class, Prisma code, meta) stay in the server log;
 * public clients never receive SQL, stack traces, or credentials.
 */
function describeTneaSaveError(error: unknown): {
  code: string;
  message: string;
} {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          code: "DUPLICATE_RECORD",
          message:
            "Another TNEA step already uses these details. Change them and try again.",
        };
      case "P2025":
        return {
          code: "STEP_NOT_FOUND",
          message:
            "This TNEA step no longer exists. Close the form, refresh the page, and try again.",
        };
      case "P2003":
        return {
          code: "INVALID_REFERENCE",
          message:
            "The TNEA step could not be saved because it references a record that no longer exists.",
        };
      default:
        return {
          code: `DB_${error.code}`,
          message:
            "The TNEA step could not be saved because of a database error. Please try again, and contact support if the problem continues.",
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      code: "SCHEMA_MISMATCH",
      message:
        "The server could not save the TNEA step because its data does not match the database schema. Restart the server and try again.",
    };
  }

  const code = errorCodeOf(error);
  if (
    code === "45028" ||
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === "P1001" ||
    code === "P1002" ||
    code === "P2024"
  ) {
    return {
      code: "DB_UNAVAILABLE",
      message:
        "The database is temporarily unavailable. Please try again in a moment.",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message:
      "The TNEA step could not be saved. Please check the details and try again.",
  };
}

export async function saveTNEAStep(
  _previousState: TNEAStepFormState,
  formData: FormData,
): Promise<TNEAStepFormState> {
  const admin = await requireAdmin();

  const parsed = tneaCounsellingSchema.safeParse({
    stepNumber: formData.get("stepNumber"),
    title: formData.get("title"),
    description: formData.get("description") || null,
    instructions: parseInstructionList(formData.get("instructions")),
    imagePath: formData.get("imagePath") || null,
    imageLabel: formData.get("imageLabel") || null,
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return {
      formError: "Review the highlighted fields and try again.",
      fieldErrors: collectFieldErrors(parsed.error),
    };
  }

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.tNEACounselling.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.tNEACounselling.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "TNEACounselling",
        entityId: String(id || "new"),
        details: {
          stepNumber: parsed.data.stepNumber,
          title: parsed.data.title,
          instructionCount: parsed.data.instructions.length,
        },
      },
    });
  } catch (error) {
    const { code, message } = describeTneaSaveError(error);
    console.error(
      `[tnea] save failed operation=${id ? "update" : "create"} stepId=${
        id || "new"
      } code=${code} ${compactErrorForLog(error)}`,
    );
    return { formError: message, code, fieldErrors: {} };
  }

  refresh();
  redirect("/admin/admissions?saved=tnea");
}

export async function deleteTNEAStep(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!id || !Number.isSafeInteger(id)) redirect("/admin/admissions?error=invalid");

  const prisma = getPrismaClient();
  try {
    await prisma.tNEACounselling.delete({ where: { id } });
    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "TNEACounselling",
        entityId: String(id),
      },
    });
  } catch {
    redirect("/admin/admissions?error=delete");
  }

  refresh();
  redirect("/admin/admissions?deleted=tnea");
}

export async function saveManagementQuota(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const eligibilityRaw = formData.get("eligibility");
  const eligibility =
    typeof eligibilityRaw === "string" ? sanitizeHtml(eligibilityRaw) : null;
  const parsed = managementQuotaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    eligibility: eligibility || null,
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.managementQuotaInfo.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.managementQuotaInfo.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "ManagementQuotaInfo",
        entityId: String(id || "new"),
        details: { title: parsed.data.title },
      },
    });
  } catch {
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=quota");
}

export async function saveAdmissionDocument(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = admissionDocumentSchema.safeParse({
    category: formData.get("category") || null,
    title: formData.get("title"),
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.admissionDocuments.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.admissionDocuments.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "AdmissionDocuments",
        entityId: String(id || "new"),
        details: { title: parsed.data.title },
      },
    });
  } catch {
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=document");
}

export async function deleteAdmissionDocument(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!id || !Number.isSafeInteger(id)) redirect("/admin/admissions?error=invalid");

  const prisma = getPrismaClient();
  try {
    await prisma.admissionDocuments.delete({ where: { id } });
    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "AdmissionDocuments",
        entityId: String(id),
      },
    });
  } catch {
    redirect("/admin/admissions?error=delete");
  }

  refresh();
  redirect("/admin/admissions?deleted=document");
}

export async function saveImportantNotice(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = importantNoticeSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    linkUrl: formData.get("linkUrl") || null,
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.importantNotices.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.importantNotices.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "ImportantNotices",
        entityId: String(id || "new"),
        details: { title: parsed.data.title },
      },
    });
  } catch {
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=notice");
}

export async function deleteImportantNotice(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!id || !Number.isSafeInteger(id)) redirect("/admin/admissions?error=invalid");

  const prisma = getPrismaClient();
  try {
    await prisma.importantNotices.delete({ where: { id } });
    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "ImportantNotices",
        entityId: String(id),
      },
    });
  } catch {
    redirect("/admin/admissions?error=delete");
  }

  refresh();
  redirect("/admin/admissions?deleted=notice");
}

export async function saveApplicationLink(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = applicationLinkSchema.safeParse({
    name: formData.get("name"),
    url: formData.get("url"),
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.applicationLink.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.applicationLink.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "ApplicationLink",
        entityId: String(id || "new"),
        details: { name: parsed.data.name },
      },
    });
  } catch {
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=link");
}

export async function deleteApplicationLink(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!id || !Number.isSafeInteger(id)) redirect("/admin/admissions?error=invalid");

  const prisma = getPrismaClient();
  try {
    await prisma.applicationLink.delete({ where: { id } });
    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "ApplicationLink",
        entityId: String(id),
      },
    });
  } catch {
    redirect("/admin/admissions?error=delete");
  }

  refresh();
  redirect("/admin/admissions?deleted=link");
}

export async function saveAdmissionContact(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = admissionContactSchema.safeParse({
    title: formData.get("title"),
    value: formData.get("value"),
    contactType: formData.get("contactType") || null,
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) redirect("/admin/admissions?error=invalid");

  const id = Number(formData.get("id"));
  const prisma = getPrismaClient();

  try {
    if (id && Number.isSafeInteger(id) && id > 0) {
      await prisma.admissionContact.update({
        where: { id },
        data: parsed.data,
      });
    } else {
      await prisma.admissionContact.create({
        data: parsed.data,
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: id ? "update" : "create",
        entityType: "AdmissionContact",
        entityId: String(id || "new"),
        details: { title: parsed.data.title },
      },
    });
  } catch {
    redirect("/admin/admissions?error=save");
  }

  refresh();
  redirect("/admin/admissions?saved=contact");
}

export async function deleteAdmissionContact(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!id || !Number.isSafeInteger(id)) redirect("/admin/admissions?error=invalid");

  const prisma = getPrismaClient();
  try {
    await prisma.admissionContact.delete({ where: { id } });
    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "AdmissionContact",
        entityId: String(id),
      },
    });
  } catch {
    redirect("/admin/admissions?error=delete");
  }

  refresh();
  redirect("/admin/admissions?deleted=contact");
}
