"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flavorValidationSchema = exports.flavorRegex = void 0;
const zod_1 = require("zod");
exports.flavorRegex = /^[A-Za-z\s'.\-&,()]+$/;
exports.flavorValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        invalid_type_error: "name must be string",
        required_error: "name is required",
    })
        .min(1, "name is required")
        .trim()
        .regex(/^[^0-9]*$/, {
        message: "name cannot contain numbers",
    })
        .regex(/^[^~!@#$%\^*\+\?><=;:"]*$/, {
        message: 'name cannot contain special characters: ~ ! @ # $ % ^ * + ? > < = ; : "',
    }),
});
