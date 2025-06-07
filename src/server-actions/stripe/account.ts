"use server";

import { singleLevelNestedRoutes } from "@/app/data/routes";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51NZaglAJF88lxObTvUS00OhlIuefFG16bfLlymCGOiEhA9A7kAjp9Z8d18PM1yZtYJUHfsWJn4lL4TsPpqPsO5BS00BE5U4Fy4",
  {
    apiVersion: "2025-05-28.basil",
  }
);
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-04-10",
// });

/**
 * Vérifie si un magasin a un compte Stripe connecté.
 * @param providedStoreId - L'ID du magasin (optionnel si `useProvidedStoreId` est `false`).
 * @param useProvidedStoreId - Indique si `providedStoreId` doit être utilisé.
 * @returns {Promise<boolean>} - `true` si un compte Stripe est connecté, sinon `false`.
 */
export async function hasConnectedStripeAccount(
  providedStoreId?: string,
  useProvidedStoreId = false
): Promise<boolean> {
  try {
    // Vérification immédiate des paramètres
    if (useProvidedStoreId && !providedStoreId) {
      console.warn(
        "⚠️ Aucune storeId fournie alors que useProvidedStoreId est activé."
      );
      return false;
    }

    if (!providedStoreId) {
      console.warn("⚠️ storeId is undefined.");
      return false; // Ou gérer autrement en fonction de votre logique
    }

    // Recherche du compte Stripe lié au storeId
    const paymentRecord = await prisma.payment.findUnique({
      where: { storeId: providedStoreId },
      select: { stripeAccountId: true },
    });

    const isConnected = Boolean(paymentRecord?.stripeAccountId);

    // Logging en développement uniquement
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Vérification du compte Stripe :", {
        providedStoreId,
        useProvidedStoreId,
        stripeAccountId: paymentRecord?.stripeAccountId,
        isConnected,
      });
    }

    return isConnected;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la vérification du compte Stripe :",
      error
    );
    return false;
  }
}

// export async function createAccountLink(storeId?: string) {
//   try {
//     // 1️⃣ Vérifier si l'utilisateur est connecté
//     // const userId = await getUserId();
//     const user = await currentUser();
//     console.log("🚀 ~ SellerLayout ~ user:MA", user);

//     if (!user /*|| user.role !== "USER"*/) return redirect("/auth/login");

//     // if (!userId) throw new Error("Unauthorized: User must be logged in.");

//     // 2️⃣ Récupérer le `storeId` si non fourni
//     if (!storeId) {
//       const store = await prisma.store.findFirst({
//         where: { ownerId: user.id },
//         select: { id: true },
//       });
//       if (!store) throw new Error("No store found for the user.");
//       storeId = store.id;
//     }

//     // 3️⃣ Vérifier si un compte Stripe est déjà associé
//     const paymentRecord = await prisma.payment.findFirst({
//       where: { storeId },
//       select: { stripeAccountId: true },
//     });

//     let stripeAccountId = paymentRecord?.stripeAccountId;

//     // 4️⃣ Si aucun compte Stripe, en créer un
//     if (!stripeAccountId) {
//       const { id: newStripeAccountId } = await stripe.accounts.create({
//         type: "standard",
//       });

//       if (!newStripeAccountId)
//         throw new Error("Failed to create Stripe account.");

//       // Mettre à jour ou créer l'entrée en base
//       if (paymentRecord) {
//         await prisma.payment.updateMany({
//           where: { storeId },
//           data: { stripeAccountId: newStripeAccountId },
//         });
//       } else {
//         await prisma.payment.create({
//           data: { storeId, stripeAccountId: newStripeAccountId },
//         });
//       }

//       stripeAccountId = newStripeAccountId;
//     }

//     // 5️⃣ Générer le lien de connexion Stripe
//     // const accountLink = await stripe.accountLinks.create({
//     //   account: stripeAccountId,
//     //   refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/payments`,
//     //   return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/payments`,
//     //   type: "account_onboarding",
//     // });

//     const accountLink = await stripe.accountLinks.create({
//       account: stripeAccountId,
//       refresh_url:
//         process.env.NEXT_PUBLIC_APP_URL +
//         singleLevelNestedRoutes.account.payments,
//       return_url:
//         process.env.NEXT_PUBLIC_APP_URL +
//         singleLevelNestedRoutes.account.payments,
//       type: "account_onboarding",
//     });

//     return accountLink.url;
//   } catch (err) {
//     console.error("Error creating Stripe account link:", err);
//     throw new Error("Failed to create Stripe account link.");
//   }
// }

