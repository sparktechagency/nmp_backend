import config from "../config";
import nodemailer from "nodemailer";

const sendCancelledEmail = async (email: string, orderData:any) => {

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
        from: `Online Corner Store ${config.smtp_from}`, //sender email address//smtp-username
        to: email, //receiver email address
        subject:`Order Cancelled - ${orderData.token}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled - ${orderData?.token}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Order Cancelled</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We've processed your cancellation</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 12px 24px; border-radius: 25px; font-weight: bold; font-size: 14px;">
                                    ❌ CANCELLED
                                </div>
                            </div>
                            
                            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${orderData?.customerName},</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                                Your order has been successfully cancelled as requested. We've processed your refund and you should see it reflected in your account within the timeframe specified below.
                            </p>
                            
                            <!-- Cancellation Details -->
                            <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 25px; margin: 25px 0;">
                                <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">Cancellation Details</h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="color: #6b7280; font-size: 14px; padding: 5px 0;">Order Number:</td>
                                        <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right; padding: 5px 0;">${orderData?.token}</td>
                                    </tr>
                                     <tr>
                                        <td style="color: #6b7280; font-size: 14px; padding: 5px 0;">Sub Total:</td>
                                        <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right; padding: 5px 0;">${orderData?.subTotal}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #6b7280; font-size: 14px; padding: 5px 0;">Shipping Cost:</td>
                                        <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right; padding: 5px 0;">${orderData?.shippingCost}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #6b7280; font-size: 14px; font-weight: bold; padding: 5px 0;">Total:</td>
                                        <td style="color: #1f2937; font-size: 16px; font-weight: bold; text-align: right; padding: 5px 0;">$${orderData?.total}</td>
                                    </tr>
                                </table>
                            </div>
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

export default sendCancelledEmail;