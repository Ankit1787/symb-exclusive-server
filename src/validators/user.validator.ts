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
export const updateProfileSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.email("Invalid email").optional(),
    phoneNumber: z.string().optional(),

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

    currentPassword: z.string().optional(),
    newPassword: z.string().min(6).optional(),
    confirmPassword: z.string().min(6).optional(),
  })
  .superRefine((data, ctx) => {
    const wantsPasswordChange =
      data.currentPassword ||
      data.newPassword ||
      data.confirmPassword;

    if (wantsPasswordChange) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: "Current password is required",
        });
      }

      if (!data.newPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: "New password is required",
        });
      }

      if (!data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Confirm password is required",
        });
      }

      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    }
  });

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(2),
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
