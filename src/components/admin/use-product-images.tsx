import { useState, useCallback } from "react";
import { Image } from "@prisma/client";
import { deleteProductImage } from "@/server-actions/products";
import { toast } from "@/hooks/use-toast.hook";

export const useProductImages = (
  initialImages: Image[],
  setUploadedImages: React.Dispatch<React.SetStateAction<Image[]>>
) => {
  const [productImages, setProductImages] = useState<Image[]>(initialImages);

  const handleDeleteProductImage = useCallback(async (id: string) => {
    try {
      const response = await deleteProductImage(id);
      if (response.success) {
        setProductImages((prev) => prev.filter((image) => image.id !== id));
        setUploadedImages((prev) => prev.filter((image) => image.id !== id));

        toast({
          title: response.title,
          description: response.description,
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({ title: "Erreur", description: "Échec de la suppression." });
    }
  }, []);

  return { productImages, handleDeleteProductImage };
};
