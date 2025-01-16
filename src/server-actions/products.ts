"use server";

import { ErrorCode } from "@/constants/error-codes";
import prismadb from "@/lib/prismadb";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/products/product.schema";

export async function createProduct(productData: ProductFormData) {
  try {
    const validatedProduct = ProductSchema.safeParse(productData);

    if (validatedProduct.error) {
      return {
        success: false,
        heading: "Validation Error",
        description: "Invalid fields!",
        type: "error",
        code: ErrorCode.INVALID_FIELDS,
        productId: null,
      };
    }

    await prismadb.product.create({
      data: validatedProduct.data,
    });

    return {
      success: true,
      heading: "Product created",
      description: "Success, your new product has been created",
      type: "success",
      productId: null,
    };
  } catch (error) {
    console.log("🚀 ~ createProduct ~ error:", error);

    return {
      error: true,
      heading: "Please try again.",
      description: "Sorry, an error occured creating your product.",
      type: "error",
      code: ErrorCode.SERVER_ERROR,
      productId: null,
    };
  }
}
