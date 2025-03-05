// // app/v1/url-verify/route.ts

// import UrlVerifyEmail from "@/components/url-verify/UrlVerify";
// import UrlVerifyCorporate from "@/components/url-verify/UrlVerifyCorporate";
// import UrlVerifyCreative from "@/components/url-verify/UrlVerifyCreative";
// import UrlVerifyMinimalist from "@/components/url-verify/UrlVerifyMinimalist";
// import UrlVerifyTech from "@/components/url-verify/UrlVerifyTech";
// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const { d1, d2, RESEND_API_KEY_TVA, RESEND_API_KEY_JHT } = process.env;

// const sendMail = async (emailData: any) => {
//   if ((!d1 || !d2) && (!RESEND_API_KEY_JHT || !RESEND_API_KEY_TVA)) {
//     return NextResponse.json({
//       status: 400,
//       message: "Bad request param",
//       error: "Check your env values!",
//     });
//   }

//   const {
//     from,
//     to,
//     subject,
//     firstName,
//     product,
//     resetToken,
//     resetUrl,
//     logoUrl,
//   } = emailData;
//   const stripDomain = from.split("@")[1];
//   let API_KEY: string | undefined;
//   const domainList = [d1, d2];

//   if (stripDomain === d1) {
//     API_KEY = RESEND_API_KEY_TVA;
//   }
//   if (stripDomain === d2) {
//     API_KEY = RESEND_API_KEY_JHT;
//   }

//   const resend = new Resend(API_KEY);
//   let contacts: string | null;

//   // For collection of emails eg ['a@a.com', 'b@b.com', ...]
//   if (to.length > 1 && to.includes("'")) {
//     contacts = JSON.parse(to.replace(/'/g, '"'));
//   }

//   if (!domainList.includes(stripDomain)) {
//     return NextResponse.json({
//       status: 403,
//       message: "failed",
//       error: "Unauthorized domain",
//     });
//   }

//   try {
//     const res = await resend.emails.send({
//       from: `${product} <${from}>`,
//       // @ts-ignore
//       to: contacts ?? to,
//       subject,
//       react: UrlVerifyEmail({
//         resetToken,
//         resetUrl,
//         firstName,
//         product,
//         logoUrl,
//       }),
//     });

//     return NextResponse.json({ message: "success", res });
//   } catch (error) {
//     return NextResponse.json({ message: "failed", error });
//   }
// };

// export async function POST(req: any) {
//   const data = await req.json();
//   return await sendMail(data);
// }

import UrlVerifyEmail from "@/components/url-verify/UrlVerify";
import UrlVerifyCorporate from "@/components/url-verify/UrlVerifyCorporate";
import UrlVerifyCreative from "@/components/url-verify/UrlVerifyCreative";
import UrlVerifyMinimalist from "@/components/url-verify/UrlVerifyMinimalist";
import UrlVerifyTech from "@/components/url-verify/UrlVerifyTech";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const { d1, d2, RESEND_API_KEY_TVA, RESEND_API_KEY_JHT } = process.env;

// Define a type for email templates
type EmailTemplate =
  | "default"
  | "corporate"
  | "creative"
  | "minimalist"
  | "tech";

const sendMail = async (emailData: any) => {
  if ((!d1 || !d2) && (!RESEND_API_KEY_JHT || !RESEND_API_KEY_TVA)) {
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
    resetToken,
    resetUrl,
    logoUrl,
    template = "default", // Default to 'default' if not specified
  } = emailData;

  const stripDomain = from.split("@")[1];
  let API_KEY: string | undefined;
  const domainList = [d1, d2];

  if (stripDomain === d1) {
    API_KEY = RESEND_API_KEY_TVA;
  }
  if (stripDomain === d2) {
    API_KEY = RESEND_API_KEY_JHT;
  }

  const resend = new Resend(API_KEY);
  let contacts: string | null;

  // For collection of emails eg ['a@a.com', 'b@b.com', ...]
  if (to.length > 1 && to.includes("'")) {
    contacts = JSON.parse(to.replace(/'/g, '"'));
  }

  if (!domainList.includes(stripDomain)) {
    return NextResponse.json({
      status: 403,
      message: "failed",
      error: "Unauthorized domain",
    });
  }

  // Select the email template based on the template parameter
  const templateComponents = {
    default: UrlVerifyEmail,
    corporate: UrlVerifyCorporate,
    creative: UrlVerifyCreative,
    minimalist: UrlVerifyMinimalist,
    tech: UrlVerifyTech,
  };

  const EmailTemplateComponent =
    templateComponents[template as EmailTemplate] || UrlVerifyEmail;

  try {
    const res = await resend.emails.send({
      from: `${product} <${from}>`,
      // @ts-ignore
      to: contacts ?? to,
      subject,
      react: EmailTemplateComponent({
        resetToken,
        resetUrl,
        firstName,
        product,
        logoUrl,
      }),
    });

    return NextResponse.json({ message: "success", res });
  } catch (error) {
    return NextResponse.json({ message: "failed", error });
  }
};

export async function POST(req: any) {
  const data = await req.json();
  return await sendMail(data);
}
