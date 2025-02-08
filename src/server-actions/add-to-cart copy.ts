"use server";

import { ProductWithImages } from "@/@types/admin/admin.products.interface";
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
  const cookieStore = cookies();
  const cartId = cookieStore.get("cartId")?.value;

  const cart = cartId
    ? await prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: true },
      })
    : null;

  if (cart && !cart.isClosed) {
    const existingItem = cart.cartItems.find(
      (item) => item.id === newCartItem.id // L'ID du produit sert d'ID pour CartItem
    );

    if (existingItem) {
      // Mise à jour de la quantité de l'item existant
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + newCartItem.qty },
      });
    } else {
      // Création d'un nouvel item avec l'ID du produit
      await prisma.cartItem.create({
        data: {
          id: newCartItem.id, // Utilisation de l'ID du produit
          qty: newCartItem.qty,
          cart: { connect: { id: cart.id } },
        },
      });
    }
  } else {
    await createCart(newCartItem);
    // Création d'un nouveau panier avec le premier item
    // const newCart = await prisma.cart.create({
    //   data: {
    //     cartItems: {
    //       create: {
    //         id: newCartItem.id, // Utilisation de l'ID du produit
    //         qty: newCartItem.qty,
    //       },
    //     },
    //   },
    // });

    // // Stockage du nouvel ID de panier dans les cookies
    // cookieStore.set("cartId", newCart.id, { maxAge: 7 * 24 * 60 * 60 });
  }

  revalidatePath("/");
}

// export async function addToCart(newCartItem: CartItem) {
//   try {
//     const cookieStore = cookies();
//     const cartId = cookieStore.get("cartId")?.value;
//     // const cart = await getCart(cartId);
//     if (!cartId) return null;

//     const cart = await prisma.cart.findUnique({
//       where: { id: String(cartId) },
//       include: { cartItems: true },
//     });

//     if (cart && !cart.isClosed) {
//       // const currentItems = JSON.parse(cart.cartItems as string) as CartItem[];
//       await updateCart(cart.id, newCartItem);
//       // await updateCart(cart.id, newCartItem, cart.cartItems);
//     } else {
//       await createCart(newCartItem);
//     }

//     revalidatePath("/");
//   } catch (error) {
//     console.error("Error in addToCart:", error);
//     throw new Error("An error occurred while adding to the cart.");
//   }
// }

// export async function getCart(cartId: string | undefined) {
//   if (!cartId) return null;

//   return await prisma.cart.findUnique({
//     where: { id: String(cartId) },
//   });
// }

// export async function updateCart(
//   cartId: string,
//   newCartItem: CartItem,
//   currentItems: CartItem[]
// ) {
//   const existingItem = currentItems.find((item) => item.id === newCartItem.id);

//   const updatedItems = existingItem
//     ? currentItems.map((item) =>
//         item.id === newCartItem.id
//           ? { ...item, qty: item.qty + newCartItem.qty }
//           : item
//       )
//     : [...currentItems, newCartItem];

//   await prisma.cart.update({
//     where: { id: cartId },
//     data: { items: JSON.stringify(updatedItems) },
//   });
// }

export async function updateCart(cartId: string, newCartItem: CartItem) {
  try {
  } catch (error) {
    console.error("Error updating cart:", error);
    return {
      success: false,
      title: "Update Failed",
      description: "An unexpected error occurred. Please try again later.",
    };
  }
}

// export async function updateCart(cartId: string, newCartItem: CartItem) {
//   try {
//     // Vérifier si le panier existe avec ses items
//     const existingCart = await prisma.cart.findUnique({
//       where: { id: cartId },
//       include: { cartItems: true }, // Récupérer les items liés au panier
//     });

//     if (!existingCart) {
//       return {
//         success: false,
//         title: "Cart Not Found",
//         description: "The cart does not exist. Please refresh the page.",
//       };
//     }

