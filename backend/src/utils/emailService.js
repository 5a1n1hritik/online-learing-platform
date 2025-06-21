import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or SendGrid/Mailtrap/etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Email - EduLearn",
    html: `
      <h3>Hello ${name},</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Password - EduLearn",
    html: `
      <h3>Hello ${name},</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to EduLearn!",
    html: `
      <h3>Hello ${name},</h3>
      <p>Welcome to EduLearn! We're excited to have you on board.</p>
      <p>Feel free to explore our courses and resources.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};