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
import {
  createNewProduct,
  deleteProduct,
  getProductDetails,
  updateProduct,
} from "@/server-actions/products";
import { toast } from "@/hooks/use-toast.hook";
import {
  secondLevelNestedRoutes,
  singleLevelNestedRoutes,
} from "@/app/data/routes";
import { JsonValue } from "@prisma/client/runtime/library";
// import ImageUploader from "./image-uploader-1";
import ImageUploader2 from "./image-uploader-2";
import { useFileUploadToCloudinary } from "./use-file-upload";
import { Product } from "@prisma/client";

export type ProductImages = {
  publicId: string;
  secureUrl: string;
  alt: string;
};

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string;

const ProductEditorElements = ({
  displayType,
  productStatus,
  initialValues,
}: ProductEditorSharedProps) => {
  console.log("🚀 ~ initialValues:INIT", initialValues);
  const router = useRouter();

  const defaultValues: ProductFormData = {
    name: initialValues?.name || "",
    price: initialValues?.price || 0,
    description: initialValues?.description || "",
    inventory: initialValues?.inventory || 0,
    images: (initialValues?.images as [] as ProductImages[]) || [],
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

  // console.log("🚀 ~ errors:ERROES", errors);

  // const [newImages, setNewImages] = useState([] as ProductImages[]);
  // const [product, setProduct] = useState<Product | null>(null);
  // console.log("🚀 ~ product:PROD", product);

  const { isUploading, uploadedFiles, uploadFiles, setUploadedFiles } =
    useFileUploadToCloudinary(initialValues?.id as string);

  // useEffect(() => {
  //   async function getProduct() {
  //     if (initialValues?.id) {
  //       const productDetails = await getProductDetails(initialValues?.id);
  //       setProduct(productDetails);
  //       // console.log("��� ~ ProductEditorElements ~ productDetails:", productDetails);
  //     }
  //   }
  //   getProduct();
  // }, [product]);

  // useEffect(() => {
  //   if (initialValues) {
  //     // adaptImages(initialValues.images)
  //     // setUploadedFiles((prevImages) => [
  //     //   ...prevImages,
  //     //   ...adaptImages(initialValues.images),
  //     //   // ...adaptImages(initialValues.images).map((image) => ({
  //     //   //   id: image.id,
  //     //   //   url: image.url,
  //     //   //   alt: image.alt,
  //     //   // })),
  //     // ]);

  //     reset({
  //       name: initialValues.name,
  //       price: initialValues.price,
  //       description: initialValues.description,
  //       inventory: initialValues.inventory,
  //       images: initialValues.images as [] as ProductImages[],
  //       // images: uploadedFiles,
  //       // images: adaptImages(initialValues.images),
  //       storeId: initialValues.storeId as string,
  //     });
  //   }
  // }, [initialValues, reset]);

  // console.log("🚀 ~ uploadedFiles:MONA", uploadedFiles);

  const handleProductSubmit = async (formValues: ProductFormData) => {
    // console.log("🚀 ~ handleProductSubmit ~ formValues:", formValues);
    let data;
    if (initialValues && initialValues.id) {
      // console.log("🚀 ~ handleProductSubmit ~ formValues:VOVO", formValues);

      const response = await updateProduct({
        id: initialValues.id,
        // images: [...adaptImages(initialValues.images), initialValues],
        ...formValues,
      });

      console.log("🚀 ~ handleProductSubmit ~ response:ROR0", response);
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

  // type ImageType = { publicId: string; secureUrl: string; alt: string }; // Type attendu par votre formulaire

  // const adaptImages = (images: JsonValue | null): ImageType[] => {
  //   if (Array.isArray(images)) {
  //     return images
  //       .filter((image) => typeof image === "object" && image !== null) // Filtre les valeurs non valides
  //       .map((image) => ({
  //         publicId: (image as any).id ?? "",
  //         secureUrl: (image as any).url ?? "",
  //         alt: (image as any).alt ?? "",
  //       }));
  //   }
  //   return [];
  // };

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
  // }, [initialValues, reset]);

  const navigateOnCloseModal = useCallback(() => {
    if (displayType === "modal") {
      router.back();
    } else {
      router.push("/account/selling/products");
    }
  }, [router, displayType]);

  // formValues: ProductFormData,
  // const handleProductAction = async (
  //   e:
  //     | FormEvent<HTMLFormElement>
  //     | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   buttonAction?: "delete",
  //   formValues?: ProductFormData
  // ) => {
  //   console.log("🚀 ~ formValues:VOVO", formValues);
  //   e.preventDefault();
  //   // setIsLoading(true);

  //   try {
  //     if (buttonAction === "delete" && initialValues?.id) {
  //       await deleteProduct(initialValues.id);
  //     } else if (initialValues) {
  // const response = await updateProduct({
  //   id: initialValues.id,
  //   ...formValues,
  // });

  //       console.log("🚀 ~ response:MATALANA", response);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     toast({ title: "Error", description: "An unexpected error occurred." });
  //   }

  //   // finally {
  //   //   setIsLoading(false);
  //   // }
  // };

  const dismissModal = useCallback(() => {
    if (displayType === "modal") {
      router.back();
    } else {
      router.push(singleLevelNestedRoutes.account.products);
    }
  }, [router, displayType]);

  console.log("IMAGES", watch("images"));

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

        {productStatus === "existing-product" && (
          <ImageUploader2 productId={initialValues?.id as string} />
        )}

        {/* {productStatus === "existing-product" && (
          <ProductImageUploader
            product={
              props.initialValues as Omit<Product, "images"> & {
                images: ProductImages[];
              }
            }
            newImages={newImages}
            setNewImages={setNewImages}
            imagesToDelete={imagesToDelete}
            setImagesToDelete={setImagesToDelete}
          />
        )} */}

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
                  // }
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
        {/* <div className=" flex justify-end items-center gap-x-2">
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
            Create
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div> */}
      </form>
    </>
  );
};

export default ProductEditorElements;
