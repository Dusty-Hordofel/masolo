"use client";

import React, { useCallback, useEffect, useState } from "react";
import { HeadingAndSubheading } from "./heading-and-subheading";
import { ProductEditorSharedProps } from "@/@types/admin/admin.products.interface";
import DynamicFormField from "../forms/dynamic-form-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/products/product.schema";
import { Button } from "../ui/button";
import { Loader2, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createNewProduct,
  deleteProduct,
  updateProduct,
} from "@/server-actions/products";
import { toast } from "@/hooks/use-toast.hook";
import {
  secondLevelNestedRoutes,
  singleLevelNestedRoutes,
} from "@/app/data/routes";
import { Image, Product } from "@prisma/client";
import ImageUploader3 from "./image-uploader-3";

export type ProductImage = {
  publicId: string;
  secureUrl: string;
  alt: string;
};

const ProductEditorElements = ({
  displayType,
  productStatus,
  initialValues,
}: ProductEditorSharedProps) => {
  const router = useRouter();

  const defaultValues: ProductFormData = {
    name: initialValues?.name || "",
    price: initialValues?.price || 0,
    description: initialValues?.description || "",
    inventory: initialValues?.inventory || 0,
    // images: (initialValues?.images as [] as ProductImage[]) || [],
    storeId: (initialValues?.storeId as string) || undefined,
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [initialProductImages, setInitialProductImages] = useState<Image[]>(
    initialValues?.images || []
  );

  const [currentProductImages, setCurrentProductImages] = useState<Image[]>([
    ...initialProductImages,
    ...uploadedImages,
  ]);

  useEffect(() => {
    setCurrentProductImages([...initialProductImages, ...uploadedImages]);
  }, [initialProductImages, uploadedImages]); // Dépendances cruciales

  useEffect(() => {
    if (initialValues) {
      reset(defaultValues);
    }
  }, [initialValues, reset]);

  const handleProductSubmit = async (formValues: ProductFormData) => {
    let data;
    if (initialValues && initialValues.id) {
      data = await updateProduct({
        id: initialValues.id,
        ...formValues,
      });

      if (data.success) {
        router.refresh();
        router.push(singleLevelNestedRoutes.account.products);
      }
    } else {
      data = await createNewProduct(formValues);
      if (data.productId) {
        router.push(
          `${secondLevelNestedRoutes.product.base}/${data.productId}`
        );
      }
    }
    toast({
      title: data?.title,
      description: data?.description,
    });
  };

  // const navigateOnCloseModal = useCallback(() => {
  //   if (displayType === "modal") {
  //     router.back();
  //   } else {
  //     router.push("/account/selling/products");
  //   }
  // }, [router, displayType]); // Mo nommage

  const dismissModal = useCallback(() => {
    if (displayType === "modal") {
      router.back();
    } else {
      router.push(singleLevelNestedRoutes.account.products);
    }
  }, [router, displayType]);

  return (
    <>
      <HeadingAndSubheading
        heading={
          productStatus === "new-product"
            ? "Create a new product"
            : "Edit product"
        }
        subheading={
          productStatus === "new-product"
            ? "Enter the details of your new product below and click save."
            : "Edit the details of your product below and click save."
        }
      />
      <form onSubmit={handleSubmit(handleProductSubmit)}>
        <div className="flex flex-col gap-6 mt-2 mb-6">
          <DynamicFormField
            showLabel
            inputType="input"
            label="Product Name"
            name="name"
            register={register}
            errors={errors}
            type="text"
            fieldProps={{
              placeholder: "Enter a product name*",
              disabled: false,
            }}
          />
          <DynamicFormField
            showLabel
            inputType="textarea"
            label="Description"
            name="description"
            register={register}
            errors={errors}
            lines={8}
            fieldProps={{
              placeholder: "Enter a product description*",
            }}
          />

          <div className="flex flex-wrap">
            {productStatus === "existing-product" &&
              initialValues &&
              initialValues.images && (
                <ImageUploader3
                  productId={initialValues?.id as string}
                  setUploadedImages={setUploadedImages}
                  currentProductImages={currentProductImages}
                  setCurrentProductImages={setCurrentProductImages}
                />
              )}
          </div>

          <div className="flex  gap-x-4">
            <DynamicFormField
              showLabel
              inputType="input"
              label="Price"
              name="price"
              register={register}
              errors={errors}
              type="number"
              fieldProps={{
                placeholder: "Enter a product price*",
                disabled: false,
              }}
            />
            <DynamicFormField
              showLabel
              inputType="input"
              label="Quantity In Stock"
              name="inventory"
              register={register}
              errors={errors}
              type="number"
              fieldProps={{
                placeholder: "Enter a product quantity*",
                disabled: false,
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          {!!initialValues && (
            <Button
              type="button"
              variant="destructiveOutline"
              onClick={async () => {
                if (initialValues && initialValues.id) {
                  const deletedProduct = await deleteProduct(initialValues.id);
                  if (deletedProduct.success) {
                    router.refresh();
                    router.push(singleLevelNestedRoutes.account.products);
                  }
                  toast({
                    title: deletedProduct.title,
                    description: deletedProduct.description,
                  });
                }
              }}
            >
              Delete
            </Button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={dismissModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex gap-2 items-center justify-center"
            >
              {!!isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {initialValues ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProductEditorElements;
