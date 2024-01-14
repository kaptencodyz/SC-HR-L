import { object, z } from "zod";

export const signUpSchema = object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  //add handle later
});

export const signInSchema = object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const newPasswordSchema = object({
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Minimum 6 characters required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = object({
  email: z.string().email({ message: "Email is required" }),
});
