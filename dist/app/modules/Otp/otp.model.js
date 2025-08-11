"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
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
});
const OtpModel = (0, mongoose_1.model)("Otp", OtpSchema);
exports.default = OtpModel;
