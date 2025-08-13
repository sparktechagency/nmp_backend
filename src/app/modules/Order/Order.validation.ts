import { z } from 'zod';


export const createOrderValidationSchema = z.object({
  streetAddress: z
    .string({
      invalid_type_error: "street address must be string",
      required_error: "Street Address is required"
    })
    .trim()
    .min(1, { message: "Street Address is required" }),
  city: z
    .string({
      invalid_type_error: "city must be string",
      required_error: "city is required"
    })
    .trim()
    .min(1, { message: "City is required" }),
  state: z
    .string({
      invalid_type_error: "state must be string",
      required_error: "State is required"
    })
    .trim()
    .min(1, { message: "State is required" }),
  zipCode: z
    .string({
      required_error: "Zip Code is required"
    })
    .trim()
    .min(5, { message: "Zip Code must be at least 5 digits" })
    .regex(/^\d+$/, { message: "Zip Code must contain only numbers" }),
});


export const updateOrderValidationSchema = z.object({
  status: z.string({
    invalid_type_error: "status must be a valid string value.",
  })
    .refine((val) => ['processing', 'shipped', 'delivered', 'cancelled'].includes(val), {
      message: "status must be one of: 'processing', 'shipped', 'delivered', 'cancelled'",
    })
});
