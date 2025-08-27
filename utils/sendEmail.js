import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(userEmail, token) {
  const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Verify your account",
    html: `<p>Please verify your account by clicking <a href="${link}">here</a>.</p>`
  });
}
