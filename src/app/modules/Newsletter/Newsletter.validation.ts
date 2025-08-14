import { z } from 'zod';

export const newsletterValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .email({
      message: "Invalid email address",
    })
});

export const replyContactValidationSchema = z.object({
  replyText: z
    .string({
      invalid_type_error: "Reply text must be string",
      required_error: "Reply text is required",
    })
    .trim()
    .min(1, "Reply text is required")
});
