"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSchema = exports.createAdminValidationSchema = void 0;
const zod_1 = require("zod");
const user_validation_1 = require("../User/user.validation");
exports.createAdminValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        invalid_type_error: "Full Name must be string",
        required_error: "full Name is required",
    })
        .trim()
        .regex(user_validation_1.fullNameRegex, {
        message: "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }),
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "email is required",
    })
        .trim()
        .email({
        message: "Invalid email address"
    }),
    phone: zod_1.z
        .string({
        invalid_type_error: "phone must be string",
        required_error: "phone is required",
    })
        .trim()
        .min(1, "phone is required")
        .regex(/^\+?\d+$/, {
        message: "Phone number can contain only numbers and +",
    }),
    password: zod_1.z
        .string({
        invalid_type_error: "password must be string",
        required_error: "password is required",
    })
        .trim()
        .min(6, "Password minimum 6 characters long")
        .max(60, "Password maximum 60 characters long")
        .optional()
});
exports.updateAdminSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        invalid_type_error: "Full Name must be string",
        required_error: "full Name is required",
    })
        .trim()
        .regex(user_validation_1.fullNameRegex, {
        message: "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }).optional(),
    phone: zod_1.z.string({
        required_error: "phone number is required",
    })
        .regex(/^\+?\d+$/, {
        message: "Phone number can contain only numbers and +",
    }).optional()
});
