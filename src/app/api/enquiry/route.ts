import { NextResponse } from "next/server";

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
   Used only to confirm that the API route is available.
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
       READ FORM DATA
    ===================================================== */

    const formData = await request.formData();

    /* =====================================================
       HELPER
    ===================================================== */

    const getString = (key: string): string => {
      const value = formData.get(key);

      if (typeof value !== "string") {
        return "";
      }

      return value.trim();
    };

    /* =====================================================
       COLLECT FORM DATA
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

    /*
     * Only 1, 2 and 3 are allowed.
     */

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

    /*
     * Prevent duplicate ranks.
     *
     * Example:
     *
     * CSE     = 1
     * ECE     = 1
     *
     * This is invalid.
     */

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
       GET CLIENT IP
    ===================================================== */

    const forwardedFor = request.headers.get("x-forwarded-for");

    const realIp = request.headers.get("x-real-ip");

    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    /* =====================================================
       GENERATE ENQUIRY NUMBER
    ===================================================== */

    const now = new Date();

    const year = now.getFullYear();

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const enquiryNumber = `STCET-${year}-${randomNumber}`;

    /* =====================================================
       SUBMISSION TIME
    ===================================================== */

    const submittedAt = now.toISOString();

    /* =====================================================
       PREPARE APPLICATION
    ===================================================== */

    const enquiry = {
      enquiryNumber,
      submittedAt,
      clientIp,

      student: {
        name: data.studentName,
        dateOfBirth: data.dateOfBirth,
        mobile: cleanStudentMobile,
        email: data.studentEmail,
        category: data.category,
        hostelRequired: data.hostelRequired,
        transportRequired: data.transportRequired,
      },

      parent: {
        name: data.parentName,
        occupation: data.occupation,
        mobile: cleanParentMobile,
        email: data.parentEmail,
        annualIncome: data.annualIncome,
        address: data.address,
      },

      academic: {
        tenth: {
          school: data.tenthSchool,
          board: data.tenthBoard,
          marks: data.tenthMarks,
        },

        twelfth: {
          school: data.twelfthSchool,
          board: data.twelfthBoard,
          mathsMarks: data.mathsMarks,
          physicsMarks: data.physicsMarks,
          chemistryMarks: data.chemistryMarks,
          mpcPercentage: data.mpcPercentage,
          tneaCounselling: data.tneaCounselling,
        },
      },

      coursePreferences: {
        "B.E. CSE": data.coursePreference1,
        "B.E. CSE (AI+ML)": data.coursePreference2,
        "B.E. ECE": data.coursePreference3,
        "B.E. EEE": data.coursePreference4,
        "B.Tech. IT": data.coursePreference5,
      },

      source: data.howDidYouKnow,
    };

    /* =====================================================
       PROCESS ENQUIRY
    ===================================================== */

    /*
     * IMPORTANT
     *
     * This is the point where the enquiry should be
     * permanently stored or sent to another service.
     *
     * Examples:
     *
     * 1. Database
     * 2. Google Sheets
     * 3. Email
     * 4. CRM
     * 5. WhatsApp / SMS
     *
     * Example:
     *
     * await db.enquiry.create({
     *   data: enquiry
     * });
     *
     * Do NOT expose sensitive information to the browser.
     */

    console.log("==========================================");

    console.log("NEW STCET ENQUIRY");

    console.log("==========================================");

    console.log(JSON.stringify(enquiry, null, 2));

    console.log("==========================================");

    /* =====================================================
       SUCCESS RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message: "Your enquiry has been submitted successfully.",

        enquiryNumber,

        submittedAt,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /* =====================================================
       SERVER ERROR
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
