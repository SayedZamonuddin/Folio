import { getResend, EMAIL_FROM } from "./resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] Skipping send (no RESEND_API_KEY): ${subject} -> ${to}`);
    return { success: true, id: "dev-skipped" };
  }

  const { data, error } = await getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[Email] Failed to send:", error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data?.id };
}
