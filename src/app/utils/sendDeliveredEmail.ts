import config from "../config";
import nodemailer from "nodemailer";

const sendDeliveredEmail = async (email: string, orderData:any) => {

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
        from: `NMP Ecommerce ${config.smtp_from}`, //sender email address//smtp-username
        to: email, //receiver email address
        subject: `Order Delivered - ${orderData.token}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered - ${orderData.token}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Delivered!</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has arrived</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 12px 24px; border-radius: 25px; font-weight: bold; font-size: 14px;">
                                    ✅ DELIVERED
                                </div>
                            </div>
                            
                            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${orderData?.customerName},</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                                Fantastic! Your order has been successfully delivered. We hope you love your purchase! Your satisfaction is our priority.
                            </p>
                            
                            <!-- Delivery Confirmation -->
                            <div style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                                <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">Delivery Confirmed</h3>
                                <p style="color: #6b7280; margin: 0 0 20px 0; font-weight: bold; font-size: 16px;">Order #${orderData?.token}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">Thank you for choosing us! Contact support@yourstore.com for any questions.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    };

    return await transporter.sendMail(mailOptions);
};

export default sendDeliveredEmail;