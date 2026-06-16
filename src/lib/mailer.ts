import nodemailer from "nodemailer";

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  return cachedTransporter;
}

/**
 * Sends the password reset OTP by email. If SMTP credentials aren't configured,
 * the OTP is logged to the server console instead so the flow stays usable in local dev.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`[mailer] SMTP not configured — OTP for ${to} is: ${otp}`);
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `TaskFlow AI <${from}>`,
    to,
    subject: "Your TaskFlow AI password reset code",
    text: `Your password reset code is ${otp}. It expires in 2 minutes. If you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4350d4;">TaskFlow AI</h2>
        <p>Use the code below to reset your password. It expires in <strong>2 minutes</strong>.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p style="color: #64748b; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
