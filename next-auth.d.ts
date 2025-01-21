import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    store: Store[]; // Ajouter les données du Store
  }

  interface Session {
    user: {
      id: string;
      role: string;
      email?: string;
      name?: string;
      image?: string;
      store: Store[]; // Inclure `store` dans la session utilisateur
    };
  }

  interface JWT {
    id: string;
    role: string;
    store: Store[]; // Ajouter `store` au JWT
  }
}

// next-auth.d.ts
// next-auth.d.ts
// import { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user?: {
//       id: string;
//       role: string;
//       store?: Store[];
//     } & DefaultSession["user"];
//   }

//   interface User extends DefaultUser {
//     id: string;
//     role: string;
//     store?: Store[];
//   }

//   interface JWT {
//     id: string;
//     role: string;
//     store?: Store[];
//   }
// }
