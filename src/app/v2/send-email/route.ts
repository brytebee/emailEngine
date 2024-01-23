import EmailTemplate from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  // Get all data as Request body so that it can be fired to the endpoint.
  try {
    const data = await resend.emails.send({
      from: "TechVerse Academy <help-desk@techverseacademy.com>",
      to: ["brytebee@gmail.com", "aniekaudo@yahoo.com"],
      subject: "Just to see!",
      react: EmailTemplate({
        firstName: "Bright && Anie",
        product: "Techverse Academy",
      }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
