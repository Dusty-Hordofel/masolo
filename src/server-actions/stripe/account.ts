"use server";

import { prisma } from "@/lib/prisma";

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

// export async function createAccountLink() {
//   try {
//     if (await hasConnectedStripeAccount()) {
//       throw new Error("Stripe account already exists");
//     }
//   } catch (error) {
//     console.log("🚀 ~ createAccountLink ~ error:", error);
//   }
// }
