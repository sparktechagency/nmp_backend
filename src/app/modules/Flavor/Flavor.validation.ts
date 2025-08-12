import { z } from "zod";
export const flavorRegex = /^[A-Za-z\s'.\-&,()]+$/;


export const flavorValidationSchema = z.object({
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
});