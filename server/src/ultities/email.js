const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  try {
    await transporter.sendMail({
      from: `"Note App" <${process.env.EMAIL_NAME}>`,
      to,
      subject,
      text,
      html,
      replyTo: replyTo || process.env.EMAIL_NAME,
    });
  } catch (error) {
    throw error;
  }
};

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.REACT_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

module.exports = { sendResetPasswordEmail, sendEmail };
