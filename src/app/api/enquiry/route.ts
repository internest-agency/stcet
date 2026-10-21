import { NextResponse } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { sendEnquiryNotification } from "@/src/lib/zeptomail";

export const runtime = "nodejs";

/* =========================================================
   TYPES
========================================================= */

type EnquiryData = {
  studentName: string;
  dateOfBirth: string;
  studentMobile: string;
  studentEmail: string;

  category: string;
  hostelRequired: string;
  transportRequired: string;

  parentName: string;
  occupation: string;
  parentMobile: string;
  parentEmail: string;
  annualIncome: string;
  address: string;

  tenthSchool: string;
  tenthBoard: string;
  tenthMarks: string;

  twelfthSchool: string;
  twelfthBoard: string;
  mathsMarks: string;
  physicsMarks: string;
  chemistryMarks: string;
  mpcPercentage: string;
  tneaCounselling: string;

  coursePreference1: string;
  coursePreference2: string;
  coursePreference3: string;
  coursePreference4: string;
  coursePreference5: string;

  howDidYouKnow: string;
};

/* =========================================================
   GET
   Used to confirm that the API route is available and healthy.
========================================================= */

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message:
        "STCET Enquiry API is working. Submit the enquiry form using POST.",
    },
    {
      status: 200,
    },
  );
}

/* =========================================================
   POST
========================================================= */

