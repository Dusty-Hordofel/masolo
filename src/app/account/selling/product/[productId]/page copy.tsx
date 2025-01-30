"use client";
import { ProductEditor } from "@/components/admin/product-editor";
import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getProductDetails } from "@/server-actions/products";
import { Product } from "@prisma/client";
import React, { cache, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFileUploadToCloudinary } from "@/components/admin/use-file-upload";
type Props = {};

interface ProductPageParams {
  productId: string;
}

const updatedImages = [
  {
    publicId: "example_public_id1",
    secureUrl: "https://example.com/image1.jpg",
    alt: "Example Image 1",
  },
  {
    publicId: "example_public_id2",
    secureUrl: "https://example.com/image2.jpg",
    alt: "Example Image 2",
  },
];
// { params }: { params: ProductPageParams }
const ProductPage = () => {
  // console.log("🚀 ~ ProductPage ~ params:", params.productId);

  // const user = currentUser();
  const params = useParams();

  // const productDetails = await getProductDetails(params.productId);
  // const test = await updatedProduct("679627dbc626e03ab7122172", updatedImages);
  // console.log("🚀 ~ ProductPage ~ test:", test);

  // console.log("🚀 ~ ProductPage ~ productDetails:", productDetails);
  // || !user
  if (!params.productId)
    throw new Error("Product not found or user not authorised");

  const [product, setProduct] = useState<Product | undefined>(undefined);
  console.log("🚀 ~ ProductPage ~ product:TOTO", product);

  const { isUploading, uploadedFiles, uploadFiles, setUploadedFiles } =
    useFileUploadToCloudinary(product?.id as string);

  useEffect(() => {
    async function getProduct() {
      if (params.productId) {
        const productDetails = await getProductDetails(
          params.productId as string
        );
        setProduct(productDetails);
        // console.log("��� ~ ProductEditorElements ~ productDetails:", productDetails);
      }
    }
    getProduct();
  }, [uploadedFiles]);
  // product, uploadedFiles
  // product

  // const newProd = await prismadb.product.update({
  //   where: { id: "679627dbc626e03ab7122172" },
  //   data: {
  //     name: "Momo la routine", // Tableau d'objets
  //   },
  // });

  // console.log("🚀 ~ newProd ~ newProd:", newProd);

  // const newProds = await prismadb.product.update({
  //   where: { id: "6795a1cfc626e03ab7122171" },
  //   data: {
  //     images: updatedImages, // Typé explicitement comme JsonValue[]
  //   },
  // });

  // const updatedProduct = await prismadb.product.update({
  //   where: { id: "6795a1cfc626e03ab7122171" },
  //   data: {
  //     images: {
  //       push: updatedImages, // Utiliser `push` pour ajouter des éléments au tableau existant
  //     },
  //   },
  // });
  // console.log("🚀 ~ ProductPage ~ updatedProduct:UPD", updatedProduct);

  // console.log("🚀 ~ uploadFiles ~ newProd:MAMA", newProds);

  return (
    <ProductEditor productStatus="existing-product" initialValues={product} />
  );
};

export default ProductPage;
