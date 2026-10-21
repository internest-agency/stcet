import "server-only";

import { SendMailClient } from "zeptomail";
import { getSiteSettings } from "@/src/lib/admin/settings";
import { unpackAndDecrypt } from "@/src/lib/admin/encryption";

export interface ZeptoMailConfig {
  enabled: boolean;
  apiEndpoint: string;
  token: string;
  senderEmail: string;
  senderName: string;
  adminEmail: string;
  notifyContact: boolean;
  notifyEnquiry: boolean;
}

export interface ZeptoMailResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Gets the decrypted ZeptoMail configuration from settings.
 * Returns null if not configured or disabled.
 */
export async function getZeptoMailConfig(): Promise<ZeptoMailConfig | null> {
  const settings = await getSiteSettings();

  if (!settings.zeptoEnabled) {
    return null;
  }

  if (!settings.zeptoTokenEncrypted || !settings.zeptoTokenSalt) {
    return null;
  }

  if (!settings.zeptoSenderEmail || !settings.zeptoAdminEmail) {
    return null;
  }

  let token: string;
  try {
    token = await unpackAndDecrypt(settings.zeptoTokenEncrypted);
  } catch (error) {
    console.error("[ZeptoMail] Failed to decrypt token:", error);
    return null;
  }

  return {
    enabled: true,
    apiEndpoint: settings.zeptoApiEndpoint || "https://api.zeptomail.com/v1.1/email",
    token,
    senderEmail: settings.zeptoSenderEmail,
    senderName: settings.zeptoSenderName || "STCET Website",
    adminEmail: settings.zeptoAdminEmail,
    notifyContact: settings.zeptoNotifyContact,
    notifyEnquiry: settings.zeptoNotifyEnquiry,
  };
}

/**
 * Creates a SendMailClient instance from the ZeptoMail configuration.
 */
function createSendMailClient(config: ZeptoMailConfig): SendMailClient {
  const url = config.apiEndpoint.replace(/\/+$/, "");
  return new SendMailClient({
    url,
    token: config.token,
  });
}

/**
 * Sends an email via ZeptoMail using the official SDK.
 */
export async function sendZeptoMailEmail(
  config: ZeptoMailConfig,
  payload: {
    to: { address: string; name?: string }[];
    subject: string;
    htmlbody: string;
    textbody?: string;
  }
): Promise<ZeptoMailResult> {
  try {
    const client = createSendMailClient(config);

    await client.sendMail({
      from: {
        address: config.senderEmail,
        name: config.senderName,
      },
      to: payload.to.map((t) => ({
        email_address: {
          address: t.address,
          name: t.name ?? "",
        },
      })),
      subject: payload.subject,
      htmlbody: payload.htmlbody,
      textbody: payload.textbody,
    });

    return { success: true, message: "Email accepted by ZeptoMail" };
  } catch (error) {
    const errorMsg = `ZeptoMail SDK error: ${error instanceof Error ? error.message : "Unknown error"}`;
    console.error("[ZeptoMail] SDK error:", errorMsg);
    return { success: false, message: errorMsg, error: errorMsg };
  }
}

/**
 * Escapes HTML special characters to prevent XSS in email templates.
 */
