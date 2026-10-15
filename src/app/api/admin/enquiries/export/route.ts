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
  const course = searchParams.get("course") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const where: Prisma.EnquiryWhereInput = {};

  if (status && status !== "All") {
    where.status = status;
  }

  if (course && course !== "All") {
    where.OR = [
      { coursePreference1: { contains: course } },
      { coursePreference2: { contains: course } },
      { coursePreference3: { contains: course } },
    ];
  }

  if (startDate || endDate) {
    where.submittedAt = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.submittedAt.gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.submittedAt.lte = end;
    }
  }

  if (search) {
    const searchConditions: Prisma.EnquiryWhereInput[] = [
      { studentName: { contains: search } },
      { studentEmail: { contains: search } },
      { studentMobile: { contains: search } },
      { enquiryNumber: { contains: search } },
      { parentName: { contains: search } },
    ];

    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchConditions }];
      delete where.OR;
    } else {
      where.OR = searchConditions;
    }
  }

  const prisma = getPrismaClient();
  const records = await prisma.enquiry.findMany({
    where,
    orderBy: { submittedAt: "desc" },
  });

  const headers = [
    "Enquiry Number",
    "Status",
    "Student Name",
    "Date of Birth",
    "Student Mobile",
    "Student Email",
    "Category",
    "Hostel Required",
    "Transport Required",
    "Parent Name",
    "Occupation",
    "Parent Mobile",
    "Parent Email",
    "Annual Income",
    "Address",
    "10th School",
    "10th Board",
    "10th Marks",
    "12th School",
    "12th Board",
    "Maths Marks",
    "Physics Marks",
    "Chemistry Marks",
    "MPC %",
    "TNEA Counselling",
    "Course Preference 1",
    "Course Preference 2",
    "Course Preference 3",
    "Course Preference 4",
    "Course Preference 5",
    "Source",
    "Admin Notes",
    "Client IP",
    "Submitted At",
  ];

  const rows = records.map((r) => [
    r.enquiryNumber,
    r.status,
    r.studentName,
    r.dateOfBirth,
    r.studentMobile,
    r.studentEmail,
    r.category,
    r.hostelRequired,
    r.transportRequired,
    r.parentName,
    r.occupation,
    r.parentMobile,
    r.parentEmail,
    r.annualIncome,
    r.address,
    r.tenthSchool,
    r.tenthBoard,
    r.tenthMarks,
    r.twelfthSchool,
    r.twelfthBoard,
    r.mathsMarks,
    r.physicsMarks,
    r.chemistryMarks,
    r.mpcPercentage,
    r.tneaCounselling,
    r.coursePreference1,
    r.coursePreference2,
    r.coursePreference3,
    r.coursePreference4,
    r.coursePreference5,
    r.howDidYouKnow,
    r.adminNotes || "",
    r.clientIp,
    r.submittedAt.toISOString(),
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
      "Content-Disposition": `attachment; filename="stcet-enquiries-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
