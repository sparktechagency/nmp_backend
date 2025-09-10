import { z } from 'zod';

export const createShippingCostValidationSchema = z.object({
  name: z.string({
    required_error: "name is required!"
  }).
    min(1, "Name is required"),
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
});


export const updateShippingCostValidationSchema = z.object({
  name: z.string({
    required_error: "name is required!"
  }).
    min(1, "Name is required").optional(),
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
});

