import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getOrganizations, saveMessage, MessageRecord } from "@/lib/googleSheetsDomains";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, subject, content } = await req.json();

    if (!to || !content) {
      return NextResponse.json({ error: "To and Content are required" }, { status: 400 });
    }

    // 1. Quota Enforcement
    if (user.emailLimit && (user.messagesUsed || 0) >= user.emailLimit) {
        return NextResponse.json({ 
            error: "Monthly email limit reached. Please upgrade your plan to continue sending.",
            code: "QUOTA_EXCEEDED"
        }, { status: 403 });
    }

    const orgs = await getOrganizations();
    const org = orgs.find(o => o.id === user.orgId);

    if (!org) {
       return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // 2. Wrap content in a simple HTML template with branding and signature
    // In a production app, we'd use @react-email/render here
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .container { width: 100%; max-width: 600px; margin: 60px auto; }
          .card { background-color: #ffffff; border-radius: 24px; padding: 64px 48px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02); }
          .header { text-align: center; margin-bottom: 48px; }
          .logo { max-height: 48px; }
          .title { font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 24px; text-align: center; letter-spacing: -0.04em; line-height: 1.2; }
          .content { font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 48px; }
          .footer { text-align: center; margin-top: 48px; padding-top: 32px; border-top: 1px solid #f1f5f9; }
          .signature { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
          .meta { font-size: 13px; color: #94a3b8; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              ${org.logoUrl ? `<img src="${org.logoUrl}" class="logo" />` : `<h2 style="color: #1e293b; margin: 0; font-weight: 900; letter-spacing: -0.04em;">${org.name}</h2>`}
            </div>
            <h1 class="title">${subject || '(No Subject)'}</h1>
            <div class="content">
              ${content.replace(/\n/g, '<br/>')}
            </div>
            <div class="footer">
              <div class="signature">${user.fullName}</div>
              <div class="meta">${user.title || 'Organization Admin'} &bull; ${org.name}</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; font-weight: 500;">
            &copy; ${new Date().getFullYear()} ${org.name}. Sent via <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="text-decoration: none; color: #6366f1; font-weight: 700;">EmailEngine</a> Workspace.
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. Identify the sending domain
    // We assume the user's email (e.g. john@acme.com) uses a domain they've verified
    const fromEmail = `${user.fullName} <${user.email}>`;

    // 4. Send via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject || "(No Subject)",
      html: htmlBody,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Save record to Google Sheets
    const newMessage: MessageRecord = {
      id: crypto.randomUUID(),
      mailboxId: user.id,
      direction: 'out',
      subject: subject || "(No Subject)",
      htmlBody: htmlBody,
      attachmentsJson: "[]",
      from: fromEmail,
      to: to,
      timestamp: new Date().toISOString()
    };

    await saveMessage(newMessage);

    return NextResponse.json({ success: true, messageId: data?.id });

  } catch (error: any) {
    console.error("POST /api/dashboard/mail/send error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
