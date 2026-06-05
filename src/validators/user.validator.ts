import * as z from "zod";

export const registerUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2).optional(),
  identifier: z.string().min(2),
  password: z.string().min(6),
});

export const loginUserSchema = z.object({
  identifier: z.string().min(2),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email("Invalid email"),
  address: z
    .object({
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    })
    .optional(),
    phoneNumber:
    z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6).optional(),
    confirmPassword: z.string().min(6).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const validateRegisterUser = (data: unknown) => {
  return registerUserSchema.parse(data);
};
export const validateLoginUser = (data: unknown) => {
  return loginUserSchema.parse(data);
};
