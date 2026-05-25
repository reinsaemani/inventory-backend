import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================
// SEND EMAIL
// =========================
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });

    if (result.error) {
      throw new Error("Email failed to send");
    }

    return result;
  } catch (err) {
    throw new Error("Email service error");
  }
};