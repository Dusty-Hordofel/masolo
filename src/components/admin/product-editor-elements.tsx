"use client";

import React, { useCallback, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductEditorElements = ({
  displayType,
  productStatus,
  initialValues,
}: ProductEditorSharedProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(ProductSchema) });

  const handleProductSubmit = (values: ProductFormData) => {
    console.log("🚀 ~ handleProductSubmit ~ values:", values);
  };

  const navigateOnCloseModal = useCallback(() => {
    if (displayType === "modal") {
      router.back();
    } else {
      router.push("/account/selling/products");
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
        <DynamicFormField
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
        <div className="flex  gap-x-4">
          <DynamicFormField
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
        <div className=" flex justify-end items-center gap-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={navigateOnCloseModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex gap-2 items-center justify-center"
          >
            {!!isLoading && <Loader2 size={18} className="animate-spin" />}
            Create
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductEditorElements;
