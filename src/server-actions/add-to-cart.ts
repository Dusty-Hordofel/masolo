"use server";

import { prisma } from "@/lib/prisma";
import { CartItem } from "@prisma/client";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProductWithImages } from "@/@types/admin/admin.products.interface";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function addToCart(newCartItem: Omit<CartItem, "cartId">) {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore.get("cartId")?.value;
    console.log("🚀 ~ addToCart ~ cartId:CART-VOIR", cartId);

    if (cartId) {
      const cart = cartId
        ? await prisma.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
          })
        : null;

      console.log("🚀 ~ addToCart ~ cart:EXISTCART", cart);

      if (cart && !cart.isClosed) {
        return await updateCart(cartId, newCartItem);
      }
    }

    // const newCart =
    await createCart(newCartItem, cookieStore);

    return {
      success: true,
      title: "Cart Created",
      description:
        "The cart has been successfully created and the item has been added to your cart.",
    };
  } catch (error) {
    console.error("Error in addToCart:", error);
    return {
      success: false,
      title: "Error occurred",
      description:
        "An unexpected error occurred while processing your request. Please try again later.",
    };
  }
}

export async function updateCart(
  cartId: string,
  newCartItem: Omit<CartItem, "cartId">
) {
  try {
    const existingItem = await getCartItem(cartId, newCartItem.productId);

    if (existingItem) {
      await updateCartItemQuantity(
        existingItem.productId,
        existingItem.cartId,
        existingItem.qty + newCartItem.qty
      );
    } else {
      await createCartItem(cartId, newCartItem);
    }

    revalidatePath("/");

    return;
    // {
    //   success: true,
    //   title: "Cart updated",
    //   description:
    //     "Your cart has been successfully updated with the selected item(s).",
    // };
  } catch (error) {
    console.error("Error updating cart:", error);
    return {
      success: false,
      title: "Error occurred",
      description:
        "An unexpected error occurred while processing your request. Please try again later.",
    };
  }
}

const CartIdSchema = z.string();

export async function getCart(cartId: string) {
  try {
    const parsedCartId = CartIdSchema.safeParse(cartId);

    if (!parsedCartId.success) {
      return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };
    }

    const dbCart = await prisma.cart.findUnique({
      where: { id: parsedCartId.data },
      select: { cartItems: true },
    });

    if (!dbCart) {
      return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };
    }

    const cartItems: CartItem[] = Array.isArray(dbCart.cartItems)
      ? (dbCart.cartItems as CartItem[])
      : [];

    const cartItemDetails =
      cartItems.length > 0 ? await getCartItemDetails(cartItems) : [];

    const uniqueStoreIds = [
      ...new Set(cartItemDetails.map((item) => item.storeId)),
    ];

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
    const productIds = cartItems.map((item) => item.productId);

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

export async function getCartItem(cartId: string, productId: string) {
  return await prisma.cartItem.findFirst({
    where: { cartId, productId },
  });
}

export async function createCartItem(
  cartId: string,
  newCartItem: Omit<CartItem, "cartId">
) {
  await prisma.cartItem.create({
    data: {
      productId: newCartItem.productId,
      qty: newCartItem.qty,
      cart: { connect: { id: cartId } },
    },
  });
}

export async function updateCartItemQuantity(
  productId: string,
  cartId: string,
  newQty: number
) {
  await prisma.cartItem.updateMany({
    where: { productId, cartId },
    data: { qty: newQty },
  });
}

export async function createCart(
  newCartItem: Omit<CartItem, "cartId">,
  cookieStore: ReadonlyRequestCookies
) {
  console.log("🚀 ~ newCartItem:TALA", newCartItem);
  await prisma.cart.deleteMany({
    where: { isClosed: false },
  });

  const newCart = await prisma.cart.create({
    data: {
      cartItems: {
        create: {
          productId: newCartItem.productId,
          qty: newCartItem.qty,
        },
      },
    },
    include: { cartItems: true },
  });

  cookieStore.set("cartId", newCart.id, {
    maxAge: 7 * 24 * 60 * 60,
  });

  revalidatePath("/");
  return;
}
