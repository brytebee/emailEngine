// lib/email-service.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getDomainConfig,
  isValidDomain,
  getAllowedDomains,
} from "@/config/email-domains";

export interface BaseEmailData {
  from: string;
  to: string | string[];
  subject: string;
  firstName: string;
  product: string;
  logoUrl: string;
  template?: string;
}

export interface EmailServiceResponse {
  status: number;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Validates email domain configuration
 */
export async function validateDomainConfig(): Promise<EmailServiceResponse | null> {
  const allowedDomains = await getAllowedDomains();

  if (allowedDomains.length === 0) {
    return {
      status: 500,
      message: "Server configuration error",
      error: "No email domains configured",
    };
  }

  return null;
}

/**
 * Extracts and validates domain from email address
 */
export async function extractAndValidateDomain(email: string): Promise<{
  domain: string;
  isValid: boolean;
  error?: EmailServiceResponse;
}> {
  const domain = email.split("@")[1];

  if (!domain) {
    return {
      domain: "",
      isValid: false,
      error: {
        status: 400,
        message: "failed",
        error: "Invalid email format",
      },
    };
  }

  const isConfigValid = await isValidDomain(domain);
  if (!isConfigValid) {
    return {
      domain,
      isValid: false,
      error: {
        status: 403,
        message: "failed",
        error: "Unauthorized domain",
      },
    };
  }

  return { domain, isValid: true };
}

/**
 * Parses recipient email(s) - handles both single email and array formats
 */
export function parseRecipients(to: string | string[]): {
  recipients: string | string[];
  error?: EmailServiceResponse;
} {
  if (Array.isArray(to)) {
    return { recipients: to };
  }

  if (typeof to === "string" && to.length > 1 && to.includes("'")) {
    try {
      const parsed = JSON.parse(to.replace(/'/g, '"'));
      return { recipients: parsed };
    } catch (error) {
      return {
        recipients: to,
        error: {
          status: 400,
          message: "failed",
          error: "Invalid email format",
        },
      };
    }
  }

  return { recipients: to };
}

/**
 * Creates a Resend instance for the given domain
 */
export async function createResendClient(domain: string): Promise<Resend | null> {
  const domainConfig = await getDomainConfig(domain);

  if (!domainConfig || !domainConfig.apiKey) {
    return null;
  }

  return new Resend(domainConfig.apiKey);
}

/**
 * Generic email sending function
 */
export async function sendEmail<T extends Record<string, any>>({
  emailData,
  templateComponents,
  defaultTemplate,
  getTemplateProps,
}: {
  emailData: BaseEmailData & T;
  templateComponents: Record<string, any>;
  defaultTemplate: any;
  getTemplateProps: (data: BaseEmailData & T) => Record<string, any>;
}): Promise<NextResponse> {
  // Validate domain configuration
  const configError = await validateDomainConfig();
  if (configError) {
    return NextResponse.json(configError);
  }

  const { from, to, subject, product, template = "default" } = emailData;

  // Extract and validate domain
  const { domain, isValid, error } = await extractAndValidateDomain(from);
  if (!isValid || error) {
    return NextResponse.json(error!);
  }

  // Create Resend client
  const resend = await createResendClient(domain);
  if (!resend) {
    return NextResponse.json({
      status: 500,
      message: "failed",
      error: "Failed to initialize email service",
    });
  }

  // Parse recipients
  const { recipients, error: recipientError } = parseRecipients(to);
  if (recipientError) {
    return NextResponse.json(recipientError);
  }

  // Select email template
  const EmailTemplateComponent =
    templateComponents[template] || defaultTemplate;

  // Get template props
  const templateProps = getTemplateProps(emailData);

  try {
    const res = await resend.emails.send({
      from: `${product} <${from}>`,
      to: recipients,
      subject,
      react: EmailTemplateComponent(templateProps),
    });

    return NextResponse.json({
      status: 200,
      message: "success",
      data: res,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({
      status: 500,
      message: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Standard POST handler wrapper
 */
export async function handleEmailPost(
  req: Request,
  sendMailFn: (data: any) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const data = await req.json();
    return await sendMailFn(data);
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "failed",
      error: "Invalid request body",
    });
  }
}
