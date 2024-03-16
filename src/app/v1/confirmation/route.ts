import ConfirmEmail from "@/components/Confirm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (emailData: any) => {
  const { from, to, subject, firstName, product, code } = emailData;
  let contacts: string | null;
  // For collection of emails eg ['a@a.com', 'b@b.com', ...]
  if (to.length > 1 && to.includes("'")) {
    contacts = JSON.parse(to.replace(/'/g, '"'));
  }

  try {
    const res = await resend.emails.send({
      from: `${product} <${from}>`,
      // @ts-ignore
      to: contacts ?? to,
      subject,
      react: ConfirmEmail({
        code,
        firstName,
        product,
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
