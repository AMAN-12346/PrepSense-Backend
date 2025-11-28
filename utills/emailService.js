const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your PrepSense OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16525B;">Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #4F7C82; letter-spacing: 10px; font-size: 32px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #888888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to PrepSense.ai',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16525B;">Welcome ${fullName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>Start your journey with PrepSense.ai and ace your exams.</p>
        <a href="${process.env.APP_URL}" style="background-color: #16525B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
