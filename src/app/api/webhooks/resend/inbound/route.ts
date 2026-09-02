import { NextResponse } from "next/server";
import { getUsers, saveMessage, MessageRecord } from "@/lib/googleSheetsDomains";
import { uploadToCloudinary } from "@/lib/cloudinary";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Resend Inbound Webhook payload structure
    // from: { email: "sender@example.com", name: "Sender" }
    // to: [{ email: "recipient@company.com", name: "Recipient" }]
    // subject: "Hello"
    // html: "..."
    // attachments: [{ content: Buffer, filename: "file.pdf", mimeType: "..." }]

    const { from, to, subject, html, text, attachments } = payload;
    const recipientEmail = Array.isArray(to) ? to[0].email : to;
    const senderEmail = typeof from === 'object' ? from.email : from;

    // 1. Identify the recipient's mailbox
    const users = await getUsers();
    const recipientUser = users.find(u => u.email.toLowerCase() === recipientEmail.toLowerCase());

    if (!recipientUser) {
        console.warn(`Incoming mail for unknown recipient: ${recipientEmail}. Skipping.`);
        return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    // 2. Handle Attachments (Upload to Cloudinary)
    const attachmentUrls = [];
    if (attachments && Array.isArray(attachments)) {
        for (const attachment of attachments) {
            try {
                // Resend usually sends content as Base64 in some webhooks
                const url = await uploadToCloudinary(attachment.content, "inbound-attachments");
                attachmentUrls.push({ name: attachment.filename, url });
            } catch (err) {
                console.error("Failed to upload attachment to Cloudinary:", err);
            }
        }
    }

    // 3. Save to Google Sheet
    const newMessage: MessageRecord = {
      id: crypto.randomUUID(),
      mailboxId: recipientUser.id,
      direction: 'in',
      subject: subject || "(No Subject)",
      htmlBody: html || text || "(Empty Body)",
      attachmentsJson: JSON.stringify(attachmentUrls),
      from: senderEmail,
      to: recipientEmail,
      timestamp: new Date().toISOString()
    };

    await saveMessage(newMessage);

    return NextResponse.json({ success: true, message: "Inbound mail processed" });

  } catch (error: any) {
    console.error("Inbound Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
