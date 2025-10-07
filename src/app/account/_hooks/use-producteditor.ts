import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
} from "@/actions/products";
import {
  secondLevelNestedRoutes,
  singleLevelNestedRoutes,
} from "@/app/data/routes";
import {
  Image,
} from "@prisma/client";
import {
  ProductEditorSharedProps,
} from "@/@types/admin/product";

export function useProductEditor({
  displayType,
  initialValues,
}: ProductEditorSharedProps) {
  const router = useRouter();

  // Status of uploaded & deleted images
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);

  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  console.log("🚀 ~ useProductEditor ~ selectedImageIds:SIDS", selectedImageIds);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // React Hook Form
  const defaultValues: ProductFormData = useMemo(
    () => ({
      name: initialValues?.name || "",
      price: initialValues?.price || 0,
      description: initialValues?.description || "",
      inventory: initialValues?.inventory || 0,
      storeId: initialValues?.storeId || undefined,
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
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
  }, [initialValues, defaultValues, reset]);

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
        // initialValues?.storeId as string
        // "5f4dba74-1040-4fcd-831f-920226cba241"
        "cmg6c0mav0000uwx0afcc3nu2"
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
    setDeletedImageIds((prev) => [...prev, id]);

    const result = await deleteProductImage(id);
    console.log("🚀 ~ handleDeleteProductImage ~ result:DELETION RESULT", result)
    if (result.success) {
      toast({
        title: result.title,
        description: result.description,
      });
    } else {
      setDeletedImageIds((prev) => prev.filter((imgId) => imgId !== id));
      toast({
        title: result.title,
        description: result.description,
      });
    } 
  };


  // Fonction pour sélectionner/désélectionner une image
  const toggleImageSelection = (id: string) => {
    setSelectedImageIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((imgId) => imgId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Fonction pour supprimer plusieurs images sélectionnées
  const handleDeleteSelectedImages = async () => {
    if (selectedImageIds.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une image à supprimer.",
      });
      return;
    }

    setIsDeleting(true);

    // Marquer toutes les images comme en cours de suppression
    setDeletedImageIds((prev) => [...prev, ...selectedImageIds]);

    const deletePromises = selectedImageIds.map((id) => deleteProductImage(id));
    const results = await Promise.allSettled(deletePromises);

    console.log("🚀 ~ handleDeleteSelectedImages ~ results:RERE", results)
    
    
    let successCount = 0;
    let failedIds: string[] = [];

    results.forEach((result, index) => {
      const imageId = selectedImageIds[index];

      if (result.status === "fulfilled" && result.value.success) {
        successCount++;
      } else {
        failedIds.push(imageId);
      }
    }); 

    // Retirer les IDs qui ont échoué de la liste des supprimés
     if (failedIds.length > 0) {
      setDeletedImageIds((prev) =>
        prev.filter((id) => !failedIds.includes(id))
      );
    } 

    // Afficher le résultat
     if (successCount === selectedImageIds.length) {
      toast({
        title: "Suppression réussie",
        description: `${successCount} image(s) supprimée(s) avec succès.`,
      });
    } else if (successCount > 0) {
      toast({
        title: "Suppression partielle",
        description: `${successCount} image(s) supprimée(s), ${failedIds.length} ont échoué.`,
      });
    } else {
      toast({
        title: "Échec de la suppression",
        description: "Aucune image n'a pu être supprimée.",
      });
    }
 
    // Réinitialiser l'état
    setSelectedImageIds([]);
    setIsSelectionMode(false);
    setIsDeleting(false);
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
    control,
    errors,
    setValue,
    isSubmitting,
    handleProductSubmit,
    handleDeleteProduct,
    handleDeleteProductImage,
    closeModal,
    currentProductImages,
    setUploadedImages,
    handleDeleteSelectedImages,
    toggleImageSelection,
    selectedImageIds,
    setSelectedImageIds,
  };
}
