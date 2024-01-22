import EmailTemplate from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["brytebee@gmail.com"],
      subject: "Testa",
      react: EmailTemplate({ firstName: "Bright" }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
