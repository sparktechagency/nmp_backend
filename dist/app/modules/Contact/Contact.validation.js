"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyContactValidationSchema = exports.createContactValidationSchema = void 0;
const zod_1 = require("zod");
const user_validation_1 = require("../User/user.validation");
exports.createContactValidationSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: "Name must be string",
        required_error: "Name is required",
    })
        .trim()
        .regex(user_validation_1.fullNameRegex, {
        message: "Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }),
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "email is required",
    })
        .email({
        message: "Invalid email address",
    }),
    phone: zod_1.z
        .string({
        invalid_type_error: "phone must be string",
        required_error: "phone is required",
    })
        .trim()
        .min(1, "phone is required"),
    message: zod_1.z
        .string({
        invalid_type_error: "message must be string",
        required_error: "message is required",
    })
        .trim()
        .min(1, "message is required")
});
exports.replyContactValidationSchema = zod_1.z.object({
    replyText: zod_1.z
        .string({
        invalid_type_error: "Reply text must be string",
        required_error: "Reply text is required",
    })
        .trim()
        .min(1, "Reply text is required")
});
