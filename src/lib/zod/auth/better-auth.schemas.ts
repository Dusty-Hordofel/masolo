import { z } from "zod";

export const OtpFormSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Code must be 6 digits" })
    .max(6, { message: "Code must be 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only numbers" }),
});

// Form schema for validation
export const PasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  // newPassword: passwordSchema,
  // confirmPassword: z.string(),
});

export const createTwoFaFormSchema = () =>
  z
    .object({
      isTwoFactorEnabled: z.boolean(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must be at most 16 characters")
        .optional(),
      otp: z
        .string()
        .optional()
        .transform((val) => (val === "" ? undefined : val))
        .refine((val) => val === undefined || /^\d{6}$/.test(val), {
          message: "OTP must be exactly 6 digits",
        }),
      twoFactorVerifyURI: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // If enabling 2FA with a QR code (twoFactorVerifyURI exists), OTP is required
      if (data.isTwoFactorEnabled && data.twoFactorVerifyURI && !data.otp) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "OTP is required when enabling 2FA with a QR code",
          path: ["otp"],
        });
        return false;
      }

      // If enabling 2FA without a QR code, password is required
      if (
        data.isTwoFactorEnabled &&
        !data.twoFactorVerifyURI &&
        !data.password
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required when enabling 2FA without a QR code",
          path: ["password"],
        });
        return false;
      }

      // If disabling 2FA, password is required
      if (!data.isTwoFactorEnabled && !data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required when disabling 2FA",
          path: ["password"],
        });
        return false;
      }
    });

export const TwoFaFormSchema = createTwoFaFormSchema();

export type OtpFormValues = z.infer<typeof OtpFormSchema>;
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>;
export type TwoFaFormValues = z.infer<typeof TwoFaFormSchema>;
