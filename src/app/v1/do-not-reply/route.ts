// app/v1/do-not-reply/route.ts

import CustomEmail from "@/components/email-templates/CustomEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getUserEmailTrackingFromExcel,
  incrementUserEmailCountInExcel,
  canUserSendEmailFromExcel,
  getEmailStatsFromExcel,
  cleanupOldExcelData,
  exportEmailTrackingToCSV,
} from "@/lib/googleSheetsEmailTracking";

const { d3, RESEND_API_KEY_CPA } = process.env;

// Helper function to get MIME type from file extension
const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    csv: "text/csv",
    rtf: "application/rtf",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
};

// Helper function to fetch file from Cloudinary and convert to buffer
const fetchAttachmentBuffer = async (
  url: string,
  filename: string,
  originalType: string
) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "EmailService/1.0",
        Accept: "*/*",
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch attachment: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalContentType = originalType;
    if (!finalContentType || finalContentType === "application/octet-stream") {
      finalContentType = contentType || getMimeType(filename);
    }

    return {
      content: buffer,
      contentType: finalContentType,
      size: buffer.length,
    };
  } catch (error) {
    console.error(`Error fetching attachment ${filename}:`, error);
    throw error;
  }
};

const sendMail = async (emailData: any) => {
  if (!d3 || !RESEND_API_KEY_CPA) {
    return NextResponse.json({
      status: 400,
      message: "Bad request param",
      error: "Check your env values!",
    });
  }

  const {
    from,
    to,
    subject,
    firstName,
    product,
    logoUrl,
    customBody,
    support,
    username,
    attachments = [],
  } = emailData;

  if (!username) {
    return NextResponse.json({
      status: 400,
      message: "failed",
      error: "Username is required for email tracking",
    });
  }

  const dailyLimit = 20;

  // Check if user can send email using Excel tracking
  if (!canUserSendEmailFromExcel(username, dailyLimit)) {
    const userTracking = await getUserEmailTrackingFromExcel(
      username,
      dailyLimit
    );
    return NextResponse.json({
      status: 429,
      message: "failed",
      error: "Daily email limit exceeded",
      details: {
        emailsSent: userTracking.emailsSent,
        dailyLimit: userTracking.dailyLimit,
        remainingEmails: userTracking.remainingEmails,
        resetTime: new Date(userTracking.date + "T23:59:59.999Z").toISOString(),
      },
    });
  }

  const stripDomain = from.split("@")[1];
  let API_KEY: string | undefined;
  const domainList = [d3];

  if (stripDomain === d3) {
    API_KEY = RESEND_API_KEY_CPA;
  }

  if (!API_KEY) {
    return NextResponse.json({
      status: 403,
      message: "failed",
      error: "No API key found for domain",
    });
  }

  const resend = new Resend(API_KEY);
  let contacts: string | null = null;

  if (typeof to === "string" && to.length > 1 && to.includes("'")) {
    try {
      contacts = JSON.parse(to.replace(/'/g, '"'));
    } catch (parseError) {
      console.error("Error parsing email addresses:", parseError);
    }
  }

  if (!domainList.includes(stripDomain)) {
    return NextResponse.json({
      status: 403,
      message: "failed",
      error: "Unauthorized domain",
    });
  }

  try {
    // Process attachments - fetch content from Cloudinary URLs
    const emailAttachments = [];
    const attachmentErrors = [];

    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        try {
          const { content, contentType, size } = await fetchAttachmentBuffer(
            attachment.url,
            attachment.name,
            attachment.type
          );

          const maxSize = 10 * 1024 * 1024; // 10MB
          if (size > maxSize) {
            const error = `Attachment ${attachment.name} is too large: ${(
              size /
              1024 /
              1024
            ).toFixed(2)}MB (max 10MB)`;
            console.warn(error);
            attachmentErrors.push(error);
            continue;
          }

          if (!content || content.length === 0) {
            const error = `Attachment ${attachment.name} has no content`;
            console.warn(error);
            attachmentErrors.push(error);
            continue;
          }

          emailAttachments.push({
            filename: attachment.originalName || attachment.name,
            content: content,
            contentType: contentType,
          });

          console.log(
            `✓ Added attachment: ${attachment.name} (${contentType}, ${(
              size / 1024
            ).toFixed(1)}KB)`
          );
        } catch (attachmentError) {
          const error =
            attachmentError instanceof Error
              ? `Failed to process attachment ${attachment.name}: ${attachmentError.message}`
              : "Processing failed due to unknown error";
          console.error(error);
          attachmentErrors.push(error);
        }
      }
    }

    // Calculate total attachment size
    const totalSize = emailAttachments.reduce(
      (sum, att) => sum + att.content.length,
      0
    );
    const maxTotalSize = 25 * 1024 * 1024; // 25MB total limit

    if (totalSize > maxTotalSize) {
      console.warn(
        `Total attachment size too large: ${(totalSize / 1024 / 1024).toFixed(
          2
        )}MB`
      );
      return NextResponse.json({
        status: 400,
        message: "failed",
        error: `Total attachment size (${(totalSize / 1024 / 1024).toFixed(
          2
        )}MB) exceeds limit (25MB)`,
      });
    }

    // Send email with processed attachments
    const emailPayload: any = {
      from: `${product} <${from}>`,
      to: contacts ?? to,
      subject,
      react: CustomEmail({
        firstName: firstName || "User",
        product: product || "CORPORATE AFFAIRS COMMISSION",
        logoUrl: logoUrl,
        support: support || from,
        customBody: customBody,
        subject: subject,
      }),
    };

    if (emailAttachments.length > 0) {
      emailPayload.attachments = emailAttachments;
    }

    const res = await resend.emails.send(emailPayload);

    // Increment email count in Excel after successful send
    const updatedUserTracking = await incrementUserEmailCountInExcel(
      username,
      dailyLimit
    );

    return NextResponse.json({
      message: "success",
      res,
      emailTracking: {
        emailsSent: updatedUserTracking.emailsSent,
        dailyLimit: updatedUserTracking.dailyLimit,
        remainingEmails: updatedUserTracking.remainingEmails,
        showWarning:
          updatedUserTracking.remainingEmails <= 5 &&
          updatedUserTracking.remainingEmails > 0,
        canSendMore: updatedUserTracking.remainingEmails > 0,
        resetTime: new Date(
          updatedUserTracking.date + "T23:59:59.999Z"
        ).toISOString(),
      },
      attachmentInfo: {
        requested: attachments.length,
        processed: emailAttachments.length,
        failed: attachmentErrors.length,
        errors: attachmentErrors.length > 0 ? attachmentErrors : undefined,
        attachments: emailAttachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          size: a.content.length,
        })),
        totalSize: totalSize,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    return await sendMail(data);
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "failed",
      error: "Invalid JSON in request body",
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const action = url.searchParams.get("action");

    // Handle different actions
    if (action === "stats") {
      const stats = getEmailStatsFromExcel();
      return NextResponse.json({
        message: "success",
        stats,
      });
    }

    if (action === "cleanup") {
      const daysToKeep = parseInt(url.searchParams.get("days") || "30");
      cleanupOldExcelData(daysToKeep);
      return NextResponse.json({
        message: "success",
        info: `Cleaned up data older than ${daysToKeep} days`,
      });
    }

    if (action === "export") {
      const csvPath = exportEmailTrackingToCSV();
      return NextResponse.json({
        message: "success",
        info: "Data exported to CSV",
        csvPath,
      });
    }

    // Default action - get user email count
    if (!username) {
      return NextResponse.json({
        status: 400,
        message: "failed",
        error: "Username parameter is required",
      });
    }

    const dailyLimit = 20;
    const userTracking = await getUserEmailTrackingFromExcel(
      username,
      dailyLimit
    );

    return NextResponse.json({
      message: "success",
      emailTracking: {
        emailsSent: userTracking.emailsSent,
        dailyLimit: userTracking.dailyLimit,
        remainingEmails: userTracking.remainingEmails,
        showWarning:
          userTracking.remainingEmails <= 5 && userTracking.remainingEmails > 0,
        canSendMore: userTracking.remainingEmails > 0,
        resetTime: new Date(userTracking.date + "T23:59:59.999Z").toISOString(),
        lastReset: userTracking.lastReset,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "failed",
      error: "Error processing request",
    });
  }
}
