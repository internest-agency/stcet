import { NextResponse } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const runtime = "nodejs";

/* =========================================================
   GET
   Health check to verify API availability
========================================================= */

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "STCET Contact API is operational. Submit messages using POST.",
    },
    {
      status: 200,
    },
  );
}

/* =========================================================
   POST
   Handles contact form submissions
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

    const name = rawData.name ?? "";
    const email = rawData.email ?? "";
    const phone = rawData.phone ?? "";
    const subject = rawData.subject ?? "";
    const message = rawData.message ?? "";

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name || !email || !phone || !subject || !message) {
      const missing: string[] = [];
      if (!name) missing.push("Full Name");
      if (!email) missing.push("Email Address");
      if (!phone) missing.push("Phone Number");
      if (!subject) missing.push("Subject");
      if (!message) missing.push("Message");

      return NextResponse.json(
        {
          success: false,
          message: `Please complete all required fields: ${missing.join(", ")}.`,
        },
        {
          status: 400,
        },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number (10 to 15 digits).",
        },
        {
          status: 400,
        },
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Message must be at least 5 characters long.",
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
        "STCET contact API error: DATABASE_URL is not configured in environment.",
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
       DUPLICATE SUBMISSION CHECK (Within 2 minutes)
    ===================================================== */

    const recentWindow = new Date(Date.now() - 2 * 60 * 1000);
    const existingRecent = await prisma.contactMessage.findFirst({
      where: {
        email,
        createdAt: {
          gte: recentWindow,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (existingRecent) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Thank you! Your message has already been received recently. Our team will contact you shortly.",
          isDuplicate: true,
        },
        {
          status: 200,
        },
      );
    }

    /* =====================================================
       CLIENT IP
    ===================================================== */

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    /* =====================================================
       SAVE TO DATABASE
    ===================================================== */

    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: cleanPhone,
        subject,
        message,
        clientIp,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for reaching out! We have received your message and will get back to you shortly.",
        id: saved.id,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("STCET contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while sending your message. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
}
