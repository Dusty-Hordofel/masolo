import { Image } from "@prisma/client";
import { useState, useRef } from "react";

export function useImageSelection() {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [previewImageInModal, setPreviewImageInModal] = useState<Image | null>(
    null
  );
  const [isPreviewAnimating, setIsPreviewAnimating] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const imageListRef = useRef<HTMLDivElement>(null);
  const ignoreNextClick = useRef<boolean>(false);

  // Produits liés
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const toggleImageSelection = (imageId: string) => {
    console.log("🚀 ~ toggleImageSelection ~ imageId:", imageId);
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  return {
    selectedImages,
    setSelectedImages,
    selectedImage,
    setSelectedImage,
    previewImageInModal,
    setPreviewImageInModal,
    isPreviewAnimating,
    setIsPreviewAnimating,
    showAllImages,
    setShowAllImages,
    showExpanded,
    setShowExpanded,
    imageListRef,
    ignoreNextClick,
    selectedProducts,
    setSelectedProducts,
    productSearchQuery,
    setProductSearchQuery,
    toggleImageSelection,
  };
}
