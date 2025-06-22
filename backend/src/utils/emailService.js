import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // Or use SendGrid/Mailtrap/etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateEmailTemplate = (title, message, otp) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <div style="text-align: center; padding: 20px;">
        <img src="https://edulearn.example.com/logo.png" alt="EduLearn Logo" style="height: 50px;" />
      </div>

      <div style="padding: 0 30px 30px;">
        <h2 style="color: #2563eb;">${title}</h2>
        <p style="font-size: 15px; color: #374151; margin: 12px 0 24px;">
          ${message}
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 4px;">
            ${otp}
          </div>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          ⚠️ This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.
        </p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;"/>

        <p style="font-size: 13px; color: #9ca3af; text-align: center;">
          Didn’t request this email? You can safely ignore it, or contact <a href="mailto:support@edulearn.com" style="color: #2563eb;">support@edulearn.com</a>.
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          Regards,<br/>
          Team EduLearn
        </p>
      </div>
    </div>
  </div>
`;

export const sendVerificationEmail = async (email, name, otp) => {
  const html = generateEmailTemplate(
    `Welcome to EduLearn, ${name} 👋`,
    `To verify your email and start your journey toward cracking government exams like SSC, UPSC, Railways, and Banking, use the OTP below:`,
    otp
  );

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Email - EduLearn",
    html,
  });
};

export const sendPasswordResetEmail = async (email, name, otp) => {
  const html = generateEmailTemplate(
    `Reset Your Password, ${name}`,
    `Forgot your EduLearn password? No worries — use the OTP below to reset it and regain access to your exam preparation dashboard:`,
    otp
  );

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Password - EduLearn",
    html,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        
        <div style="text-align: center; padding: 20px;">
          <img src="https://edulearn.example.com/logo.png" alt="EduLearn Logo" style="height: 50px;" />
        </div>

        <div style="padding: 0 30px 30px;">
          <h2 style="color: #16a34a;">Welcome to EduLearn, ${name}! 🎓</h2>
          <p style="font-size: 16px; color: #374151;">We’re thrilled to help you on your journey to cracking India’s top government exams.</p>

          <ul style="padding-left: 20px; font-size: 14px; color: #4b5563; margin: 20px 0;">
            <li>📚 Access expert-curated courses for SSC, UPSC, Railways, Banking</li>
            <li>📝 Practice with quizzes, mock tests, and exam templates</li>
            <li>📈 Track your performance and rank among other learners</li>
          </ul>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Start Learning →
            </a>
          </div>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;"/>

          <p style="font-size: 13px; color: #9ca3af; text-align: center;">
            Need help? Contact us anytime at <a href="mailto:support@edulearn.com" style="color: #2563eb;">support@edulearn.com</a>
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            Regards,<br/>
            Team EduLearn
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to EduLearn!",
    html,
  });
};

export const sendPasswordResetSuccessEmail = async (email, name) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        
        <div style="text-align: center; padding: 20px;">
          <img src="https://edulearn.example.com/logo.png" alt="EduLearn Logo" style="height: 50px;" />
        </div>

        <div style="padding: 0 30px 30px;">
          <h2 style="color: #16a34a;">Your Password Was Successfully Reset</h2>
          <p style="font-size: 16px; color: #374151;">
            Hi ${name},<br/><br/>
            We've successfully updated your password for your EduLearn account. You can now log in with your new credentials and continue preparing for your government exams.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Login Now →
            </a>
          </div>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;"/>

          <p style="font-size: 13px; color: #9ca3af; text-align: center;">
            Didn’t change your password? <a href="mailto:support@edulearn.com" style="color: #2563eb;">Contact support immediately</a>.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            Regards,<br/>
            Team EduLearn
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Successfully Reset - EduLearn",
    html,
  });
};
