import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail
    pass: process.env.EMAIL_PASS,       // app password
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email text content
 */
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

export default sendEmail;  // ✅ now default export
