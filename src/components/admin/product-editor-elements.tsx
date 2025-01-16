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
import { createProduct } from "@/server-actions/products";

const ProductEditorElements = ({
  displayType,
  productStatus,
  initialValues,
}: ProductEditorSharedProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: ProductFormData = {
    name: "",
    price: 0,
    description: "",
    inventory: 0,
    images: [], // Tableau vide par défaut
    storeId: undefined, // Undefined si aucune boutique n'est sélectionnée
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const handleProductSubmit = async (data: ProductFormData) => {
    const result = await createProduct(data);
    console.log("🚀 ~ handleProductSubmit ~ result:", result);
    // console.log("🚀 ~ handleProductSubmit ~ values:", data);
    // const response = await fetch("/api/V1/product", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    // });
    // const result = await response.json();
    // console.log("🚀 ~ result ~ result:", result);
    // // {
    // create new product
    // as unknown as {
    //   error: boolean;
    //   message: string;
    //   action: string;
    //   productId?: string;
    // };
    // console.log(data);
    // if (data.productId) {
    //   router.push(
    //     `${secondLevelNestedRoutes.product.base}/${data.productId}`
    //   );
    // }
    // setFormValues(defaultValues);
    // }
    // try {
    //   const result = await createProduct(data); // Appel à la Server Action
    //   console.log("Produit créé :", result); // Log pour confirmation
    // } catch (e: any) {
    //   console.error("Erreur :", e.message || "Une erreur est survenue");
    //   // setError(e.message || "Une erreur est survenue");
    // }
    // finally {
    //   // setIsSubmitting(false);
    // }
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
            {/* {!!isLoading && <Loader2 size={18} className="animate-spin" />} */}
            Create
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductEditorElements;
