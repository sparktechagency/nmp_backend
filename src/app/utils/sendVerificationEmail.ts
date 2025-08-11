import config from "../config";
import nodemailer from "nodemailer";

const sendVerificationEmail = async (email: string, name: string, token: string) => {
  //transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports //587,
    auth: {
      user: config.smtp_username,
      pass: config.smtp_password,
    },
  });

   const verifyUrl = `https://triplem-website-integration.vercel.app/auth/verification?token=${token}`;

  const mailOptions = {
    from: `MTK Ecommerce ${config.smtp_from}`, //sender email address//smtp-username
    to: email, //receiver email address
    subject: "Verify Your Email - MTK Ecommerce",
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background-color: #059669; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="background-color: #ffffff; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
          <span style="font-size: 36px;">✉️</span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">MTK Ecommerce</h1>
        <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">Email Verification Required</p>
      </div>
      
      <!-- Main Content -->
      <div style="background-color: #ffffff; padding: 40px 30px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
        <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">Welcome to MTK Ecommerce! Please verify your email address to get started.</p>
        
        <!-- Verification Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verifyUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">
            ✅ Verify My Email Address
          </a>
        </div>
        
        <!-- Alternative Link -->
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 500;">Button not working? Copy this link:</p>
          <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; padding: 12px; word-break: break-all; font-size: 13px; font-family: Monaco, monospace; color: #059669;">
            ${verifyUrl}
          </div>
        </div>
        
        <!-- Timer Warning -->
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; display: flex; align-items: center;">
          <div style="background-color: #f59e0b; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <span style="color: #ffffff; font-size: 16px;">⏰</span>
          </div>
          <div>
            <p style="color: #92400e; margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">Time Sensitive!</p>
            <p style="color: #92400e; margin: 0; font-size: 13px;">This link is valid for <strong>10 minutes only</strong>.</p>
          </div>
        </div>
        
        <!-- Security Notice -->
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 500;">🛡️ If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px;">Need help? Contact <a href="mailto:support@mtkecommerce.com" style="color: #059669; text-decoration: none;">support@mtkecommerce.com</a></p>
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2024 MTK Ecommerce. All rights reserved.</p>
      </div>
    </div>
  `
  };

  return await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;