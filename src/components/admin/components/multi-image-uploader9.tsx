"use client";

import type React from "react";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  CircleX,
  Eye,
  X,
  Loader2,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AddImageCard from "./add-image-card";
import ImageCard from "./image-card";
import { MediaUploader } from "./media-uploader";
import { useImageFilters } from "./hooks/use-image-filters";
import { useImageSelection } from "./hooks/use-image-selection";
import { useDragAndDrop } from "./hooks/use-drag-and-drop";
import { useImageManager } from "./hooks/use-image-manager";
import { Image as PrismaImage } from "@prisma/client";
import { FilterControls0 } from "./filter-controls";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import MediaLibraryItem from "./media-library-item";
import FilterControls from "./MultiSelect";
import {
  ImageGallery,
  MediaDropZone,
  // UploadingImage,
  // UploadingImage,
  // UploadingImage,
  // UploadingImage,
} from "../product-media-uploader5";
import { useFileUploadToCloudinary } from "@/hooks/use-file-upload";
import ImageGrid from "./image-grid";

const PRODUCTS = [
  "Ocean Blue Shirt",
  "Classic Varsity Top",
  "Yellow Wool Jumper",
  "Floral White Top",
  "Striped Silk Blouse",
  "Classic Leather Jacket",
  "Dark Denim Top",
  "Navy Sports Jacket",
  "Soft Winter Jacket",
  "Black Leather Bag",
  "Zipped Jacket",
  "Silk Summer Top",
  "Long Sleeve Cotton Top",
  "Chequered Red Shirt",
  "White Cotton Shirt",
  "Olive Green Jacket",
  "Blue Silk Tuxedo",
  "Red Sports Tee",
  "Striped Skirt and Top",
  "LED High Tops",
];

export type UploadingImage = {
  file: File;
  previewUrl: string;
  status: "uploading" | "processing" | "done";
};

const UploadingImage = ({
  image,
  index,
  visibleImages,
}: {
  image: UploadingImage;
  index: number;
  visibleImages: number;
}) => {
  // if (image.status === "uploading") {
  //   return (
  //     <div
  //       key={index}
  //       className="relative w-full h-full rounded-md border bg-white flex items-center justify-center"
  //     >
  //       <Loader2 className="w-6 h-6 animate-spin mb-1" />
  //       <span className="absolute bottom-2 text-xs text-muted-foreground">
  //         Uploading…
  //       </span>
  //     </div>
  //   );
  // }

  if (image.status === "uploading") {
    return (
      <div
        key={index}
        className={cn(
          "relative  rounded-md border bg-white flex items-center justify-center w-full h-full aspect-square",
          index === 0 && visibleImages === 0
            ? " col-span-2 row-span-2 "
            : " col-span-1 row-span-1"
        )}
      >
        <Loader2 className="w-6 h-6 animate-spin mb-1" />
        <span className="absolute bottom-2 text-xs text-muted-foreground">
          Uploading…
        </span>
      </div>
    );
  }

  if (image.status === "processing") {
    return (
      <div
        key={index}
        className={cn(
          "relative rounded-md overflow-hidden border w-full h-full aspect-square",
          index === 0 && visibleImages === 0
            ? " col-span-2 row-span-2 "
            : "col-span-1 row-span-1 "
        )}
      >
        <img
          src={image.previewUrl}
          alt={image.file.name}
          className={`w-full h-full object-cover ${
            image.status === "processing" ? "blur-sm opacity-60" : ""
          }`}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
          <Loader2 className="w-6 h-6 animate-spin mb-1 text-black" />
          <span className="text-black">Processing…</span>
        </div>
      </div>
    );
  }

  // if (image.status === "processing") {
  //   return (
  //     <div
  //       key={index}
  //       className={cn(
  //         "relative rounded-md overflow-hidden border w-full h-full aspect-square",
  //         index === 0 && visibleImages === 0
  //           ? " col-span-2 row-span-2 "
  //           : "col-span-1 row-span-1 "
  //       )}
  //     >
  //       <image
  //         src={image.previewUrl}
  //         alt={image.file.name}
  //         className={`w-full h-full object-cover ${
  //           image.status === "processing" ? "blur-sm opacity-60" : ""
  //         }`}
  //       />

  //       <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
  //         <Loader2 className="w-6 h-6 animate-spin mb-1 text-black" />
  //         <span className="text-black">Processing…</span>
  //       </div>
  //     </div>
  //   );
  // }

  return null;
};

