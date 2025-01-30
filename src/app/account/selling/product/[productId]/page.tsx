import { ProductWithImages } from "@/@types/admin/admin.products.interface";
import { ProductEditor } from "@/components/admin/product-editor";
import prismadb from "@/lib/prismadb";
import { getNewImages, getProductDetails } from "@/server-actions/products";
import React, { cache, useEffect, useState } from "react";

interface ProductPageParams {
  productId: string;
}

// type Product =
//   | {
//       name: string;
//       id: string;
//       price: number;
//       description: string | null;
//       inventory: number;
//       storeId: string | null;
//       createdAt: Date;
//       updatedAt: Date;
//       images: {
//         publicId: string;
//         secureUrl: string;
//         alt: string;
//       }[];
//     }
//   | undefined;

const ProductPage = async ({ params }: { params: ProductPageParams }) => {
  const productDetails = (await getProductDetails(
    params.productId
  )) as ProductWithImages;
  console.log("🚀 ~ ProductPage ~ productDetails:", productDetails);

  // const newImages = await getNewImages(params.productId);
  // console.log("🚀 ~ uploadFiles ~ newImages:SIKA", newImages);

  // const images = await prismadb.image.findMany({
  //   where: { productId: params.productId },
  //   select: { id: true, createdAt: true },
  // });
  // console.log("🚀 ~ ProductPage ~ images:", images);

  return (
    <ProductEditor
      productStatus="existing-product"
      initialValues={productDetails}
    />
  );
};

export default ProductPage;
