import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";

export const runtime = "nodejs";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return new NextResponse("Database unconfigured", { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const where: Prisma.ContactMessageWhereInput = {};

  if (status && status !== "All") {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.createdAt.gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { subject: { contains: search } },
      { message: { contains: search } },
    ];
  }

  const prisma = getPrismaClient();
  const records = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "ID",
    "Status",
    "Name",
    "Email",
    "Phone",
    "Subject",
    "Message",
    "Admin Notes",
    "Client IP",
    "Submitted At",
  ];

  const rows = records.map((r) => [
    r.id,
    r.status,
    r.name,
    r.email,
    r.phone,
    r.subject,
    r.message,
    r.adminNotes || "",
    r.clientIp,
    r.createdAt.toISOString(),
  ]);

  const csvContent = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ].join("\r\n");

  const today = new Date().toISOString().split("T")[0];

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="stcet-contact-messages-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
