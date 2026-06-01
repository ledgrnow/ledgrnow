import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Reset your LedgrNow password",
    html: `<p>Use this secure link to reset your LedgrNow password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>The link expires in 30 minutes.</p>`
  });
}
