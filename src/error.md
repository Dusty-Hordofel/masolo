### AUTH

```ts
  async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.ts(2322)
(property) id: string
```

```ts
 async jwt({ token, user }) {
      token.id = user.id; // Ajoute l'ID utilisateur au token.
      token.role = user.role;
      return token;
    },
Property 'role' does not exist on type 'User | AdapterUser'.
Property 'role' does not exist on type 'User'.ts(2339)
```

# Gestion de l'erreur `Property 'role' does not exist on type 'User | AdapterUser'`

## Problème

Lorsque vous essayez d'ajouter une propriété `role` à votre `token` ou `session` dans NextAuth, TypeScript renvoie l'erreur suivante :

Property ‘role’ does not exist on type ‘User | AdapterUser’.

Cela se produit parce que NextAuth ne reconnaît pas automatiquement la propriété `role` définie dans votre modèle Prisma `User`.

---

## Solution

### Étape 1 : Étendre les types de NextAuth

Créez ou modifiez un fichier `next-auth.d.ts` dans votre projet (par exemple, dans un dossier `types` ou dans `src/`).

Ajoutez les définitions suivantes pour étendre les types par défaut de NextAuth :

```typescript
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string; // Déclarez la propriété `role`
  }

  interface Session {
    user: {
      id: string;
      role: string; // Inclure `role` dans `session.user`
      email?: string;
      name?: string;
      image?: string;
    };
  }

  interface JWT {
    id: string;
    role: string; // Ajoutez `role` au token JWT
  }
}

Étape 2 : Configurer les callbacks dans NextAuth

Modifiez votre fichier de configuration NextAuth pour inclure la propriété role dans le token et la session.

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter `role` au token JWT
      if (user) {
        token.id = user.id;
        token.role = user.role; // Ajout de la propriété `role`
      }
      return token;
    },

    async session({ session, token }) {
      // Ajouter `role` à la session utilisateur
      session.user.id = token.id as string;
      session.user.role = token.role as string; // Pas d'erreur ici
      return session;
    },
  },
});

Étape 3 : Vérifiez votre configuration TypeScript

Assurez-vous que votre configuration TypeScript reconnaît correctement les extensions de type :
	•	Le fichier next-auth.d.ts doit être inclus dans le projet.
	•	Si vous rencontrez des problèmes, redémarrez le serveur de développement.

Résultat

	•	La propriété role est maintenant accessible dans vos callbacks NextAuth.
	•	Vous pouvez utiliser session.user.role et token.role sans erreur.
	•	Le modèle Prisma User avec la propriété role est pris en charge.

Exemple d’accès à la propriété role :

async function exampleHandler(req, res) {
  const session = await getSession({ req });
  console.log("User Role:", session?.user.role);
}

Références

	•	NextAuth Documentation
	•	Prisma Documentation

```
