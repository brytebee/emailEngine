// app/v1/notification/route.ts

/**
 * Notification Email Endpoint
 *
 * Sends notification emails with custom messages (max 160 characters)
 *
 * Usage:
 * POST /v1/notification
 * {
 *   "from": "noreply@yourdomain.com",
 *   "to": "user@example.com",
 *   "subject": "Important Update",
 *   "firstName": "John",
 *   "product": "Your App",
 *   "message": "Your custom notification message here",
 *   "logoUrl": "https://...",
 *   "template": "modern" // or "minimal"
 * }
 */

import ModernNotificationEmail from "@/components/notification/ModernNotification";
import MinimalNotificationEmail from "@/components/notification/MinimalNotification";
import { sendEmail, handleEmailPost, BaseEmailData } from "@/lib/email-service";
import { NextResponse } from "next/server";

type NotificationTemplate = "modern" | "minimal";

interface NotificationEmailData extends BaseEmailData {
  message: string;
  template?: NotificationTemplate;
  actionUrl?: string;
  actionText?: string;
}

const templateComponents = {
  modern: ModernNotificationEmail,
  minimal: MinimalNotificationEmail,
};

const sendMail = async (emailData: NotificationEmailData) => {
  // Validate message length
  if (!emailData.message) {
    return NextResponse.json({
      status: 400,
      message: "failed",
      error: "Message is required",
    });
  }

  if (emailData.message.length > 160) {
    return NextResponse.json({
      status: 400,
      message: "failed",
      error: "Message must not exceed 160 characters",
    });
  }

  // Validate subject
  if (!emailData.subject || emailData.subject.trim().length === 0) {
    return NextResponse.json({
      status: 400,
      message: "failed",
      error: "Subject is required",
    });
  }

  return sendEmail({
    emailData,
    templateComponents,
    defaultTemplate: ModernNotificationEmail,
    getTemplateProps: (data) => ({
      message: data.message,
      firstName: data.firstName,
      product: data.product,
      logoUrl: data.logoUrl,
      actionUrl: data.actionUrl,
      actionText: data.actionText,
    }),
  });
};

export async function POST(req: Request) {
  return handleEmailPost(req, sendMail);
}
