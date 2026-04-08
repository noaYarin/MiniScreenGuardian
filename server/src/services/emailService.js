import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service is not configured. Missing EMAIL_USER or EMAIL_PASS.");
  }

  await transporter.sendMail({
    from: `"ScreenGuardian" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  
}