function escapeHtml(text: string): string {
  const entityMap: Record<string, string> = {
    "&": String.fromCharCode(38) + "amp;",
    "<": String.fromCharCode(38) + "lt;",
    ">": String.fromCharCode(38) + "gt;",
    '"': String.fromCharCode(38) + "quot;",
    "'": String.fromCharCode(38) + "#039;",
  };
  return text.replace(/[&<>"']/g, (char) => entityMap[char] ?? char);
}

/**
 * Sends a contact form submission notification email.
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
}): Promise<ZeptoMailResult> {
  const config = await getZeptoMailConfig();
  if (!config || !config.notifyContact) {
    return { success: false, message: "Contact notifications not enabled" };
  }

  const htmlbody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">STCET Website</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">New Contact Form Submission</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f; width: 120px;">Name:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;"><a href="mailto:${escapeHtml(data.email)}" style="color: #1e3a5f;">${escapeHtml(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Phone:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;"><a href="tel:${escapeHtml(data.phone)}" style="color: #1e3a5f;">${escapeHtml(data.phone)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Subject:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;">${escapeHtml(data.subject)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #1e3a5f; vertical-align: top;">Message:</td>
            <td style="padding: 12px 0; color: #333; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0; color: #666; font-size: 13px;">
          <p style="margin: 0;"><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
          <p style="margin: 8px 0 0;">Source: Contact Form — <a href="https://stcet.ac.in/contact" style="color: #1e3a5f;">stcet.ac.in/contact</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendZeptoMailEmail(config, {
    to: [{ address: config.adminEmail, name: "STCET Admin" }],
    subject: `New Contact Form Submission — ${escapeHtml(data.subject)} — STCET`,
    htmlbody,
    textbody: `
New Contact Form Submission — STCET

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}

Message:
${data.message}

Submitted: ${new Date(data.submittedAt).toLocaleString()}
Source: Contact Form — https://stcet.ac.in/contact
    `.trim(),
  });
}

/**
 * Sends an admissions enquiry notification email.
 */
export async function sendEnquiryNotification(data: {
  enquiryNumber: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
  coursePreferences: string[];
  submittedAt: string;
}): Promise<ZeptoMailResult> {
  const config = await getZeptoMailConfig();
  if (!config || !config.notifyEnquiry) {
    return { success: false, message: "Enquiry notifications not enabled" };
  }

  const preferencesHtml = data.coursePreferences
    .filter(Boolean)
    .map((p) => `<li>${escapeHtml(p)}</li>`)
    .join("");

  const htmlbody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">STCET Website</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">New Admissions Enquiry</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 12px; margin-bottom: 20px; text-align: center;">
          <strong style="color: #856404;">Enquiry Number: ${escapeHtml(data.enquiryNumber)}</strong>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f; width: 140px;">Student Name:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;">${escapeHtml(data.studentName)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Student Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;"><a href="mailto:${escapeHtml(data.studentEmail)}" style="color: #1e3a5f;">${escapeHtml(data.studentEmail)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Student Mobile:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;"><a href="tel:${escapeHtml(data.studentMobile)}" style="color: #1e3a5f;">${escapeHtml(data.studentMobile)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Parent Name:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;">${escapeHtml(data.parentName)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Parent Mobile:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;"><a href="tel:${escapeHtml(data.parentMobile)}" style="color: #1e3a5f;">${escapeHtml(data.parentMobile)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #1e3a5f;">Parent Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333;"><a href="mailto:${escapeHtml(data.parentEmail)}" style="color: #1e3a5f;">${escapeHtml(data.parentEmail)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #1e3a5f; vertical-align: top;">Course Preferences:</td>
            <td style="padding: 12px 0; color: #333;">
              ${preferencesHtml ? `<ul style="margin: 0; padding-left: 20px;">${preferencesHtml}</ul>` : "<em>None specified</em>"}
            </td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0; color: #666; font-size: 13px;">
          <p style="margin: 0;"><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
          <p style="margin: 8px 0 0;">Source: Enquiry Form — <a href="https://stcet.ac.in/enquire-now" style="color: #1e3a5f;">stcet.ac.in/enquire-now</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendZeptoMailEmail(config, {
    to: [{ address: config.adminEmail, name: "STCET Admin" }],
    subject: `New Admissions Enquiry — ${data.enquiryNumber} — STCET`,
    htmlbody,
    textbody: `
New Admissions Enquiry — STCET

Enquiry Number: ${data.enquiryNumber}
Student Name: ${data.studentName}
Student Email: ${data.studentEmail}
Student Mobile: ${data.studentMobile}
Parent Name: ${data.parentName}
Parent Mobile: ${data.parentMobile}
Parent Email: ${data.parentEmail}
Course Preferences: ${data.coursePreferences.filter(Boolean).join(", ") || "None specified"}

Submitted: ${new Date(data.submittedAt).toLocaleString()}
Source: Enquiry Form — https://stcet.ac.in/enquire-now
    `.trim(),
  });
}

/**
 * Sends a password reset email to an admin user.
 */
export async function sendPasswordResetEmail(data: {
  userName: string;
  userEmail: string;
  resetUrl: string;
}): Promise<ZeptoMailResult> {
  const config = await getZeptoMailConfig();

  if (!config) {
    return { success: false, message: "ZeptoMail not configured" };
  }

  const htmlbody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">STCET Website</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Admin Password Reset</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 16px; color: #333; font-size: 16px;">
          Hello ${escapeHtml(data.userName)},
        </p>
        <p style="margin: 0 0 16px; color: #333; font-size: 16px;">
          We received a request to reset the password for your STCET Website Admin account.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.resetUrl}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="margin: 16px 0 0; color: #666; font-size: 14px;">
          This link will expire in 60 minutes.
        </p>
        <p style="margin: 16px 0 0; color: #666; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
        <p style="margin: 0; color: #999; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${data.resetUrl}" style="color: #1e3a5f; word-break: break-all;">${data.resetUrl}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const textbody = `
Reset your STCET Admin password

Hello ${data.userName},

We received a request to reset the password for your STCET Website Admin account.

Reset your password: ${data.resetUrl}

This link will expire in 60 minutes.

If you didn't request a password reset, you can safely ignore this email.
  `.trim();

  return sendZeptoMailEmail(config, {
    to: [{ address: config.adminEmail, name: "STCET Admin" }],
    subject: "Reset your STCET Admin password",
    htmlbody,
    textbody,
  });
}

  