const UploadedImage = ({
  image,
  onDelete,
}: {
  image: PrismaImage;
  onDelete: (id: string) => Promise<void>;
}) => {
  return (
    <div key={image.id} className="relative">
      <picture>
        <img
          src={image.secureUrl}
          alt={`Uploaded ${image.id}`}
          style={{
            width: "144px",
            height: "144px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </picture>

      <button
        type="button"
        className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center"
        onClick={async () => await onDelete(image.id)}
        aria-label="Delete image"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export function MultiImageUploader9({
  storeId,
  productId,
  setUploadedImages,
  storeImages,
  handleDeleteProductImage,
  handleDeleteSelectedImages,
  toggleImageSelection,
  selectedImageIds,
  setSelectedImageIds,
}: // currentProductImages,
// showAllImages,
// hasImages,
{
  storeId: string;
  productId: string;
  // currentProductImages: PrismaImage[];
  storeImages: PrismaImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<PrismaImage[]>>;
  handleDeleteProductImage: (id: string) => Promise<void>;
  handleDeleteSelectedImages: () => Promise<void>;
  toggleImageSelection: (id: string) => void;
  selectedImageIds: string[];
  setSelectedImageIds: React.Dispatch<React.SetStateAction<string[]>>;
  // setShowAllImages?: React.Dispatch<React.SetStateAction<boolean>>;
  // showAllImages?: boolean;
  // hasImages: boolean;
}) {
  // let storeImages: PrismaImage[] = [];

  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    fileTypeFilter,
    setFileTypeFilter,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    usageFilter,
    setUsageFilter,
    openFilter,
    setOpenFilter,
    // filteredAndSortedImages
  } = useImageFilters();

  const {
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
    // toggleImageSelection,
  } = useImageSelection();

  const {
    // images,
    // storeImages,
    setStoreImages,
    handleFileChange,
    handleFiles,
    // deleteImage,
    deleteSelectedImages,
    fileInputRef,
  } = useImageManager();
  // console.log("🚀 ~ MultiImageUploader5 ~ storeImages:", storeImages);

  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  // const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  // const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
  //   new Set()
  // );

  // const deleteImageFromCloudinary = async (
  //   publicId: string,
  //   imageId: string
  // ) => {
  //   // Marquer l'image comme en cours de suppression
  //   setDeletingImages((prev) => new Set(prev).add(publicId));

  //   try {
  //     const response = await fetch("/api/delete-image", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ publicId }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Erreur lors de la suppression");
  //     }

  //     const result = await response.json();

  //     if (result.success) {
  //       // Supprimer l'image de la liste de traitement
  //       setStoreImages((prev) => prev.filter((img) => img.id !== imageId));
  //     } else {
  //       throw new Error("La suppression sur Cloudinary a échoué");
  //     }
  //   } catch (error: unknown) {
  //     console.error("Erreur lors de la suppression:", error);

  //     if (error instanceof Error) {
  //       alert(`Erreur lors de la suppression de l'image: ${error.message}`);
  //     } else {
  //       alert("Erreur inconnue lors de la suppression de l'image.");
  //     }
  //   } finally {
  //     // Retirer l'image de l'état de suppression
  //     setDeletingImages((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(publicId);
  //       return newSet;
  //     });
  //   }
  // };

  const { isUploading, uploadFiles, uploadFile } = useFileUploadToCloudinary(
    storeId,
    productId,
    setUploadedImages
  );

  // Filter and sort images
  const filteredAndSortedImages = storeImages
    .filter((image) => {
      if (
        searchQuery &&
        !image.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      if (
        !fileTypeFilter.includes("images") &&
        !image.type.startsWith("image/")
      ) {
        return false;
      }

      if (
        minSize &&
        Number(image.size) < Number.parseFloat(minSize) * 1024 * 1024
      )
        return false;
      if (
        maxSize &&
        Number(image.size) > Number.parseFloat(maxSize) * 1024 * 1024
      )
        return false;
      // if (usageFilter !== "all" && !image.usedIn.includes(usageFilter))
      //   return false;
      // if (
      //   selectedProducts.size > 0 &&
      //   !Array.from(selectedProducts).some((product) =>
      //     image.products.includes(product)
      //   )
      // )
      // return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "size-asc":
          return Number(a.size) - Number(b.size);
        case "size-desc":
          return Number(b.size) - Number(a.size);
        default:
          return 0;
      }
    });

  const visibleImages = showExpanded ? storeImages : storeImages.slice(0, 6);
  // console.log("🚀 ~ MultiImageUploader9 ~ visibleImages:", visibleImages);

  const remainingCount = Math.max(0, storeImages.length - 6);
  const hasMoreImages = storeImages.length > 7;
  const hasImages = storeImages.length > 0;

  // Navigation for preview in modal
  const navigatePreview = (direction: "next" | "prev") => {
    if (!previewImageInModal) return;

    const currentIndex = filteredAndSortedImages.findIndex(
      (img) => img.id === previewImageInModal.id
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredAndSortedImages.length;
    } else {
      newIndex =
        (currentIndex - 1 + filteredAndSortedImages.length) %
        filteredAndSortedImages.length;
    }

    setPreviewImageInModal(filteredAndSortedImages[newIndex]);
  };

  // Scroll to active image
  useEffect(() => {
    if (previewImageInModal && imageListRef.current) {
      const activeElement = imageListRef.current.querySelector(
        `[data-image-id="${previewImageInModal.id}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [previewImageInModal, imageListRef]);

  const handlePreviewImage = (image: PrismaImage) => {
    if (!previewImageInModal) {
      // Opening animation
      setPreviewImageInModal(image);
      setTimeout(() => setIsPreviewAnimating(true), 10); // Small delay to ensure DOM update
    } else {
      // Already open, just change image
      setPreviewImageInModal(image);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewAnimating(false);
    setTimeout(() => setPreviewImageInModal(null), 300); // Wait for animation to complete
  };

  // console.log("MOAMAA", uploadingImages);

  // Single image view
  if (selectedImage) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedImage(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div className="max-w-4xl mx-auto">
          <picture>
            <img
              src={selectedImage.secureUrl}
              alt={selectedImage.name || ""}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </picture>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">{selectedImage.name}</h3>
            <p className="text-sm text-muted-foreground">
              {/* Taille: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB */}
            </p>
            <p className="text-sm text-muted-foreground">
              Ajouté le: {selectedImage.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      {
        // selectedImages.size > 0
        selectedImageIds.length > 0 && (
          <div className="flex gap-2 justify-end">
            <Button
              onClick={
                handleDeleteSelectedImages
                // deleteSelectedImages(selectedImages, setSelectedImages)
              }
              variant="destructive"
              size="sm"
              type="button"
            >
              Supprimer ({selectedImageIds.length})
            </Button>
          </div>
        )
      }

      {storeImages.length === 0 ? (
        <MediaDropZone
          setUploadingImages={setUploadingImages}
          uploadFile={uploadFile}
          showAllImages={showAllImages}
          hasImages={hasImages}
        />
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 ">
          {visibleImages[0] && (
            <div className="col-span-2 row-span-2 aspect-square">
              <ImageCard
                image={storeImages[0]}
                isSelected={selectedImageIds.includes(visibleImages[0].id)}
                onToggleSelection={() =>
                  toggleImageSelection(visibleImages[0].id)
                }
                // onDelete={() =>
                //   deleteImage(visibleImages[0].id, setSelectedImages)
                // }
                onView={() => setSelectedImage(visibleImages[0])}
                className="h-full"
              />
            </div>
          )}

          {visibleImages.slice(1).map((image) => (
            <div key={image.id} className="col-span-1 row-span-1 aspect-square">
              <ImageCard
                image={image}
                isSelected={selectedImageIds.includes(image.id)}
                onToggleSelection={() => toggleImageSelection(image.id)}
                // onDelete={() => deleteImage(image.id, setSelectedImages)}
                onView={() => setSelectedImage(image)}
                className="h-full"
              />
            </div>
          ))}

          {/* More images indicator or Add card */}
          {!showExpanded && hasMoreImages && !isUploading && (
            <div
              className="aspect-square relative cursor-pointer group"
              onClick={() => setShowExpanded(true)}
            >
              <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
                {visibleImages[7] && (
                  <picture>
                    <img
                      src={visibleImages[7].secureUrl}
                      alt="More images"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                )}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-sm font-medium">+{remainingCount}</p>
                    <p className="text-xs">images</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showExpanded && hasMoreImages && !isUploading && (
            <div className="col-span-1 row-span-1 aspect-square">
              <AddImageCard onOpenModal={() => setShowAllImages(true)} />
            </div>
          )}

          {uploadingImages.map((img, idx) => {
            return (
              <UploadingImage
                image={img}
                index={idx}
                visibleImages={visibleImages.length}
              />
            );
          })}
        </div>
      )}

      <ImageGrid
        visibleImages={visibleImages}
        storeImages={storeImages}
        selectedImageIds={selectedImageIds}
        toggleImageSelection={toggleImageSelection}
        setSelectedImage={setSelectedImage}
        showExpanded={showExpanded}
        setShowExpanded={setShowExpanded}
        hasMoreImages={hasMoreImages}
        isUploading={isUploading}
        setShowAllImages={setShowAllImages}
        uploadingImages={uploadingImages}
      />

      {/* Media Library Modal */}
      <Dialog
        open={showAllImages}
        onOpenChange={(open) => {
          setShowAllImages(open);
          if (!open) {
            setPreviewImageInModal(null);
            setIsPreviewAnimating(false);
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader>
            <DialogTitle className="p-4 border-b bg-gray-100 border-[rgba(227, 227, 227, 1)]">
              Bibliothèque multimédia
            </DialogTitle>

            {/* Search and Controls */}

            <div className="space-y-4  px-5 py-3">
              <div className="flex justify-between items-center space-x-20">
                <div className="relative max-w-[517px] w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des fichiers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* View Mode Dropdown */}
                <ViewModeSelector
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                />
              </div>

              {/* Filters and Sort */}
              <div className="flex  overflow-x-auto gap-4 md:overflow-x-visible">
                <FilterControls
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  minSize={minSize}
                  setMinSize={setMinSize}
                  maxSize={maxSize}
                  setMaxSize={setMaxSize}
                  fileTypeFilter={fileTypeFilter}
                  setFileTypeFilter={setFileTypeFilter}
                />
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex relative">
            {/* Split view when image is selected */}
            <div
              className={cn(
                "flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out",
                previewImageInModal ? "w-1/2" : "w-full"
              )}
            >
              {/* Images Grid/List */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={imageListRef}
              >
                <MediaDropZone
                  setUploadingImages={setUploadingImages}
                  uploadFile={uploadFile}
                  showAllImages={showAllImages}
                  hasImages={hasImages}
                />

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {filteredAndSortedImages.map((image) => (
                      <MediaLibraryItem
                        key={image.id}
                        image={image}
                        isSelected={selectedImageIds.includes(image.id)}
                        isActive={previewImageInModal?.id === image.id}
                        onToggleSelection={() => toggleImageSelection(image.id)}
                        // onDelete={() =>
                        //   deleteImage(image.id, setSelectedImages)
                        // }
                        onView={() => handlePreviewImage(image)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAndSortedImages.map((image) => (
                      <div
                        key={image.id}
                        data-image-id={image.id}
                        className={cn(
                          "flex items-center gap-4 p-2 border rounded-lg transition-colors",
                          previewImageInModal?.id === image.id
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        <picture>
                          <img
                            src={image.secureUrl}
                            alt={image.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </picture>
                        <div className="flex-1">
                          <p className="font-medium">{image.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(Number(image.size) / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Checkbox
                            checked={selectedImageIds.includes(image.id)}
                            onCheckedChange={() =>
                              toggleImageSelection(image.id)
                            }
                          />
                          <Button
                            variant={
                              previewImageInModal?.id === image.id
                                ? "default"
                                : "outline"
                            }
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePreviewImage(image)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Preview Panel with Animation */}
            {previewImageInModal && (
              <div className="w-1/2 relative h-">
                <div
                  className={cn(
                    "border-l grid grid-rows-[auto,1fr,auto] bg-muted transition-transform duration-300 ease-in-out absolute w-full h-full",
                    isPreviewAnimating ? "translate-x-0" : "translate-x-full"
                  )}
                  style={{
                    transform: isPreviewAnimating
                      ? "translateX(0)"
                      : "translateX(100%)",
                  }}
                >
                  {/* header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-medium">Aperçu</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClosePreview}
                    >
                      <CircleX className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="bg-muted px-4 py-5">
                    {/* Image with navigation */}
                    <div className="grid grid-cols-[auto,1fr,auto] h-full">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => navigatePreview("prev")}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <Image
                          src={
                            previewImageInModal.secureUrl
                            // ||
                            // previewImageInModal.preview
                          }
                          alt="Description"
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="100vw"
                          className="px-10"
                        />
                      </div>

                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => navigatePreview("next")}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image metadata */}

                  <div className="p-4 bg-muted border-t">
                    <h4 className="font-medium text-sm truncate">
                      {previewImageInModal.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {previewImageInModal.createdAt.toLocaleDateString()} •{" "}
                      {/* {getFileTypeDisplay(previewImageInModal.type)} •
                      {previewImageInModal.width && previewImageInModal.height
                        ? ` ${previewImageInModal.width} × ${previewImageInModal.height}`
                        : " Dimensions inconnues"} */}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Taille:{" "}
                      {/* {(previewImageInModal.size / 1024 / 1024).toFixed(2)} MB */}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAllImages(false);
                setPreviewImageInModal(null);
                setIsPreviewAnimating(false);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                setShowAllImages(false);
                setPreviewImageInModal(null);
                setIsPreviewAnimating(false);
              }}
            >
              Terminer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ViewMode = "grid" | "list";

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

interface ViewModeSelectorProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  openFilter: string | null;
  setOpenFilter: Dispatch<SetStateAction<string | null>>;
}

export function ViewModeSelector({
  viewMode,
  setViewMode,
  openFilter,
  setOpenFilter,
}: ViewModeSelectorProps) {
  return (
    <Popover
      open={openFilter === "viewMode"}
      onOpenChange={(open) => setOpenFilter(open ? "viewMode" : null)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="p-2"
          aria-label="Change display mode"
        >
          {viewMode === "grid" ? (
            <Grid3X3 className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
          <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-1"
        align="end"
        side="bottom"
        // sideOffset={10}
        alignOffset={80}
        avoidCollisions={false} // Désactive la détection de collision
        hideWhenDetached={false}
      >
        <div className="space-y-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => {
              setViewMode("grid");
              setOpenFilter(null); // Ferme le popover après sélection
            }}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Affichage en grille
            {viewMode === "grid" && <Check className="h-4 w-4 ml-auto" />}
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => {
              setViewMode("list");
              setOpenFilter(null); // Ferme le popover après sélection
            }}
          >
            <List className="h-4 w-4 mr-2" />
            Affichage en liste
            {viewMode === "list" && <Check className="h-4 w-4 ml-auto" />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
