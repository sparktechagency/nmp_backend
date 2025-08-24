import { z } from 'zod';
import { Types } from "mongoose";

export const updateProductValidationSchema = z.object({
  name: z.string({
    invalid_type_error: "name must be string",
    required_error: "name is required",
  })
    .min(1, "name is required")
    // .regex(
    //   categoryRegex,
    //   "name only contain letters and valid symbols (' . - & , ( )) are allowed."
    // )
    .trim().optional(),
  categoryId: z
    .string({
      invalid_type_error: "categoryId must be a string",
      required_error: "categoryId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "categoryId must be a valid ObjectId",
    }).optional(),
  brandId: z
    .string({
      invalid_type_error: "brandId must be a string",
      required_error: "brandId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "brandId must be a valid ObjectId",
    })
    .optional(),
  flavorId: z
    .string({
      invalid_type_error: "flavorId must be a string",
      required_error: "flavorId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "flavorId must be a valid ObjectId",
    })
    .optional(),
  currentPrice: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "Current price is required",
          invalid_type_error: "Current price must be a number",
        })
        .refine((val) => !isNaN(val), { message: "Current price must be a valid number" })
        .refine((val) => val > 0, { message: "Current price must be greater than 0" })
    ).optional()
  ,
  originalPrice: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "Original price must be a number",
        })
        .refine((val) => !isNaN(val), {
          message: "Original price must be a valid number",
        })
        .refine((val) => val >= 0, {
          message: "Original price cannot be negative",
        })
    )
    .optional(),
  discount: z.string({
    invalid_type_error: "discount must be string"
  }).optional(),
  description: z
    .string({
      invalid_type_error: "description must be string",
      required_error: "description is required"
    })
    .min(1, { message: "description is required" })
    .refine(
      (val) =>
        /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/i.test(val.trim()) ||
        val.includes("<"),
      {
        message: "description must be valid HTML.",
      }
    ).optional(),
  status: z.string({
    invalid_type_error: "status must be a valid string value.",
  })
    .refine((val) => ['visible', 'hidden'].includes(val), {
      message: "status must be one of: 'visible', 'hidden'",
    }).optional(),
  stockStatus: z.string({
    invalid_type_error: "Stock Status must be a valid string value.",
  })
    .refine((val) => ['in_stock', 'stock_out', 'up_coming'].includes(val), {
      message: "Stock Status must be one of: in_stock', 'stock_out', 'up_coming'",
    }).optional(),
  isFeatured: z.boolean({
    invalid_type_error: "isFeatured value must be boolean"
  }).optional()
});