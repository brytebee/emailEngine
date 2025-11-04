// app/v1/confirmation/route.ts

/**
 * Adding new domains requires the following updates:
 * 1. Add domain and API key to .env.local
 * 2. Include the in config/email-domains.ts
 * 3. Push to create an updated build
 * 4. Start emailing...
 *   */

import ConfirmEmail from "@/components/confirm/Confirm";
import CorporateConfirmEmail from "@/components/confirm/ConfirmCorporate";
import ElegantConfirmEmail from "@/components/confirm/ConfirmElegant";
import MinimalConfirmEmail from "@/components/confirm/ConfirmMinimal";
import TechConfirmEmail from "@/components/confirm/ConfirmTech";
import { sendEmail, handleEmailPost, BaseEmailData } from "@/lib/email-service";

type EmailTemplate = "default" | "corporate" | "elegant" | "minimal" | "tech";

interface ConfirmationEmailData extends BaseEmailData {
  code: string;
  template?: EmailTemplate;
}

const templateComponents = {
  default: ConfirmEmail,
  corporate: CorporateConfirmEmail,
  elegant: ElegantConfirmEmail,
  minimal: MinimalConfirmEmail,
  tech: TechConfirmEmail,
};

const sendMail = async (emailData: ConfirmationEmailData) => {
  return sendEmail({
    emailData,
    templateComponents,
    defaultTemplate: ConfirmEmail,
    getTemplateProps: (data) => ({
      code: data.code,
      firstName: data.firstName,
      product: data.product,
      logoUrl: data.logoUrl,
    }),
  });
};

export async function POST(req: Request) {
  return handleEmailPost(req, sendMail);
}
