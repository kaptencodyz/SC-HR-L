import * as z from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  //add handle later
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Minimum 6 characters required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const handleSchema = z.object({
  handle: z.string().min(1, { message: "Handle is required" }),
});
