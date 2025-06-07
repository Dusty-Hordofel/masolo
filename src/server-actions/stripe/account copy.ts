"use server";

import { singleLevelNestedRoutes } from "@/app/data/routes";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// import { getUserId } from "@/lib/auth"; // Fonction pour récupérer l'utilisateur connecté
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function hasConnectedStripeAccount(
  providedStoreId?: string,
  useProvidedStoreId?: boolean
) {
  if (useProvidedStoreId && !providedStoreId) return;

  console.log("🚀 ~ providedStoreId:", providedStoreId);

  const hasStripeAccount = await prisma.payment.findFirst({
    where: {
      storeId: providedStoreId,
      stripeAccountId: {
        not: null,
      },
    },
    select: {
      stripeAccountId: true,
    },
  });
  console.log("🚀 ~ hasStripeAccount:", hasStripeAccount);

  const isConnected = Boolean(hasStripeAccount);

  return isConnected;
}

export async function createAccountLink(storeId?: string) {
  try {
    // 1️⃣ Vérifier si l'utilisateur est connecté
    // const userId = await getUserId();
    const user = await currentUser();
    console.log("🚀 ~ SellerLayout ~ user:MA", user);

    if (!user /*|| user.role !== "USER"*/) return redirect("/auth/login");

    // if (!userId) throw new Error("Unauthorized: User must be logged in.");

    // 2️⃣ Récupérer le `storeId` si non fourni
    if (!storeId) {
      const store = await prisma.store.findFirst({
        where: { ownerId: user.id },
        select: { id: true },
      });
      if (!store) throw new Error("No store found for the user.");
      storeId = store.id;
    }

    // 3️⃣ Vérifier si un compte Stripe est déjà associé
    const paymentRecord = await prisma.payment.findFirst({
      where: { storeId },
      select: { stripeAccountId: true },
    });

    let stripeAccountId = paymentRecord?.stripeAccountId;

    // 4️⃣ Si aucun compte Stripe, en créer un
    if (!stripeAccountId) {
      const { id: newStripeAccountId } = await stripe.accounts.create({
        type: "standard",
      });

      if (!newStripeAccountId)
        throw new Error("Failed to create Stripe account.");

      // Mettre à jour ou créer l'entrée en base
      if (paymentRecord) {
        await prisma.payment.updateMany({
          where: { storeId },
          data: { stripeAccountId: newStripeAccountId },
        });
      } else {
        await prisma.payment.create({
          data: { storeId, stripeAccountId: newStripeAccountId },
        });
      }

      stripeAccountId = newStripeAccountId;
    }

    // 5️⃣ Générer le lien de connexion Stripe
    // const accountLink = await stripe.accountLinks.create({
    //   account: stripeAccountId,
    //   refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/payments`,
    //   return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/payments`,
    //   type: "account_onboarding",
    // });

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url:
        process.env.NEXT_PUBLIC_APP_URL +
        singleLevelNestedRoutes.account.payments,
      return_url:
        process.env.NEXT_PUBLIC_APP_URL +
        singleLevelNestedRoutes.account.payments,
      type: "account_onboarding",
    });

    return accountLink.url;
  } catch (err) {
    console.error("Error creating Stripe account link:", err);
    throw new Error("Failed to create Stripe account link.");
  }
}

export async function getStripeAccountDetails(storeId: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { storeId },
      select: { stripeAccountId: true },
    });
    console.log("🚀 ~ getStripeAccountDetails ~ payment:", payment);

    // await prisma.payment.findUnique({
    //     where: { storeId },
    //     select: { stripeAccountId: true },
    //   });

    if (!payment || !payment.stripeAccountId) {
      throw new Error("Stripe account not found");
    }

    const account = await stripe.accounts.retrieve(payment.stripeAccountId);
    return account as Stripe.Account;
  } catch (err) {
    console.error("Error fetching Stripe account details:", err);
    throw err;
  }
}

export async function updateStripeAccountStatus(storeId: string) {
  try {
    const account = await getStripeAccountDetails(storeId);

    // Vérifie si le compte Stripe a été créé avec succès et met à jour la base de données
    if (account?.details_submitted) {
      await prisma.payment.updateMany({
        where: { storeId },
        data: {
          detailsSubmitted: account.details_submitted,
          stripeAccountCreatedAt: account.created,
        },
      });
    }

    return account?.details_submitted ?? false;
  } catch (err) {
    console.error("Error updating Stripe account status:", err);
    return false;
  }
}