export async function createAccountLink(
  storeId: string
): Promise<string | null> {
  console.log("🚀 ~ storeId:SID", storeId);
  try {
    // 1️⃣ Ensure the user is authenticated
    const user = await currentUser();
    if (!user) {
      console.warn("🔴 User is not authenticated. Redirecting to /auth/login.");
      return redirect("/auth/login");
    }

    // 2️⃣ Retrieve `storeId` if not provided
    if (!storeId) {
      const store = await prisma.store.findFirst({
        where: { ownerId: user.id },
        select: { id: true },
      });

      if (!store) {
        console.warn("⚠️ No store found for this user.");
        return null;
      }
      storeId = store.id;
    }

    // 3️⃣ Check if a Stripe account is already linked
    let paymentRecord = await prisma.payment.findFirst({
      where: { storeId },
      select: { stripeAccountId: true },
    });

    let stripeAccountId = paymentRecord?.stripeAccountId;

    // 4️⃣ Create a new Stripe account if none exists
    if (!stripeAccountId) {
      console.log("🚀 Creating a new Stripe account for storeId:", storeId);

      const stripeAccount = await stripe.accounts.create({ type: "standard" });
      stripeAccountId = stripeAccount.id;

      // Store Stripe account in the database
      await prisma.payment.upsert({
        where: { storeId: storeId },
        update: {
          stripeAccountId,
          stripeAccountCreatedAt: stripeAccount.created,
        },
        create: { storeId, stripeAccountId },
      });

      console.log("✅ Stripe account created:", stripeAccountId);
    }

    // 5️⃣ Generate the Stripe onboarding link
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}${singleLevelNestedRoutes.account.payments}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}${singleLevelNestedRoutes.account.payments}`;

    if (!refreshUrl || !returnUrl) {
      console.error("❌ Missing Stripe URLs in environment variables.");
      return null;
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    console.log("🔗 Stripe connection link successfully generated.");
    return accountLink.url;
  } catch (err) {
    console.error("❌ Error while creating Stripe account link:", err);
    return null; // ✅ Prevents the application from crashing
  }
}

// export async function getStripeAccountDetails(storeId: string) {
//   try {
//     const payment = await prisma.payment.findFirst({
//       where: { storeId },
//       select: { stripeAccountId: true },
//     });

//     if (!payment || !payment.stripeAccountId) {
//       throw new Error("Stripe account not found");
//     }

//     const account = await stripe.accounts.retrieve(payment.stripeAccountId);
//     return account as Stripe.Account;
//   } catch (err) {
//     console.error("Error fetching Stripe account details:", err);
//     throw err;
//   }
// }

export async function getStripeAccountDetails(
  storeId: string
): Promise<Stripe.Account | null> {
  try {
    if (!storeId) {
      console.warn("⚠️ storeId is required to fetch Stripe account details.");
      return null;
    }

    // 1️⃣ Retrieve Stripe account ID from the database
    const paymentRecord = await prisma.payment.findFirst({
      where: { storeId },
      select: { stripeAccountId: true },
    });

    if (!paymentRecord?.stripeAccountId) {
      console.warn(`⚠️ No Stripe account found for storeId: ${storeId}`);
      return null;
    }

    // 2️⃣ Fetch account details from Stripe
    const account = await stripe.accounts.retrieve(
      paymentRecord.stripeAccountId
    );

    console.log("✅ Successfully retrieved Stripe account details.");
    return account;
  } catch (err) {
    console.error("❌ Error retrieving Stripe account details:", err);
    return null; // Prevents application crashes
  }
}

// export async function updateStripeAccountStatus(storeId: string) {
//   try {
//     const account = await getStripeAccountDetails(storeId);

//     // Vérifie si le compte Stripe a été créé avec succès et met à jour la base de données
//     if (account?.details_submitted) {
//       await prisma.payment.updateMany({
//         where: { storeId },
//         data: {
//           detailsSubmitted: account.details_submitted,
//           stripeAccountCreatedAt: account.created,
//         },
//       });
//     }

//     return account?.details_submitted ?? false;
//   } catch (err) {
//     console.error("Error updating Stripe account status:", err);
//     return false;
//   }
// }

export async function updateStripeAccountStatus(storeId: string) {
  try {
    // 1️⃣ Vérifier si un compte Stripe est lié au magasin
    const payment = await prisma.payment.findFirst({
      where: { storeId },
      select: { stripeAccountId: true },
    });

    if (!payment || !payment.stripeAccountId) {
      console.warn(`⚠️ No Stripe account found for storeId: ${storeId}`);
      return false; // Pas de compte Stripe associé
    }

    // 2️⃣ Récupérer les détails du compte Stripe
    const account = await stripe.accounts.retrieve(payment.stripeAccountId);

    // 3️⃣ Vérifier si le compte Stripe est correctement configuré
    if (!account.details_submitted) {
      console.warn(
        `⚠️ Stripe account for storeId: ${storeId} is not fully completed.`
      );
      return false; // Le compte Stripe n'est pas totalement configuré
    }

    // 4️⃣ Mettre à jour l'état du compte dans la base de données
    await prisma.payment.updateMany({
      where: { storeId },
      data: {
        detailsSubmitted: account.details_submitted,
        stripeAccountCreatedAt: account.created,
      },
    });

    // 5️⃣ Retourner un résultat de succès
    console.log(`✅ Stripe account details updated for storeId: ${storeId}`);
    return true;
  } catch (err) {
    console.error(
      `❌ Error updating Stripe account status for storeId: ${storeId}`,
      err
    );
    return false; // Retourner false en cas d'erreur
  }
}

// •	false est un indicateur explicite que l’opération a échoué ou que la condition requise n’est pas remplie. C’est une manière claire et prévisible de signaler un échec dans le flux logique, ce qui est souvent attendu dans des fonctions qui retournent un résultat booléen.
// •	null, en revanche, peut être interprété de plusieurs manières. Par exemple, il pourrait signifier qu’il n’y a pas de valeur disponible, que l’opération n’a pas encore été exécutée ou que quelque chose est indéfini. Ce n’est pas aussi explicite qu’un false pour indiquer un échec direct
