// app/v1/url-verify/route.ts

/**
 * Adding new domains requires the following updates:
 * 1. Add domain and API key to .env.local
 * 2. Include the in config/email-domains.ts
 * 3. Push to create an updated build
 * 4. Start emailing...
 *   */

import UrlVerifyEmail from "@/components/url-verify/UrlVerify";
import UrlVerifyCorporate from "@/components/url-verify/UrlVerifyCorporate";
import UrlVerifyCreative from "@/components/url-verify/UrlVerifyCreative";
import UrlVerifyMinimalist from "@/components/url-verify/UrlVerifyMinimalist";
import UrlVerifyTech from "@/components/url-verify/UrlVerifyTech";
import { sendEmail, handleEmailPost, BaseEmailData } from "@/lib/email-service";

type EmailTemplate =
  | "default"
  | "corporate"
  | "creative"
  | "minimalist"
  | "tech";

interface UrlVerifyEmailData extends BaseEmailData {
  resetToken: string;
  resetUrl: string;
  template?: EmailTemplate;
}

const templateComponents = {
  default: UrlVerifyEmail,
  corporate: UrlVerifyCorporate,
  creative: UrlVerifyCreative,
  minimalist: UrlVerifyMinimalist,
  tech: UrlVerifyTech,
};

const sendMail = async (emailData: UrlVerifyEmailData) => {
  return sendEmail({
    emailData,
    templateComponents,
    defaultTemplate: UrlVerifyEmail,
    getTemplateProps: (data) => ({
      resetToken: data.resetToken,
      resetUrl: data.resetUrl,
      firstName: data.firstName,
      product: data.product,
      logoUrl: data.logoUrl,
    }),
  });
};

export async function POST(req: Request) {
  return handleEmailPost(req, sendMail);
}
