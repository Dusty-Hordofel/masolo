import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prismadb from "./lib/prismadb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismadb),
  providers: [],
});
