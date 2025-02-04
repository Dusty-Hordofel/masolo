"use server";

import { CartItem } from "@/@types/cart/user.item.interface";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addToCart(newCartItem: CartItem) {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore.get("cartId")?.value;
    const cart = await getCart(cartId);
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

async function getCart(cartId: string | undefined) {
  if (!cartId) return null;

  return await prisma.cart.findUnique({
    where: { id: String(cartId) },
  });
}

async function updateCart(
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

async function createCart(newCartItem: CartItem) {
  const newCart = await prisma.cart.create({
    data: { items: JSON.stringify([newCartItem]) },
  });

  cookies().set("cartId", String(newCart.id), { maxAge: 7 * 24 * 60 * 60 });
}
