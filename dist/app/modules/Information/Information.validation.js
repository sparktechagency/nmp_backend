"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInformationValidationSchema = void 0;
const zod_1 = require("zod");
exports.createInformationValidationSchema = zod_1.z.object({
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
        .min(1, "phone is required")
        .regex(/^\+?\d+$/, {
        message: "Phone number can contain only numbers and +",
    }),
    address: zod_1.z
        .string({
        invalid_type_error: "address must be string",
        required_error: "address is required",
    })
        .trim()
        .min(1, "address is required"),
    instagram: zod_1.z
        .string({
        invalid_type_error: "instagram must be a valid URL",
        required_error: "Instagram Link is required"
    })
        .min(1, "Instagram Link is required")
        .trim()
        .refine((val) => val === "" || zod_1.z.string().url().safeParse(val).success, {
        message: "instagram must be a valid URL",
    }),
    telegram: zod_1.z
        .string({
        invalid_type_error: "telegram must be a valid URL",
        required_error: "Telegram Link is required"
    })
        .min(1, "Telegram Link is required")
        .trim()
        .refine((val) => val === "" || zod_1.z.string().url().safeParse(val).success, {
        message: "telegram must be a valid URL",
    })
});
