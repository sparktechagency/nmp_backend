"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartValidationSchema = exports.createCartValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createCartValidationSchema = zod_1.z.object({
    productId: zod_1.z
        .string({
        invalid_type_error: "productId must be a valid ObjectId",
        required_error: "productId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "productId must be a valid ObjectId",
    }),
    quantity: zod_1.z
        .preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), zod_1.z
        .number({
        required_error: "quantity is required",
        invalid_type_error: "quantity must be a number",
    })
        .refine((val) => !isNaN(val), { message: "quantity must be a valid number" })
        .refine((val) => val > 0, { message: "quantity must be greater than 0" })),
});
exports.updateCartValidationSchema = zod_1.z.object({
    quantity: zod_1.z
        .preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), zod_1.z
        .number({
        required_error: "quantity is required",
        invalid_type_error: "quantity must be a number",
    })
        .refine((val) => !isNaN(val), { message: "quantity must be a valid number" })
        .refine((val) => val > 0, { message: "quantity must be greater than 0" })),
});
