import { z } from 'zod';
import { fullNameRegex } from '../User/user.validation';
import { Types } from "mongoose";


export const createOrderValidationSchema = z.object({
  userData: z.object({
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
  }),
  shippingAddress: z.object({
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
  }),
  cartProducts: z.array(
    z.object({
      productId: z
        .string({
          invalid_type_error: "productId must be a valid ObjectId",
          required_error: "productId is required!",
        })
        .refine((id) => Types.ObjectId.isValid(id), {
          message: "productId must be a valid ObjectId",
        }),
      quantity: z
        .number({
          required_error: "quantity is required",
          invalid_type_error: "quantity must be a number",
        })
        .refine((val) => !isNaN(val), { message: "quantity must be a valid number" })
        .refine((val) => val > 0, { message: "quantity must be minimum 1" })
      ,
      price: z
        .number({
          required_error: "price is required",
          invalid_type_error: "price must be a number",
        })
        .refine((val) => !isNaN(val), { message: "price must be a valid number" })
        .refine((val) => val > 0, { message: "price must be minimum 1" })
      ,
    })
  ).min(1, "You must add at least one product to the cart !")
});


export const updateOrderValidationSchema = z.object({
  status: z.string({
    invalid_type_error: "status must be a valid string value.",
  })
    .refine((val) => ['processing', 'shipped', 'delivered', 'cancelled'].includes(val), {
      message: "status must be one of: 'processing', 'shipped', 'delivered', 'cancelled'",
    })
});

export const updateTipsValidationSchema = z.object({
  tips: z
    .number({
      required_error: "tips is required",
      invalid_type_error: "tips must be a number",
    })
    .refine((val) => !isNaN(val), { message: "tips must be a valid number" })
    .refine((val) => val > 0, { message: "tips must be minimum 1" })
});
