```ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prismadb from "./lib/prismadb";

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
});
```

Voici un exemple de contenu pour le fichier README.md :

# Gestion des Sessions dans NextAuth avec la Stratégie JWT

Ce projet utilise **NextAuth** pour l'authentification, configuré avec la stratégie de session `jwt`. Cette configuration permet une gestion des sessions légère et sans dépendance directe à une base de données pour les sessions.

---

## ⚙️ Configuration de `session: { strategy: "jwt" }`

### Qu'est-ce que la stratégie `jwt` ?

- Les sessions sont gérées à l'aide de JSON Web Tokens (JWT).
- Le token JWT est stocké côté client, généralement dans un cookie sécurisé.
- À chaque requête, le token est envoyé au serveur pour authentification et récupération des données utilisateur.

---

## ✅ Avantages de `jwt`

1. **Pas de dépendance à une base de données pour les sessions :**

   - Contrairement à `strategy: "database"`, les sessions ne nécessitent pas de table dédiée (comme `Session` dans Prisma).

2. **Stateless (sans état) :**

   - Les informations de session sont encodées directement dans le JWT.
   - Idéal pour les applications distribuées ou sans serveur (serverless).

3. **Facilité d'intégration avec les API :**

   - Les JWT peuvent être utilisés pour authentifier des requêtes API ou des microservices.

4. **Performance :**
   - Pas de requête supplémentaire à une base de données pour vérifier la session.

---

## ❌ Inconvénients de `jwt`

1. **Sécurité :**

   - Si un token JWT est compromis, un attaquant peut accéder aux données utilisateur jusqu'à ce que le token expire.
   - Une gestion efficace de la rotation et de la révocation des tokens est nécessaire (ex. : via des refresh tokens).

2. **Mise à jour des sessions :**
   - Si vous devez modifier les informations de session ou révoquer une session, cela peut être plus complexe que dans une stratégie basée sur une base de données.

---

## 🆚 Comparaison entre `jwt` et `database`

| **Aspect**                | **JWT (`strategy: "jwt"`)** | **Database (`strategy: "database"`)** |
| ------------------------- | --------------------------- | ------------------------------------- |
| **Stockage des sessions** | Côté client (token JWT)     | Base de données côté serveur          |
| **Scalabilité**           | Très scalable (stateless)   | Moins scalable (stateful)             |
| **Dépendance à la DB**    | Non                         | Oui                                   |
| **Revocation de session** | Complexe                    | Facile (suppression en DB)            |
| **Utilisation API-first** | Idéal                       | Moins pratique                        |

---

## Exemple de Configuration NextAuth avec JWT

```javascript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});

Cas d’Utilisation Recommandés pour jwt

	1.	Applications sans serveur (serverless) : Hébergées sur des plateformes comme Vercel ou AWS Lambda.
	2.	API-first : Applications principalement basées sur des API REST ou GraphQL.
	3.	Microservices : Idéal pour une architecture distribuée.

📌 Points Clés à Retenir

	•	La stratégie jwt convient aux applications modernes nécessitant des sessions légères et scalables.
	•	Une attention particulière est nécessaire pour gérer la sécurité des tokens et leur expiration.
	•	Pour des besoins complexes de révocation ou de gestion de session, envisagez strategy: "database".

Enregistrez ce contenu dans un fichier nommé `README.md`. Cela expliquera clairement le rôle de la stratégie `jwt` et comment elle est mise en œuvre dans votre projet.


```
