// import { UserRole } from "@prisma/client";
import { Store, UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendUser = DefaultSession["user"] & {
  role: UserRole;
  store: Store[];
};

declare module "next-auth" {
  interface Session {
    user: ExtendUser;
  }
}
