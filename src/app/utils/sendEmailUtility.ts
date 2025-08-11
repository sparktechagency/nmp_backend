import config from "../config";
import nodemailer from "nodemailer";

const sendEmailUtility = async (EmailTo: string, name: string, otp: string) => {
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

  const mailOptions = {
    from: `MTK Ecommerce ${config.smtp_from}`, //sender email address//smtp-username
    to: EmailTo, //receiver email address
    subject: "MTK Ecommerce Reset Password",
     html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background-color: #1f2937; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">MTK Ecommerce</h1>
        <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 16px;">Password Reset Request</p>
      </div>
      
      <!-- Main Content -->
      <div style="background-color: #ffffff; padding: 40px 30px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${name}!</h2>
        <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Use the verification code below to proceed.</p>
        
        <!-- Verification Code -->
        <div style="background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="color: #374151; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">Your Verification Code:</p>
          <div style="background-color: #1f2937; color: #ffffff; font-size: 32px; font-weight: 700; padding: 20px 30px; border-radius: 8px; letter-spacing: 4px; font-family: Monaco, monospace; display: inline-block;">${otp}</div>
        </div>
        
        <!-- Timer Warning -->
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">⏰ This verification code is valid for 10 minutes only.</p>
        </div>
        
        <!-- Security Notice -->
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 500;">🔒 If you didn't request this, please ignore this email.</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2024 MTK Ecommerce. All rights reserved.</p>
      </div>
    </div>
  `
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmailUtility;