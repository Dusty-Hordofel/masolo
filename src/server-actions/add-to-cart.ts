"use server";

import {
  CartItem,
  CartLineItemDetails,
} from "@/@types/cart/cart.item.interface";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

export async function addToCart(newCartItem: CartItem) {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore.get("cartId")?.value;
    // const cart = await getCart(cartId);
    if (!cartId) return null;

    const cart = await prisma.cart.findUnique({
      where: { id: String(cartId) },
    });

    if (cart && !cart.isClosed) {
      const currentItems = JSON.parse(cart.items as string) as CartItem[];
      await updateCart(cart.id, newCartItem, currentItems);
    } else {
      await createCart(newCartItem);
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw new Error("An error occurred while adding to the cart.");
  }
}

// export async function getCart(cartId: string | undefined) {
//   if (!cartId) return null;

//   return await prisma.cart.findUnique({
//     where: { id: String(cartId) },
//   });
// }

export async function updateCart(
  cartId: string,
  newCartItem: CartItem,
  currentItems: CartItem[]
) {
  const existingItem = currentItems.find((item) => item.id === newCartItem.id);

  const updatedItems = existingItem
    ? currentItems.map((item) =>
        item.id === newCartItem.id
          ? { ...item, qty: item.qty + newCartItem.qty }
          : item
      )
    : [...currentItems, newCartItem];

  await prisma.cart.update({
    where: { id: cartId },
    data: { items: JSON.stringify(updatedItems) },
  });
}

export async function createCart(newCartItem: CartItem) {
  const newCart = await prisma.cart.create({
    data: { items: JSON.stringify([newCartItem]) },
  });

  cookies().set("cartId", String(newCart.id), { maxAge: 7 * 24 * 60 * 60 });
}

const CartIdSchema = z.string();

type getCartTest = Omit<
  Product,
  "description" | "images" | "createdAt" | "updatedAt"
>;

export async function getCart(cartId: string) {
  try {
    // ✅ Validation de l'ID avec Zod
    const parsedCartId = CartIdSchema.safeParse(cartId);

    if (!parsedCartId.success) {
      return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };
    }

    // 🔥 Récupération du panier
    const dbCart = await prisma.cart.findUnique({
      where: { id: parsedCartId.data },
      select: { items: true },
    });

    if (!dbCart) {
      return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };
    }

    // 🎯 Extraction des articles du panier
    const cartItems: CartItem[] = dbCart.items
      ? JSON.parse(dbCart.items as string)
      : [];

    const cartItemDetails =
      cartItems.length > 0 ? await getCartItemDetails(cartItems) : [];

    console.log("🚀 ~ getCartTest ~ cartItemDetails:CACA", cartItemDetails);

    const uniqueStoreIds = [
      ...new Set(cartItemDetails.map((item) => item.storeId)),
    ];
    console.log("🚀 ~ getCartTest ~ uniqueStoreIds:", uniqueStoreIds);

    return { cartItems, uniqueStoreIds, cartItemDetails };
  } catch (error) {
    console.error("❌ Erreur dans getCart:", error);
    throw new Error("Impossible de récupérer le panier.");
  }
}

// CartLineItemDetails
async function getCartItemDetails(
  cartItems: CartItem[]
): Promise<getCartTest[]> {
  try {
    const productIds = cartItems.map((item) => item.id);
    if (productIds.length === 0) return [];

    const productDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        inventory: true,
        storeId: true,
        images: true,
        isPreOrderAvailable: true,
        store: {
          select: { name: true },
        },
      },
    });

    return productDetails.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      inventory: product.inventory,
      storeId: product.storeId,
      images: product.images,
      storeName: product.store.name,
      isPreOrderAvailable: product.isPreOrderAvailable,
    }));
  } catch (error) {
    console.error("❌ Erreur dans getCartItemDetails:", error);
    throw new Error(
      "Impossible de récupérer les détails des articles du panier."
    );
  }
}
