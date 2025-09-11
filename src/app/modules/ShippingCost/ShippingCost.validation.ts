/* eslint-disable no-useless-escape */
import { z } from 'zod';

export const createShippingCostValidationSchema = z.object({
  name: z.string({
    required_error: "name is required!",
    invalid_type_error: "name must be string"
  }).
    min(1, "Name is required")
    .regex(/^[^~!@#$%\^*\+\?><=;:"]*$/, {
      message: 'Name cannot contain special characters: ~ ! @ # $ % ^ * + ? > < = ; : "',
    }),
  minSubTotal: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "minSubTotal must be a number",
          required_error: "minSubTotal is required"
        })
        .refine((val) => !isNaN(val), {
          message: "minSubTotal must be a valid number",
        })
        .refine((val) => val >= 0, {
          message: "minSubTotal cannot be negative",
        })
    ),
  maxSubTotal: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "maxSubTotal is required",
          invalid_type_error: "maxSubTotal must be a number",
        })
        .refine((val) => !isNaN(val), { message: "maxSubTotal must be a valid number" })
        .refine((val) => val > 0, { message: "maxSubTotal must be greater than 0" })
    ),
  cost: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "cost must be a number",
          required_error: "cost value is required"
        })
        .refine((val) => !isNaN(val), {
          message: "cost must be a valid number",
        })
        .refine((val) => val >= 0, {
          message: "cost cannot be negative",
        })
    ),
  priority: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "priority is required",
          invalid_type_error: "priority must be a number",
        })
        .refine((val) => !isNaN(val), { message: "priority must be a valid number" })
        .refine((val) => val > 0, { message: "priority must be greater than 0" })
    ),
})
.superRefine((values, ctx) => {
    const { minSubTotal, maxSubTotal } = values
    if (Number(minSubTotal) && Number(maxSubTotal) && (Number(minSubTotal) > Number(maxSubTotal))) {
      ctx.addIssue({
        path: ["maxSubTotal"],
        message: "Maximum value must be greater than Minimum value",
        code: z.ZodIssueCode.custom,
      });
      ctx.addIssue({
        path: ["minSubTotal"],
        message: "Minimum value must be less than Maximum value",
        code: z.ZodIssueCode.custom,
      });
    }
  });


export const updateShippingCostValidationSchema = z.object({
  name: z.string({
    required_error: "name is required!",
    invalid_type_error: "name must be string"
  }).
    min(1, "Name is required")
    .regex(/^[^~!@#$%\^*\+\?><=;:"]*$/, {
      message: 'Name cannot contain special characters: ~ ! @ # $ % ^ * + ? > < = ; : "',
    }).optional(),
  minSubTotal: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "minSubTotal must be a number",
          required_error: "minSubTotal is required"
        })
        .refine((val) => !isNaN(val), {
          message: "minSubTotal must be a valid number",
        })
        .refine((val) => val >= 0, {
          message: "minSubTotal cannot be negative",
        })
    ).optional(),
  maxSubTotal: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "maxSubTotal is required",
          invalid_type_error: "maxSubTotal must be a number",
        })
        .refine((val) => !isNaN(val), { message: "maxSubTotal must be a valid number" })
        .refine((val) => val > 0, { message: "maxSubTotal must be greater than 0" })
    ).optional(),
  cost: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "cost must be a number",
          required_error: "cost value is required"
        })
        .refine((val) => !isNaN(val), {
          message: "cost must be a valid number",
        })
        .refine((val) => val >= 0, {
          message: "cost cannot be negative",
        })
    ).optional(),
  priority: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "priority is required",
          invalid_type_error: "priority must be a number",
        })
        .refine((val) => !isNaN(val), { message: "priority must be a valid number" })
        .refine((val) => val > 0, { message: "priority must be greater than 0" })
    ).optional(),
  isActive: z.boolean({
    invalid_type_error: "isActive must be boolean value"
  }).optional()
})
.superRefine((values, ctx) => {
    const { minSubTotal, maxSubTotal } = values
    if (Number(minSubTotal) && Number(maxSubTotal) && (Number(minSubTotal) > Number(maxSubTotal))) {
      ctx.addIssue({
        path: ["maxSubTotal"],
        message: "Maximum value must be greater than Minimum value",
        code: z.ZodIssueCode.custom,
      });
      ctx.addIssue({
        path: ["minSubTotal"],
        message: "Minimum value must be less than Maximum value",
        code: z.ZodIssueCode.custom,
      });
    }
});

