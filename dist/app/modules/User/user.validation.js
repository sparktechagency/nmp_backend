"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidationSchema = exports.createUserValidationSchema = exports.fullNameRegex = void 0;
const zod_1 = require("zod");
// /^([A-Z][a-zA-Z'.\-]*\s?)+$/ => letter, each word capitalized, only contain letters, spaces, apostrophes, hyphens, and dots.
exports.fullNameRegex = /^[A-Za-z\s'.-]+$/; //only contain letters, spaces, apostrophes, hyphens, and dots
exports.createUserValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        invalid_type_error: "Full Name must be string",
        required_error: "full Name is required",
    })
        .trim()
        .regex(exports.fullNameRegex, {
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
    password: zod_1.z
        .string({
        invalid_type_error: "password must be string",
        required_error: "password is required",
    })
        .trim()
        .min(6, "Password minimum 6 characters long")
        .max(60, "Password maximum 60 characters long")
});
//const onlyInternationalFormate = /^\+?[1-9]\d{1,14}$/
exports.updateProfileValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        invalid_type_error: "Full Name must be string",
        required_error: "full Name is required",
    })
        .trim()
        .regex(exports.fullNameRegex, {
        message: "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }).optional(),
    phone: zod_1.z
        .string()
    // .regex(onlyInternationalFormate, {
    //   message: "Invalid phone number format",
    // }),
});
