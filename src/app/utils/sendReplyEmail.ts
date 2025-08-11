import config from "../config";
import nodemailer from "nodemailer";

const sendReplyEmail = async (email: string, replyMessage: string) => {
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
    to: email, //receiver email address
    subject: "Reply Message - MTK Ecommerce",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reply from MTK Ecommerce</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Logo/Icon -->
                        <div style="background-color: #ffffff; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);">
                          <span style="font-size: 36px; line-height: 1;">💬</span>
                        </div>
                        
                        <!-- Company Name -->
                        <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">MTK Ecommerce</h1>
                        <p style="color: #d1fae5; margin: 0; font-size: 18px; font-weight: 500;">Customer Support Reply</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 50px 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td>
                        <!-- Greeting -->     
                        <!-- Introduction -->
                        <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                          Thank you for reaching out to us. We've received your message and here's our response:
                        </p>
                        
                        <!-- Reply Message Container -->
                        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #059669; border-radius: 12px; padding: 30px; margin: 30px 0; position: relative;">
                          <!-- Quote Icon -->
                          <div style="position: absolute; top: -10px; left: 20px; background-color: #059669; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 16px; font-weight: bold;">"</span>
                          </div>
                          
                          <!-- Reply Content -->
                          <div style="color: #1f2937; font-size: 16px; line-height: 1.7; margin-top: 10px; white-space: pre-wrap;">
                            ${replyMessage}
                          </div>
                          
                          <!-- Support Team Signature -->
                          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #d1fae5;">
                            <p style="color: #059669; margin: 0; font-size: 14px; font-weight: 600;">
                              — MTK Ecommerce Support Team
                            </p>
                          </div>
                        </div>
                        
                        <!-- Call to Action -->
                        <div style="text-align: center; margin: 40px 0;">
                          <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px;">
                            Need further assistance? We're here to help!
                          </p>
                          <a href="mailto:support@mtkecommerce.com" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3); transition: all 0.3s ease;">
                            📧 Contact Support
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>  
            </table>   
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendReplyEmail;