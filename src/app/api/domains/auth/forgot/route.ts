import { NextResponse } from "next/server";
import { getAuthRecords, setAuthRecord } from "@/lib/googleSheetsDomains";
import { sendEmail } from "@/lib/email-service";
import crypto from "crypto";
import { ResetPasswordEmail } from "@/components/ResetPasswordEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const records = await getAuthRecords();
    const adminRecord = records.find(r => r.email === email);

    if (!adminRecord) {
      // Return success even if not found to prevent user enumeration
      return NextResponse.json({ success: true, message: "If an account with that email exists, a reset link has been sent." });
    }

    // Generate token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    // Save token to admin record
    await setAuthRecord({
      ...adminRecord,
      resetToken,
      tokenExpiry
    });

    const url = new URL(req.url);
    const resetLink = `${url.origin}/admin/domains/reset?token=${resetToken}`;

    const senderDomain = process.env.NEXT_PUBLIC_SENDER || adminRecord.email.split("@")[1];

    // Send the email using the application's built-in email service
    await sendEmail({
      emailData: {
        from: `admin@${senderDomain}`,
        to: adminRecord.email,
        subject: "Admin Password Reset",
        firstName: adminRecord.username,
        product: "Admin Portal",
        logoUrl: "",
        template: "reset",
        resetLink, 
      },
      templateComponents: {
        reset: ResetPasswordEmail,
      },
      defaultTemplate: ResetPasswordEmail,
      getTemplateProps: (data: any) => ({
        resetLink: data.resetLink,
      })
    });

    return NextResponse.json({ success: true, message: "If an account with that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("POST /api/domains/auth/forgot error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
