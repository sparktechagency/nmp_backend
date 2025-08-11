"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidationSchema = exports.deleteAccountValidationSchema = exports.changeStatusValidationSchema = exports.changePasswordSchema = exports.forgotPassCreateNewPassSchema = exports.forgotPassVerifyOtpSchema = exports.forgotPassSendOtpSchema = exports.loginValidationSchema = exports.resendVerifyEmailSchema = void 0;
const zod_1 = require("zod");
exports.resendVerifyEmailSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "email is required",
    })
        .email({
        message: "Invalid email address",
    })
});
exports.loginValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "email is required",
    })
        .email({
        message: "Invalid email address",
    }),
    password: zod_1.z
        .string({
        invalid_type_error: "Password must be string",
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .max(60, "Password maximum 60 characters long")
        .trim(),
});
exports.forgotPassSendOtpSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "Email is required",
    })
        .email({
        message: "Invalid email address",
    })
        .trim(),
});
exports.forgotPassVerifyOtpSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "Email is required",
    })
        .trim()
        .email({
        message: "Invalid email address",
    }),
    otp: zod_1.z
        .string({
        required_error: "Otp is required",
    })
        .regex(/^\d{6}$/, "Otp must be a 6-digit number")
        .trim(),
});
exports.forgotPassCreateNewPassSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "Email is required",
    })
        .trim()
        .email({
        message: "Invalid email address",
    }),
    otp: zod_1.z
        .string({
        required_error: "Otp is required",
    })
        .regex(/^\d{6}$/, "Otp must be a 6-digit number")
        .trim(),
    password: zod_1.z
        .string({
        invalid_type_error: "Password must be string",
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .max(60, "Password maximum 60 characters long")
        .trim(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string({
        invalid_type_error: "Current Password must be string",
        required_error: "Current Password is required",
    })
        .min(6, "Current Password minimum 6 characters long")
        .max(60, "Current Password maximum 60 characters long")
        .trim(),
    newPassword: zod_1.z
        .string({
        invalid_type_error: "New Password must be string",
        required_error: "New Password is required",
    })
        .min(6, "New Password minimum 6 characters long")
        .max(60, "New Password maximum 60 characters long")
        .trim(),
});
exports.changeStatusValidationSchema = zod_1.z.object({
    status: zod_1.z
        .string({
        invalid_type_error: `status must be 'blocked' or 'unblocked'`,
        required_error: "status is required",
    })
        .refine((val) => ["blocked", "unblocked"].includes(val), {
        message: `status must be 'blocked' or 'unblocked'`,
    }),
});
exports.deleteAccountValidationSchema = zod_1.z.object({
    password: zod_1.z
        .string({
        invalid_type_error: "Password must be string",
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .max(60, "Password maximum 60 characters long")
        .trim(),
});
exports.refreshTokenValidationSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({
        required_error: "Refresh token is required !",
    }),
});
