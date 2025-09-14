import { z } from 'zod';

export const createInformationValidationSchema = z.object({
  title: z
    .string({
      invalid_type_error: "title must be string",
      required_error: "title is required",
    })
    .trim()
    .min(1, "title is required"),
  subTitle: z
    .string({
      invalid_type_error: "subTitle must be string",
      required_error: "subTitle is required",
    })
    .trim()
    .min(1, "subTitle is required"),
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
    .min(1, "phone is required")
    .regex(/^\+?\d+$/, {
      message: "Phone number can contain only numbers and +",
    }),
  address: z
    .string({
      invalid_type_error: "address must be string",
      required_error: "address is required",
    })
    .trim()
    .min(1, "address is required"),
  instagram: z
    .string({
      invalid_type_error: "instagram must be a valid URL",
      required_error: "Instagram Link is required"
    })
    .min(1, "Instagram Link is required")
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "instagram must be a valid URL",
    }),
  facebook: z
    .string({
      invalid_type_error: "facebook must be a valid URL",
      required_error: "Facebook Link is required"
    })
    .min(1, "Facebook Link is required")
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Facebook must be a valid URL",
    }),
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .min(0, { message: "Age can't be negative value" })
});


export const countDownDateSchema = z.object({
  date: z
    .string({
      required_error: "date is required",
      invalid_type_error: "date must be string value"
    })
    .min(1, { message: "date is required" })
    .refine(
      (value) => {
        // Must match YYYY-MM-DD
        const dateRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        return dateRegex.test(value);
      },
      {
        message: `Invalid Date format, expected 'YYYY-MM-DD'`,
      }
    )
    .refine(
      (date) => {
        const today = new Date();
        const inputDate = new Date(date);

        // Strip time for day-only comparison
        const input = inputDate.setHours(0, 0, 0, 0);
        const min = today.setHours(0, 0, 0, 0);

        return input >= min; // must be today or later
      },
      {
        message: "Date must be today or a future date",
      }
    ),
  time: z
    .string({
      required_error: "Time is required",
    })
    .min(1, { message: "Time is required" })
    .refine(
      (value) => {
        // Matches HH:MM:SS (24-hour format)
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        return regex.test(value);
      },
      {
        message: 'Invalid time format, expected "HH:MM:SS" in 24-hour format',
      }
    )
});