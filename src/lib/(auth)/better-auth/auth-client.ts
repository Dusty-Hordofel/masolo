import {
  magicLinkClient,
  passkeyClient,
  twoFactorClient,
  multiSessionClient,
  oneTapClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    magicLinkClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/two-factor-verification";
      },
    }),
    passkeyClient(),
    multiSessionClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      promptOptions: {
        maxAttempts: 1,
      },
    }),
  ],
});

export const {
  signIn,
  signOut,
  signUp,
  getSession,
  useSession,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  twoFactor,
  changeEmail,
  changePassword,
  updateUser,
  deleteUser,
} = client;
