import { model, Schema } from "mongoose";
import { IOtp } from "./otp.interface";


const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    otp: {
      type: String,
      required: [true, "otp is required"],
      trim: true,
      maxlength: 6,
      minlength: 6
    },
    status: {
      type: Number,
      default: 0,
    },
    otpExpires: {
      type: Date,
      default: () => new Date(+new Date() + 600000), // 10 minutes // OTP Code Will be expired within 10 minutes
    },
  },
);

const OtpModel = model<IOtp>("Otp", OtpSchema);
export default OtpModel;