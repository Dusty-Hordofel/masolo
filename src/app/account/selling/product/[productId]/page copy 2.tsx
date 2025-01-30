"use client";
import { ProductEditor } from "@/components/admin/product-editor";
import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getProductDetails } from "@/server-actions/products";
// import { Product } from "@prisma/client";
import React, { cache, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFileUploadToCloudinary } from "@/components/admin/use-file-upload";
// import { Product } from "@prisma/client";
type Props = {};

interface ProductPageParams {
  productId: string;
}

type Product =
  | {
      name: string;
      id: string;
      price: number;
      description: string | null;
      inventory: number;
      storeId: string | null;
      createdAt: Date;
      updatedAt: Date;
      images: {
        publicId: string;
        secureUrl: string;
        alt: string;
      }[];
    }
  | undefined;

const ProductPage = () => {
  const params = useParams();

  if (!params.productId)
    throw new Error("Product not found or user not authorised");

  const [product, setProduct] = useState<Product>(undefined);
  console.log("🚀 ~ ProductPage ~ product:TOTO", product);

  const { isUploading, uploadedFiles, uploadFiles, setUploadedFiles } =
    useFileUploadToCloudinary(product?.id as string);

  console.log("🚀 ~ ProductPage ~ uploadedFiles:44", uploadedFiles);
  // useEffect(() => {
  //   async function getProduct() {
  //     if (params.productId) {
  //       const productDetails = await getProductDetails(
  //         params.productId as string
  //       );
  //       setProduct(productDetails as Product);
  //     }
  //   }
  //   getProduct();
  // }, [uploadedFiles]);

  // Récupération du produit lors du montage ou du changement de `params.productId`
  useEffect(() => {
    async function fetchProduct() {
      if (params.productId) {
        const productDetails = await getProductDetails(
          params.productId as string
        );
        setProduct(productDetails as Product);
      }
    }
    fetchProduct();
  }, [params.productId]);

  // // Mise à jour des produits lorsque des fichiers sont téléversés
  // useEffect(() => {
  //   if (uploadedFiles.length > 0) {
  //     setProduct(
  //       (prev) =>
  //         ({
  //           ...prev,
  //           images: [...(prev?.images || []), ...uploadedFiles],
  //         } as Product)
  //     );
  //   }
  // }, [uploadedFiles]);

  if (!product) {
    // Afficher un loader pendant le chargement des données
    return <div>Loading...</div>;
  }

  return (
    <ProductEditor productStatus="existing-product" initialValues={product} />
  );
};

export default ProductPage;
