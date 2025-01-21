import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prismadb from "./lib/prismadb";
import { Store, UserRole } from "@prisma/client";
import { getUserById } from "./services/prisma/user.service";
import { StoreService } from "./services/prisma/store.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismadb),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const dbUser = await getUserById(user.id as string);
        const stores = await prismadb.store.findMany({
          where: { ownerId: user.id },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.store =
            stores.length > 0
              ? stores.map((store) => ({
                  ...store,
                  description: store.description ?? undefined,
                  industry: store.industry ?? undefined,
                }))
              : [];
        }
      }

      // Update when `update()` is called
      if (trigger === "update") {
        const stores = await StoreService.getUserStores(token.id as string);
        token.store = stores;
      }

      return token;
    },

    async session({ session, token, user, trigger }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as UserRole,
          store: (token.store || []) as Store[],
        };
      }
      return session;
    },
  },
});
