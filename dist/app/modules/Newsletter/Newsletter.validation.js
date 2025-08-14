"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyContactValidationSchema = exports.newsletterValidationSchema = void 0;
const zod_1 = require("zod");
exports.newsletterValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "email is required",
    })
        .email({
        message: "Invalid email address",
    })
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
