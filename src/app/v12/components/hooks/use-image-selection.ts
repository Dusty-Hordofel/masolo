import { ImageData } from "@/@types";
import { useState, useRef } from "react";

export function useImageSelection() {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [previewImageInModal, setPreviewImageInModal] =
    useState<ImageData | null>(null);
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

  // const toggleImageSelection = (imageId: string) => {
  //   setSelectedImages((prev) => {
  //     const newSet = new Set(prev);
  //     newSet.has(imageId) ? newSet.delete(imageId) : newSet.add(imageId);
  //     return newSet;
  //   });
  // };

  const toggleImageSelection = (imageId: string) => {
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
