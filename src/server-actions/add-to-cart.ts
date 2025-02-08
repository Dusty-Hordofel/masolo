"use server";

import { prisma } from "@/lib/prisma";
import { CartItem } from "@prisma/client";
// import { CartItem } from "@/types/cart.types";

import { cookies } from "next/headers";
// import { getCart, getCartItem, createCartItem, updateCartItemQuantity, createCart } from "@/services/cart.repository";
// import { CartItem } from "@/types/cart.types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProductWithImages } from "@/@types/admin/admin.products.interface";

export async function addToCart(newCartItem: CartItem) {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore.get("cartId")?.value;

    // 🔍 Vérifier si un panier existe déjà
    if (cartId) {
      const cart = cartId
        ? await prisma.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
          })
        : null;

      if (cart && !cart.isClosed) {
        return await updateCart(cartId, newCartItem);
      }
    }

    // 🛍️ Sinon, créer un nouveau panier
    const newCart = await createCart(newCartItem);
    cookieStore.set("cartId", newCart.id, { maxAge: 7 * 24 * 60 * 60 });

    revalidatePath("/");
    return { success: true, message: "Cart created and item added." };
  } catch (error) {
    console.error("Error in addToCart:", error);
    return {
      success: false,
      message: "An error occurred while adding to the cart.",
    };
  }
}

export async function updateCart(cartId: string, newCartItem: CartItem) {
  try {
    const existingItem = await getCartItem(cartId, newCartItem.id);

    if (existingItem) {
      await updateCartItemQuantity(
        existingItem.id,
        existingItem.qty + newCartItem.qty
      );
    } else {
      await createCartItem(cartId, newCartItem);
    }

    revalidatePath("/");
    return { success: true, message: "Cart updated successfully." };
  } catch (error) {
    console.error("Error updating cart:", error);
    return {
      success: false,
      message: "An error occurred while updating the cart.",
    };
  }
}

// 🛒 Récupère un panier existant avec ses articles
// export async function getCart(cartId: string) {
//   return prisma.cart.findUnique({
//     where: { id: cartId },
//     include: { cartItems: true },
//   });
// }

const CartIdSchema = z.string();

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
      select: { cartItems: true },
    });

    if (!dbCart) {
      return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };
    }

    // 🎯 Extraction des articles du panier
    // const cartItems: CartItem[] = dbCart.items
    //   ? JSON.parse(dbCart.items as string)
    //   : [];

    // const cartItems: CartItem[] = dbCart.items || [];
    // const cartItems: CartItem[] = Array.isArray(dbCart.items)
    //   ? (dbCart.items as CartItem[])
    //   : [];
    // const cartItems: CartItem[] = dbCart.items || [];
    const cartItems: CartItem[] = Array.isArray(dbCart.cartItems)
      ? (dbCart.cartItems as CartItem[])
      : [];

    console.log("🚀 ~ getCart ~ cartItems:", cartItems);
    const cartItemDetails =
      cartItems.length > 0 ? await getCartItemDetails(cartItems) : [];

    // console.log("🚀 ~ getCartTest ~ cartItemDetails:CACA", cartItemDetails);

    const uniqueStoreIds = [
      ...new Set(cartItemDetails.map((item) => item.storeId)),
    ];
    // console.log("🚀 ~ getCartTest ~ uniqueStoreIds:", uniqueStoreIds);

    // return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };

    return { cartItems, uniqueStoreIds, cartItemDetails };
  } catch (error) {
    console.error("❌ Erreur dans getCart:", error);
    throw new Error("Impossible de récupérer le panier.");
  }
}

export type getCartTest = Omit<
  ProductWithImages,
  "description" | "createdAt" | "updatedAt"
>;

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

// 📌 Vérifie si un produit est déjà dans le panier
export async function getCartItem(cartId: string, productId: string) {
  return prisma.cartItem.findFirst({
    where: { cartId, id: productId },
  });
}

// ➕ Ajoute un nouvel article dans le panier
export async function createCartItem(cartId: string, newCartItem: CartItem) {
  return prisma.cartItem.create({
    data: {
      id: newCartItem.id, // On prend l'ID du produit
      qty: newCartItem.qty,
      cart: { connect: { id: cartId } }, // Lien avec le panier
    },
  });
}

// 🔄 Met à jour la quantité d'un article existant
export async function updateCartItemQuantity(
  productId: string,
  newQty: number
) {
  return prisma.cartItem.update({
    where: { id: productId },
    data: { qty: newQty },
  });
}

// 🛍️ Crée un panier avec un premier article
export async function createCart(newCartItem: CartItem) {
  const newCart = await prisma.cart.create({
    data: {
      cartItems: {
        create: {
          id: newCartItem.id,
          qty: newCartItem.qty,
        },
      },
    },
    include: { cartItems: true },
  });

  return newCart;
}
