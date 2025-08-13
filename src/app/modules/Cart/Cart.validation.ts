import { z } from 'zod';
import { Types } from "mongoose";

export const createCartValidationSchema = z.object({
  productId: z
    .string({
      invalid_type_error: "productId must be a valid ObjectId",
      required_error: "productId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "productId must be a valid ObjectId",
    }),
  quantity: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "quantity is required",
          invalid_type_error: "quantity must be a number",
        })
        .refine((val) => !isNaN(val), { message: "quantity must be a valid number" })
        .refine((val) => val > 0, { message: "quantity must be greater than 0" })
    )
  ,
});

export const updateCartValidationSchema = z.object({
   quantity: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "quantity is required",
          invalid_type_error: "quantity must be a number",
        })
        .refine((val) => !isNaN(val), { message: "quantity must be a valid number" })
        .refine((val) => val > 0, { message: "quantity must be greater than 0" })
    )
  ,
});
