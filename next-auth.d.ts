import { DefaultUser } from "@auth/core/types";
import { Store } from "@prisma/client";

declare module "@auth/core/types" {
  interface User extends DefaultUser {
    id: string;
    role: string;
    store: Store[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
    store: Store[];
  }
}

declare module "@auth/core/types" {
  interface Session {
    user?: {
      id: string;
      role: string;
      store: Store[];
    } & DefaultUser;
  }
}