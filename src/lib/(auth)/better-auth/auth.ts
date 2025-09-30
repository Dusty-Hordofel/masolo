import {
  magicLink,
  multiSession,
  oneTap,
  twoFactor,
} from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/(db)/prisma";
import { resend } from "@/lib/email/resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/components/emails/Verification-email";
import { ResetPasswordEmail } from "@/components/emails/reset-password";
import { MagicLinkEmail } from "@/components/emails/magic-link-email";
import { EmailChange } from "@/components/emails/email-change";
import AccountDeletion from "@/components/emails/account-deletion";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";

const from = process.env.EMAIL_FROM || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

export const auth = betterAuth({
  appName: "better_auth_nextjs",
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({
          username: user.name,
          resetLink: url,
        }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Automatically sends the email verification link after sign-up (Recommended: true)
    autoSignInAfterVerification: true, // Enables automatic sign-in after email verification (Recommended: true)
    async sendVerificationEmail({ user, url }) {
      const emailHtml = await render(
        VerificationEmail({ verificationUrl: url, user })
      );
      // const res =
      await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Verify your email address",
        html: emailHtml,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "microsoft", "apple", "facebook"],
      allowDifferentEmails: true,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        try {
          await resend.emails.send({
            from,
            to: to || newEmail,
            subject: "Verify your email change",
            react: EmailChange({
              username: user.name,
              newEmail,
              oldEmail: user.email,
              confirmationLink: url,
            }),
          });
        } catch (error) {
          console.log(
            "Error in sending change email verification email: ",
            error
          );
        }
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await resend.emails.send({
          from,
          to: to || user.email,
          subject: "Verify your identity to delete account",
          react: AccountDeletion({
            username: user.name,
            confirmationLink: url,
          }),
        });
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    // apple: {
    //   clientId: process.env.APPLE_CLIENT_ID as string,
    //   clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    // },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    },
  },
  
  plugins: [
    // other plugin options
    magicLink({
      disableSignUp: true, // Disable using magic link at signup
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from,
          to: to || email,
          subject: "Magic Link",
          react: MagicLinkEmail({
            magicLinkUrl: url,
            email,
          }),
        });
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          const { data, error } = await resend.emails.send({
            from,
            to: to || user.email,
            subject: "Your OTP",
            html: `Your OTP is ${otp}`,
          });
          console.log("🚀 ~ sendOTP ~ data:DA", data);

          if (error) {
            return console.error({ error });
          }
        },
      },
    }),
    passkey(),
    multiSession(),
    oneTap(),
    nextCookies(),
  ],
});
