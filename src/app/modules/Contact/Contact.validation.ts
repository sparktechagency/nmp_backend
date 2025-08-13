import { z } from 'zod';
import { fullNameRegex } from '../User/user.validation';

export const createContactValidationSchema = z.object({
  name: z.string({
    invalid_type_error: "Name must be string",
    required_error: "Name is required",
  })
    .trim()
    .regex(fullNameRegex, {
      message:
        "Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }),
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  phone: z
    .string({
      invalid_type_error: "phone must be string",
      required_error: "phone is required",
    })
    .trim()
    .min(1, "phone is required"),
  message: z
    .string({
      invalid_type_error: "message must be string",
      required_error: "message is required",
    })
    .trim()
    .min(1, "message is required")
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
