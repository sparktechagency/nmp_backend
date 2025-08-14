import { z } from "zod";

export const createPolicyValidationSchema = z.object({
  type: z.string({
    invalid_type_error: "type must be a valid string value.",
  })
    .refine((val) => ["privacy-policy", "terms-condition", "about-us", "help"].includes(val), {
      message: "type must be one of: 'privacy-policy', 'terms-condition', 'about-us', 'help'",
    }).optional(),
  content: z
    .string()
    .min(1, { message: "Content must not be empty." })
    .refine(
      (val) =>
        /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/i.test(val.trim()) ||
        val.includes("<"),
      {
        message: "Content must be valid HTML.",
      }
    ),
});


