"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPolicyValidationSchema = void 0;
const zod_1 = require("zod");
exports.createPolicyValidationSchema = zod_1.z.object({
    type: zod_1.z.string({
        invalid_type_error: "type must be a valid string value.",
    })
        .refine((val) => ["privacy-policy", "terms-condition", "about-us", "help"].includes(val), {
        message: "type must be one of: 'privacy-policy', 'terms-condition', 'about-us', 'help'",
    }).optional(),
    content: zod_1.z
        .string()
        .min(1, { message: "Content must not be empty." })
        .refine((val) => /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/i.test(val.trim()) ||
        val.includes("<"), {
        message: "Content must be valid HTML.",
    }),
});
