import EmailTemplate from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (emailData: any) => {
  const { from, to, subject, firstName, product } = emailData;
  const contacts = JSON.parse(to.replace(/'/g, '"'));

  try {
    const res = await resend.emails.send({
      from: `${product} <${from}>`,
      to: contacts,
      subject,
      react: EmailTemplate({
        firstName,
        product,
      }),
    });

    return Response.json({ message: "success", res });
  } catch (error) {
    return Response.json({ message: "failed", error });
  }
};

export async function POST(req: any) {
  const data = await req.json();
  return await sendMail(data);
}
