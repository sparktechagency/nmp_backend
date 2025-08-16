import { z } from "zod";
import { fullNameRegex } from "../User/user.validation";


export const createAdminValidationSchema = z.object({
  fullName: z.string({
    invalid_type_error: "Full Name must be string",
    required_error: "full Name is required",
  })
    .trim()
    .regex(fullNameRegex, {
      message:
        "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }),
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .trim()
    .email({
      message: "Invalid email address"
    }),
  phone: z
    .string({
      invalid_type_error: "phone must be string",
      required_error: "phone is required",
    })
    .trim()
    .min(1, "phone is required")
    .regex(/^\+?\d+$/, {
      message: "Phone number can contain only numbers and +",
    }),
  password: z
    .string({
      invalid_type_error: "password must be string",
      required_error: "password is required",
    })
    .trim()
    .min(6, "Password minimum 6 characters long")
    .max(60, "Password maximum 60 characters long")
    .optional()
});


export const updateAdminSchema = z.object({
  fullName: z.string({
    invalid_type_error: "Full Name must be string",
    required_error: "full Name is required",
  })
    .trim()
    .regex(fullNameRegex, {
      message:
        "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }).optional(),
  phone: z.string({
    required_error: "phone number is required",
  })
    .regex(/^\+?\d+$/, {
      message: "Phone number can contain only numbers and +",
    }).optional()
});
