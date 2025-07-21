"use server ";

import { ErrorCode } from "@/constants/error-codes";
import { LookupFormData, LookupSchema } from "@/schemas/user/auth";
import { getUserByEmail } from "@/services/prisma/user.service";

export const lookup = async (registerData: LookupFormData) => {
  const validatedFields = LookupSchema.safeParse(registerData);

  if (!validatedFields.success) {
    return {
      success: false,
      heading: "Lookup Email",
      decription: "Please Add a valid email address.",
      type: "error",
      code: ErrorCode.INVALID_FIELDS,
    };
  }

  const { email } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      success: false,
      heading: "Email Lookup Failed",
      description: "The email is not associated with any account.",
      type: "error",
      code: ErrorCode.USER_NOT_FOUND,
    };
  }

  return {
    success: true,
    heading: "Email Found",
    description: `The email  ${email} is linked to an account!`,
    type: "success",
  };
};
