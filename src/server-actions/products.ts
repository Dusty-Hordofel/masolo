"use server";

import prismadb from "@/lib/prismadb";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/products/product.schema";

export async function createProduct(productValues: ProductFormData) {
  try {
    const validatedProduct = ProductSchema.parse(productValues);

    const createdProduct = await prismadb.product.create({
      data: validatedProduct,
    });
    console.log("🚀 ~ createProduct ~ createdProduct:", createdProduct);

    return {
      success: true,
      title: "Product created",
      description: "Success, your new product has been created",
      productId: null,
    };
  } catch (error) {
    console.log("🚀 ~ createProduct ~ error:", error);

    return {
      success: false,
      title: "Sorry, an error occured creating your product.",
      description: "Please try again.",
      productId: null,
    };
  }
}
