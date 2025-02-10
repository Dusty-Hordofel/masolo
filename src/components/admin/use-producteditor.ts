import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast.hook";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/products/product.schema";
import {
  createNewProduct,
  deleteProduct,
  deleteProductImage,
  updateProduct,
} from "@/server-actions/products";
import {
  secondLevelNestedRoutes,
  singleLevelNestedRoutes,
} from "@/app/data/routes";
import {
  Image,
  // , Product
} from "@prisma/client";
import {
  ProductEditorSharedProps,
  // ProductWithImages,
} from "@/@types/admin/admin.products.interface";

export function useProductEditor({
  displayType,
  // productStatus,
  initialValues,
}: ProductEditorSharedProps) {
  const router = useRouter();

  // Status of uploaded & deleted images
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // React Hook Form
  const defaultValues: ProductFormData = {
    name: initialValues?.name || "",
    price: initialValues?.price || 0,
    description: initialValues?.description || "",
    inventory: initialValues?.inventory || 0,
    // storeId: initialValues?.storeId || undefined,
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

  // Update the form when initial values change
  useEffect(() => {
    if (initialValues) {
      reset(defaultValues);
    }
  }, [initialValues, reset]);

  // Filter images (exclude deleted ones)
  const currentProductImages = useMemo(() => {
    return [...(initialValues?.images || []), ...uploadedImages].filter(
      (img) => !deletedImageIds.includes(img.id)
    );
  }, [initialValues?.images, uploadedImages, deletedImageIds]);

  // Manage product submission
  const handleProductSubmit = async (formValues: ProductFormData) => {
    let data;
    if (initialValues?.id) {
      data = await updateProduct({
        id: initialValues.id,
        storeId: initialValues.storeId,
        ...formValues,
      });
      if (data.success) {
        router.refresh();
        router.push(singleLevelNestedRoutes.account.products);
      }
    } else {
      data = await createNewProduct(
        formValues,
        "b4d35aad-f0bd-41d7-827f-1c8a82bef234"
      );
      if (data.productId) {
        router.push(
          `${secondLevelNestedRoutes.product.base}/${data.productId}`
        );
      }
    }
    toast({ title: data?.title, description: data?.description });
  };

  // Manage product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    const deletedProduct = await deleteProduct(id);
    if (deletedProduct.success) {
      router.refresh();
      router.push(singleLevelNestedRoutes.account.products);
    }
    toast({
      title: deletedProduct.title,
      description: deletedProduct.description,
    });
  };

  // Manage image deletion
  const handleDeleteProductImage = async (id: string) => {
    const deletedProductImage = await deleteProductImage(id);
    if (deletedProductImage.success) {
      setDeletedImageIds((prev) => [...prev, id]);
      toast({
        title: deletedProductImage?.title,
        description: deletedProductImage?.description,
      });
    }
  };

  // Close modal
  const closeModal = useCallback(() => {
    router[displayType === "modal" ? "back" : "push"](
      singleLevelNestedRoutes.account.products
    );
  }, [router, displayType]);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    handleProductSubmit,
    handleDeleteProduct,
    handleDeleteProductImage,
    closeModal,
    currentProductImages,
    setUploadedImages,
  };
}
