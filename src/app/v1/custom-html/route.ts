// app/v1/custom-html/route.ts

/**
 * Custom HTML Email Endpoint
 *
 * Sends fully custom branded HTML emails (e.g. receipts, newsletters, reports)
 * through Resend for authorized domains.
 *
 * Usage:
 * POST /v1/custom-html
 * {
 *   "from": "no-reply@ohiolelagos.com",
 *   "to": "customer@example.com",
 *   "subject": "Your Ohiole Lagos Receipt — #POS-10614-APU",
 *   "product": "Ohiole Lagos",
 *   "html": "<html>...</html>",
 *   "attachments": [
 *     { "filename": "receipt.pdf", "content": "base64..." }
 *   ]
 * }
 */

import { NextResponse } from "next/server";
import {
  extractAndValidateDomain,
  createResendClient,
  parseRecipients,
  validateDomainConfig,
} from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const configError = await validateDomainConfig();
    if (configError) {
      return NextResponse.json(configError);
    }

    const body = await req.json();
    const { from, to, subject, product = "Ohiole Lagos", html, attachments } = body;

    if (!from || !to || !subject || !html) {
      return NextResponse.json({
        status: 400,
        message: "failed",
        error: "Missing required fields: from, to, subject, html",
      });
    }

    const { domain, isValid, error } = await extractAndValidateDomain(from);
    if (!isValid || error) {
      return NextResponse.json(error!);
    }

    const resend = await createResendClient(domain);
    if (!resend) {
      return NextResponse.json({
        status: 500,
        message: "failed",
        error: `Failed to initialize email service for domain: ${domain}`,
      });
    }

    const { recipients, error: recipientError } = parseRecipients(to);
    if (recipientError) {
      return NextResponse.json(recipientError);
    }

    const emailPayload: any = {
      from: `${product} <${from}>`,
      to: recipients,
      subject,
      html,
    };

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const res = await resend.emails.send(emailPayload);

    return NextResponse.json({
      status: 200,
      message: "success",
      data: res,
    });
  } catch (err: any) {
    console.error("[custom-html] Email send error:", err);
    return NextResponse.json({
      status: 500,
      message: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
