"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
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
import { createNewProduct, deleteProduct } from "@/server-actions/products";
import { toast } from "@/hooks/use-toast.hook";
import { secondLevelNestedRoutes } from "@/app/data/routes";
import { JsonValue } from "@prisma/client/runtime/library";

const ProductEditorElements = ({
  displayType,
  productStatus,
  initialValues,
}: ProductEditorSharedProps) => {
  console.log("🚀 ~ initialValues:IN", initialValues);
  const router = useRouter();

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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const handleProductSubmit = async (formValues: ProductFormData) => {
    const data = await createNewProduct(formValues);

    if (data.productId) {
      router.push(`${secondLevelNestedRoutes.product.base}/${data.productId}`);
    }

    toast({
      title: data.title,
      description: data.description,
    });

    type ImageType = { url?: string; alt?: string }; // Type attendu par votre formulaire

    const adaptImages = (images: JsonValue | null): ImageType[] => {
      if (Array.isArray(images)) {
        return images
          .filter((image) => typeof image === "object" && image !== null) // Filtre les valeurs non valides
          .map((image) => ({
            url: (image as any).url ?? "",
            alt: (image as any).alt ?? "",
          }));
      }
      return [];
    };

    

    // useEffect(() => {
    //   if (initialValues) {
    //     const transformedValues = {
    //       ...initialValues,
    //       images: [], // Transforme les images
    //       // images: adaptImages(initialValues.images), // Transforme les images
    //       storeId: initialValues.storeId as string,
    //       // storeId: initialValues.storeId as string,
    //     };
    //     reset(transformedValues);
    //   }
    // }, []);

    useEffect(() => {
      if (initialValues) {
        reset({
          name: initialValues.name,
          price: initialValues.price,
          description: initialValues.description,
          inventory: initialValues.inventory,
          images: adaptImages(initialValues.images), // Transforme les images
          // storeId: initialValues.storeId as string, // Récupère l'id de la boutique
        }); // Mettez à jour les valeurs du formulaire avec les détails du produit
      }
    }, []);

    console.log("🚀 ~ handleProductSubmit ~ data:", data);
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


  const handleProductAction = async (
    e:
      | FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    buttonAction?: "delete"
  ) => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      if (buttonAction === "delete" && initialValues?.id) {
        await deleteProduct(initialValues.id);
      }

      // else if (initialValues) {
      //   await handleUpdateProduct();
      // } else {
      //   await handleCreateProduct();
      // }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({ title: "Error", description: "An unexpected error occurred." });
    }

    // finally {
    //   setIsLoading(false);
    // }
  };

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
      <form
        onSubmit={handleSubmit(handleProductAction)}
        // onSubmit={handleSubmit(handleProductSubmit)}
      >
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
            disabled={isSubmitting}
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