//     // Vérifier si l'item existe déjà dans le panier
//     const existingItem = existingCart.cartItems.find(
//       (item) => item.id === newCartItem.id
//     );

//     if (existingItem) {
//       // Si l'item existe, mettre à jour la quantité
//       await prisma.cartItem.update({
//         where: { id: existingItem.id },
//         data: { qty: existingItem.qty + newCartItem.qty },
//       });
//     } else {
//       // Sinon, ajouter un nouvel item au panier
//       await prisma.cartItem.create({
//         data: {
//           qty: newCartItem.qty,
//           cart: { connect: { id: cartId } }, // Lier au panier existant
//         },
//       });
//     }

//     return {
//       success: true,
//       title: "Cart Updated",
//       description: "The cart has been successfully updated.",
//     };
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     return {
//       success: false,
//       title: "Update Failed",
//       description: "An unexpected error occurred. Please try again later.",
//     };
//   }
// }

const CartItemSchema = z.object({
  id: z.string().uuid(),
  qty: z.number().int().min(0),
});

// export async function updateCartItemQuantity(updateCartItem: CartItem) {
//   try {
//     const validatedItem = CartItemSchema.safeParse(updateCartItem);
//     console.log("🚀 ~ updateCartItemQuantity ~ validatedItem:", validatedItem);

//     if (!validatedItem.success) {
//       return {
//         success: false,
//         // error: "INVALID_ITEM_DATA",
//         title: "Invalid Data",
//         description:
//           "The provided cart item data is invalid. Please check your input and try again.",
//       };
//     }
//     // if (!validatedItem.success) {
//     //   throw new Error("Invalid updateCartItem data");
//     // }

//     const cartId = cookies().get("cartId")?.value;

//     if (!cartId) {
//       return {
//         success: false,
//         title: "Cart Not Found",
//         description: "Your cart ID is missing. Please try again.",
//       };
//     }
//     // if (!cartId) {
//     //   throw new Error("Cart ID is missing");
//     // }

//     const dbCart = await prisma.cart.findUnique({
//       where: { id: cartId },
//       select: { items: true },
//     });

//     if (!dbCart) {
//       return {
//         success: false,
//         title: "Cart Not Found",
//         description: "The cart does not exist. Please refresh the page.",
//       };
//     }

//     // if (!dbCart) {
//     //   throw new Error("Cart not found");
//     // }

//     const parsedCartItems = dbCart
//       ? (JSON.parse(dbCart.items as string) as CartItem[])
//       : [];

//     const updatedCartItems = parsedCartItems.filter(
//       (item: CartItem) => item.id !== validatedItem.data.id
//     );

//     if (validatedItem.data.qty > 0) {
//       updatedCartItems.push(validatedItem.data);
//     }

//     await prisma.$transaction([
//       prisma.cart.update({
//         where: { id: cartId },
//         data: { items: updatedCartItems },
//       }),
//     ]);

//     revalidatePath("/");

//     return {
//       success: true,
//       title: "Cart Updated",
//       description: "Your cart has been successfully updated.",
//     };
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     return {
//       success: false,
//       title: "Update Failed",
//       description: "An unexpected error occurred. Please try again later.",
//     };
//     // throw new Error("Failed to update cart");
//   }
// }

export async function createCart(newCartItem: CartItem) {
  // Création du panier avec l'item associé
  // const newCart = await prisma.cart.create({
  //   data: {
  //     cartItems: {
  //       create: {
  //         id: newCartItem.id,
  //         qty: newCartItem.qty,
  //       },
  //     },
  //   },
  //   include: { cartItems: true }, // Inclure les items pour vérification
  // });

  const newCart = await prisma.cart.create({
    data: {
      cartItems: {
        create: {
          id: newCartItem.id, // Utilisation de l'ID du produit
          qty: newCartItem.qty,
        },
      },
    },
  });

  // Stocker l'ID du panier dans les cookies
  cookies().set("cartId", newCart.id, { maxAge: 7 * 24 * 60 * 60 });

  // return {
  //   success: true,
  //   title: "Cart Created",
  //   description: "A new cart has been successfully created.",
  //   cart: newCart, // Retourner le panier pour vérification
  // };
}

// export async function createCart(newCartItem: CartItem) {
//   const newCart = await prisma.cart.create({
//     data: { items: JSON.stringify([newCartItem]) },
//   });

//   cookies().set("cartId", String(newCart.id), { maxAge: 7 * 24 * 60 * 60 });
// }

const CartIdSchema = z.string();

export type getCartTest = Omit<
  ProductWithImages,
  "description" | "createdAt" | "updatedAt"
>;
// | "images"
// export type getCartTest = Omit<
//   Product,
//   "description" | "images" | "createdAt" | "updatedAt"
// >;

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
    // const cartItemDetails =
    //   cartItems.length > 0 ? await getCartItemDetails(cartItems) : [];

    // console.log("🚀 ~ getCartTest ~ cartItemDetails:CACA", cartItemDetails);

    // const uniqueStoreIds = [
    //   ...new Set(cartItemDetails.map((item) => item.storeId)),
    // ];
    // console.log("🚀 ~ getCartTest ~ uniqueStoreIds:", uniqueStoreIds);

    return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };

    // return { cartItems, uniqueStoreIds, cartItemDetails };
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

// A GERER
// import { cookies } from "next/headers";
// import { z } from "zod";
// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// const CartItemSchema = z.object({
//   id: z.string().uuid(),
//   qty: z.number().int().min(1), // min(1) pour éviter les valeurs négatives ou nulles
// });

// /**
//  * Met à jour ou ajoute un produit dans le panier.
//  * @param newCartItem - L'élément à ajouter ou mettre à jour.
//  * @param replaceQuantity - Si `true`, remplace la quantité. Sinon, ajoute à la quantité existante.
//  */
// export async function updateCartItem(newCartItem: CartItem, replaceQuantity = false) {
//   try {
//     const validatedItem = CartItemSchema.safeParse(newCartItem);
//     if (!validatedItem.success) {
//       return {
//         success: false,
//         title: "Invalid Data",
//         description: "The provided cart item data is invalid. Please try again.",
//       };
//     }

//     const cartId = cookies().get("cartId")?.value;
//     if (!cartId) {
//       return {
//         success: false,
//         title: "Cart Not Found",
//         description: "Your cart ID is missing. Please try again.",
//       };
//     }

//     return await prisma.$transaction(async (tx) => {
//       const dbCart = await tx.cart.findUnique({
//         where: { id: cartId },
//         select: { items: true },
//       });

//       if (!dbCart) {
//         return {
//           success: false,
//           title: "Cart Not Found",
//           description: "The cart does not exist. Please refresh the page.",
//         };
//       }

//       const parsedCartItems: CartItem[] = dbCart.items
//         ? (dbCart.items as unknown as CartItem[])
//         : [];

//       // 🔹 Vérifie si le produit est déjà dans le panier
//       const existingItem = parsedCartItems.find((item) => item.id === validatedItem.data.id);

//       let updatedCartItems;
//       if (existingItem) {
//         existingItem.qty = replaceQuantity
//           ? validatedItem.data.qty // Remplace la quantité existante
//           : existingItem.qty + validatedItem.data.qty; // Ajoute à la quantité existante
//         updatedCartItems = [...parsedCartItems];
//       } else {
//         updatedCartItems = [...parsedCartItems, validatedItem.data];
//       }

//       await tx.cart.update({
//         where: { id: cartId },
//         data: { items: updatedCartItems },
//       });

//       revalidatePath("/");

//       return {
//         success: true,
//         title: "Cart Updated",
//         description: "Your cart has been successfully updated.",
//       };
//     });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     return {
//       success: false,
//       title: "Update Failed",
//       description: "An unexpected error occurred. Please try again later.",
//     };
//   }
// }
