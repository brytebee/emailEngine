// app/v1/do-not-reply/route.ts

import CustomEmail from "@/components/email-templates/CustomEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const { d3, RESEND_API_KEY_CPA } = process.env;

// Email tracking types
interface UserEmailCount {
  username: string;
  count: number;
  date: string;
  lastReset: string;
}

interface EmailTrackingData {
  [username: string]: UserEmailCount;
}

const EMAIL_TRACKING_FILE = path.join(
  process.cwd(),
  "tmp",
  "email-tracking.json"
);

const ensureTmpDir = () => {
  const tmpDir = path.dirname(EMAIL_TRACKING_FILE);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
};

const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const loadEmailTrackingData = (): EmailTrackingData => {
  try {
    ensureTmpDir();
    if (fs.existsSync(EMAIL_TRACKING_FILE)) {
      const data = fs.readFileSync(EMAIL_TRACKING_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading email tracking data:", error);
  }
  return {};
};

const saveEmailTrackingData = (data: EmailTrackingData): void => {
  try {
    ensureTmpDir();
    fs.writeFileSync(EMAIL_TRACKING_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving email tracking data:", error);
  }
};

const getUserEmailCount = (username: string): UserEmailCount => {
  const data = loadEmailTrackingData();
  const currentDate = getCurrentDate();

  if (!data[username] || data[username].date !== currentDate) {
    data[username] = {
      username,
      count: 0,
      date: currentDate,
      lastReset: new Date().toISOString(),
    };
    saveEmailTrackingData(data);
  }

  return data[username];
};

const incrementUserEmailCount = (username: string): UserEmailCount => {
  const data = loadEmailTrackingData();
  const userCount = getUserEmailCount(username);

  userCount.count += 1;
  data[username] = userCount;
  saveEmailTrackingData(data);

  return userCount;
};

const canUserSendEmail = (
  username: string,
  dailyLimit: number = 20
): boolean => {
  const userCount = getUserEmailCount(username);
  return userCount.count < dailyLimit;
};

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
    // Add more file types
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
    console.log(`Fetching attachment: ${filename} from ${url}`);
    console.log(`Original file type: ${originalType}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "EmailService/1.0",
        Accept: "*/*",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch attachment: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    console.log(`Content-Type from Cloudinary: ${contentType}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      `Successfully fetched ${filename}, size: ${buffer.length} bytes`
    );

    // Prefer original file type, fallback to detected or guessed
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
  if (!canUserSendEmail(username, dailyLimit)) {
    const userCount = getUserEmailCount(username);
    return NextResponse.json({
      status: 429,
      message: "failed",
      error: "Daily email limit exceeded",
      details: {
        emailsSent: userCount.count,
        dailyLimit,
        remainingEmails: 0,
        resetTime: new Date(userCount.date + "T23:59:59.999Z").toISOString(),
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
      console.log(`Processing ${attachments.length} attachments...`);

      for (const attachment of attachments) {
        try {
          console.log(`Processing attachment:`, {
            id: attachment.id,
            name: attachment.name,
            originalName: attachment.originalName,
            type: attachment.type,
            size: attachment.size,
            url: attachment.url,
          });

          const { content, contentType, size } = await fetchAttachmentBuffer(
            attachment.url,
            attachment.name,
            attachment.type
          );

          // Validate file size (Resend has a 40MB total limit, 10MB per file is safe)
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

          // Validate content buffer
          if (!content || content.length === 0) {
            const error = `Attachment ${attachment.name} has no content`;
            console.warn(error);
            attachmentErrors.push(error);
            continue;
          }

          emailAttachments.push({
            filename: attachment.originalName || attachment.name, // Use original filename
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
          // Continue with other attachments instead of failing the entire email
        }
      }

      console.log(
        `Successfully processed ${emailAttachments.length} out of ${attachments.length} attachments`
      );

      if (attachmentErrors.length > 0) {
        console.warn("Attachment processing errors:", attachmentErrors);
      }
    }

    // Calculate total attachment size
    const totalSize = emailAttachments.reduce(
      (sum, att) => sum + att.content.length,
      0
    );
    const maxTotalSize = 25 * 1024 * 1024; // 25MB total limit for safety

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

    // Only add attachments if we have any
    if (emailAttachments.length > 0) {
      emailPayload.attachments = emailAttachments;
      console.log(
        `Sending email with ${emailAttachments.length} attachments (${(
          totalSize /
          1024 /
          1024
        ).toFixed(2)}MB total)`
      );
    }

    const res = await resend.emails.send(emailPayload);
    console.log("Email sent successfully:", res);

    // Increment email count only after successful send
    const updatedUserCount = incrementUserEmailCount(username);
    const remainingEmails = Math.max(0, dailyLimit - updatedUserCount.count);

    return NextResponse.json({
      message: "success",
      res,
      emailTracking: {
        emailsSent: updatedUserCount.count,
        dailyLimit,
        remainingEmails,
        showWarning: remainingEmails <= 5 && remainingEmails > 0,
        canSendMore: remainingEmails > 0,
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
    console.error("Error sending email:", error);
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

    if (!username) {
      return NextResponse.json({
        status: 400,
        message: "failed",
        error: "Username parameter is required",
      });
    }

    const dailyLimit = 20;
    const userCount = getUserEmailCount(username);
    const remainingEmails = Math.max(0, dailyLimit - userCount.count);

    return NextResponse.json({
      message: "success",
      emailTracking: {
        emailsSent: userCount.count,
        dailyLimit,
        remainingEmails,
        showWarning: remainingEmails <= 5 && remainingEmails > 0,
        canSendMore: remainingEmails > 0,
        resetTime: new Date(userCount.date + "T23:59:59.999Z").toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "failed",
      error: "Error fetching email count",
    });
  }
}
