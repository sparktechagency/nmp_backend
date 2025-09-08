import { Types } from "mongoose";
import { z } from "zod";


export const createFlavorValidationSchema = z.object({
    name: z
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
    typeId: z
        .string({
            invalid_type_error: "typeId must be a string",
            required_error: "typeId is required!",
        })
        .refine((id) => Types.ObjectId.isValid(id), {
            message: "typeId must be a valid ObjectId",
        })
});

export const updateFlavorValidationSchema = z.object({
    name: z
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
        }).optional(),
    typeId: z
        .string({
            invalid_type_error: "typeId must be a string",
            required_error: "typeId is required!",
        })
        .refine((id) => Types.ObjectId.isValid(id), {
            message: "typeId must be a valid ObjectId",
        }).optional()
});