export async function POST(request: Request) {
  try {
    /* =====================================================
       PARSE INCOMING REQUEST (FormData or JSON)
    ===================================================== */

    const contentType = request.headers.get("content-type") || "";
    const rawData: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      try {
        const json = await request.json();
        if (json && typeof json === "object") {
          for (const [key, value] of Object.entries(json)) {
            rawData[key] =
              typeof value === "string" ? value.trim() : String(value ?? "").trim();
          }
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid JSON payload provided.",
          },
          {
            status: 400,
          },
        );
      }
    } else {
      try {
        const formData = await request.formData();
        for (const [key, value] of formData.entries()) {
          if (typeof value === "string") {
            rawData[key] = value.trim();
          }
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid form data payload provided.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const getString = (key: string): string => rawData[key] ?? "";

    /* =====================================================
       COLLECT DATA
    ===================================================== */

    const data: EnquiryData = {
      /* Student */
      studentName: getString("studentName"),
      dateOfBirth: getString("dateOfBirth"),
      studentMobile: getString("studentMobile"),
      studentEmail: getString("studentEmail"),

      category: getString("category"),
      hostelRequired: getString("hostelRequired"),
      transportRequired: getString("transportRequired"),

      /* Parent */
      parentName: getString("parentName"),
      occupation: getString("occupation"),
      parentMobile: getString("parentMobile"),
      parentEmail: getString("parentEmail"),
      annualIncome: getString("annualIncome"),
      address: getString("address"),

      /* 10th */
      tenthSchool: getString("tenthSchool"),
      tenthBoard: getString("tenthBoard"),
      tenthMarks: getString("tenthMarks"),

      /* 12th */
      twelfthSchool: getString("twelfthSchool"),
      twelfthBoard: getString("twelfthBoard"),
      mathsMarks: getString("mathsMarks"),
      physicsMarks: getString("physicsMarks"),
      chemistryMarks: getString("chemistryMarks"),
      mpcPercentage: getString("mpcPercentage"),
      tneaCounselling: getString("tneaCounselling"),

      /* Course preferences */
      coursePreference1: getString("coursePreference1"),
      coursePreference2: getString("coursePreference2"),
      coursePreference3: getString("coursePreference3"),
      coursePreference4: getString("coursePreference4"),
      coursePreference5: getString("coursePreference5"),

      /* Source */
      howDidYouKnow: getString("howDidYouKnow"),
    };

    /* =====================================================
       REQUIRED FIELD VALIDATION
    ===================================================== */

    const requiredFields: Array<[keyof EnquiryData, string]> = [
      ["studentName", "Student name"],
      ["dateOfBirth", "Date of birth"],
      ["studentMobile", "Student mobile number"],
      ["studentEmail", "Student email"],
      ["parentName", "Parent / Guardian name"],
      ["parentMobile", "Parent mobile number"],
    ];

    const missingFields = requiredFields
      .filter(([field]) => !data[field])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Please complete the following required fields: ${missingFields.join(
            ", ",
          )}.`,
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.studentEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid student email address.",
        },
        {
          status: 400,
        },
      );
    }

    if (data.parentEmail && !emailRegex.test(data.parentEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid parent email address.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       MOBILE VALIDATION
    ===================================================== */

    const cleanStudentMobile = data.studentMobile.replace(/\D/g, "");
    const cleanParentMobile = data.parentMobile.replace(/\D/g, "");

    if (cleanStudentMobile.length < 10 || cleanStudentMobile.length > 15) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid student mobile number.",
        },
        {
          status: 400,
        },
      );
    }

    if (cleanParentMobile.length < 10 || cleanParentMobile.length > 15) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid parent mobile number.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       COURSE PREFERENCE VALIDATION
    ===================================================== */

    const coursePreferences = [
      data.coursePreference1,
      data.coursePreference2,
      data.coursePreference3,
      data.coursePreference4,
      data.coursePreference5,
    ];

    const selectedRanks = coursePreferences.filter(Boolean);

    const invalidRank = selectedRanks.find(
      (rank) => !["1", "2", "3"].includes(rank),
    );

    if (invalidRank) {
      return NextResponse.json(
        {
          success: false,
          message: "Course preferences can only use ranks 1, 2 or 3.",
        },
        {
          status: 400,
        },
      );
    }

    const uniqueRanks = new Set(selectedRanks);

    if (uniqueRanks.size !== selectedRanks.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Each course preference rank can only be used once.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       DATABASE CONFIGURATION CHECK
    ===================================================== */

    if (!isDatabaseConfigured()) {
      console.error(
        "STCET enquiry API error: DATABASE_URL is not configured in environment.",
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "Database service is currently unavailable. Please try again later.",
        },
        {
          status: 503,
        },
      );
    }

    const prisma = getPrismaClient();

    /* =====================================================
       PREVENT DUPLICATE REPEATED SUBMISSIONS
    ===================================================== */

    const recentWindow = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes window
    const existingRecent = await prisma.enquiry.findFirst({
      where: {
        studentMobile: cleanStudentMobile,
        studentEmail: data.studentEmail,
        submittedAt: {
          gte: recentWindow,
        },
      },
      select: {
        enquiryNumber: true,
        submittedAt: true,
      },
    });

    if (existingRecent) {
      return NextResponse.json(
        {
          success: true,
          message: "Your enquiry has already been submitted recently.",
          enquiryNumber: existingRecent.enquiryNumber,
          submittedAt: existingRecent.submittedAt.toISOString(),
          isDuplicate: true,
        },
        {
          status: 200,
        },
      );
    }

    /* =====================================================
       GET CLIENT IP
    ===================================================== */

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    /* =====================================================
       SAVE TO DATABASE (WITH UNIQUE ENQUIRY NUMBER RETRY)
    ===================================================== */

    const currentYear = new Date().getFullYear();
    let savedEnquiry = null;
    let attempts = 0;

    while (!savedEnquiry && attempts < 3) {
      attempts++;
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const enquiryNumber = `STCET-${currentYear}-${randomNumber}`;

      try {
        savedEnquiry = await prisma.enquiry.create({
          data: {
            enquiryNumber,

            studentName: data.studentName,
            dateOfBirth: data.dateOfBirth,
            studentMobile: cleanStudentMobile,
            studentEmail: data.studentEmail,
            category: data.category,
            hostelRequired: data.hostelRequired,
            transportRequired: data.transportRequired,

            parentName: data.parentName,
            occupation: data.occupation,
            parentMobile: cleanParentMobile,
            parentEmail: data.parentEmail,
            annualIncome: data.annualIncome,
            address: data.address,

            tenthSchool: data.tenthSchool,
            tenthBoard: data.tenthBoard,
            tenthMarks: data.tenthMarks,

            twelfthSchool: data.twelfthSchool,
            twelfthBoard: data.twelfthBoard,
            mathsMarks: data.mathsMarks,
            physicsMarks: data.physicsMarks,
            chemistryMarks: data.chemistryMarks,
            mpcPercentage: data.mpcPercentage,
            tneaCounselling: data.tneaCounselling,

            coursePreference1: data.coursePreference1,
            coursePreference2: data.coursePreference2,
            coursePreference3: data.coursePreference3,
            coursePreference4: data.coursePreference4,
            coursePreference5: data.coursePreference5,

            howDidYouKnow: data.howDidYouKnow,
            clientIp,
          },
        });
      } catch (insertError: unknown) {
        if (
          typeof insertError === "object" &&
          insertError !== null &&
          "code" in insertError &&
          (insertError as { code: string }).code === "P2002" &&
          attempts < 3
        ) {
          continue;
        }
        throw insertError;
      }
    }

    if (!savedEnquiry) {
      throw new Error("Failed to generate unique enquiry number after retries.");
    }

// Collect course preferences for notification (already validated above)
    const notificationPreferences = [
      data.coursePreference1,
      data.coursePreference2,
      data.coursePreference3,
      data.coursePreference4,
      data.coursePreference5,
    ].filter(Boolean);

    // Send admin notification (non-blocking, fire-and-forget)
    // Email failure does not affect the user-facing response
    sendEnquiryNotification({
      enquiryNumber: savedEnquiry.enquiryNumber,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentMobile: cleanStudentMobile,
      parentName: data.parentName,
      parentMobile: cleanParentMobile,
      parentEmail: data.parentEmail,
      coursePreferences: notificationPreferences,
      submittedAt: savedEnquiry.submittedAt.toISOString(),
    }).catch((error) => {
      console.error("[Enquiry API] Notification failed:", error);
    });

    /* =====================================================
       SUCCESS RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been submitted successfully.",
        enquiryNumber: savedEnquiry.enquiryNumber,
        submittedAt: savedEnquiry.submittedAt.toISOString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    /* =====================================================
       SERVER ERROR LOGGING & RESPONSE
    ===================================================== */

    console.error("STCET enquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while processing your enquiry. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
}
