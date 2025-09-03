"use client";

import type React from "react";

import { Dispatch, SetStateAction, useEffect } from "react";
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

export function MultiImageUploader7({
  storeId,
  productId,
}: // setUploadedImages,
{
  storeId: string;
  productId: string;
  // currentProductImages?: Image[];
  // setUploadedImages: React.Dispatch<React.SetStateAction<PrismaImage[]>>;
  // handleDeleteProductImage?: (id: string) => Promise<void>;
}) {
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
    toggleImageSelection,
  } = useImageSelection();

  const {
    images,
    storeImages,
    setStoreImages,
    handleFileChange,
    handleFiles,
    deleteImage,
    deleteSelectedImages,
    fileInputRef,
  } = useImageManager2({ storeId, productId });

  console.log("🚀 ~ MultiImageUploader5 ~ storeImages:", storeImages);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(handleFiles);

  const toggleProductFilter = (product: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(product)) {
        newSet.delete(product);
      } else {
        newSet.add(product);
      }
      return newSet;
    });
  };

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

  // const filteredAndSortedImages = storeImages
  //   .filter((image) => {
  //     if (
  //       searchQuery &&
  //       !image.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //       return false;
  //     if (
  //       fileTypeFilter !== "all" &&
  //       fileTypeFilter === "images" &&
  //       !image.type.startsWith("image/")
  //     )
  //       return false;
  //     if (
  //       minSize &&
  //       Number(image.size) < Number.parseFloat(minSize) * 1024 * 1024
  //     )
  //       return false;
  //     if (
  //       maxSize &&
  //       Number(image.size) > Number.parseFloat(maxSize) * 1024 * 1024
  //     )
  //       return false;
  //     // if (usageFilter !== "all" && !image.usedIn.includes(usageFilter))
  //     //   return false;
  //     // if (
  //     //   selectedProducts.size > 0 &&
  //     //   !Array.from(selectedProducts).some((product) =>
  //     //     image.products.includes(product)
  //     //   )
  //     // )
  //     // return false;
  //     return true;
  //   })
  //   .sort((a, b) => {
  //     switch (sortBy) {
  //       case "date-desc":
  //         return b.createdAt.getTime() - a.createdAt.getTime();
  //       case "date-asc":
  //         return a.createdAt.getTime() - b.createdAt.getTime();
  //       case "name-asc":
  //         return a.name.localeCompare(b.name);
  //       case "name-desc":
  //         return b.name.localeCompare(a.name);
  //       case "size-asc":
  //         return Number(a.size) - Number(b.size);
  //       case "size-desc":
  //         return Number(b.size) - Number(a.size);
  //       default:
  //         return 0;
  //     }
  //   });

  const visibleImages = showExpanded ? storeImages : storeImages.slice(0, 6);

  const remainingCount = Math.max(0, storeImages.length - 5);
  const hasMoreImages = storeImages.length > 5;
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
              src={
                selectedImage.secureUrl
                // || selectedImage.preview
              }
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
      {selectedImages.size > 0 && (
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() =>
              deleteSelectedImages(selectedImages, setSelectedImages)
            }
            variant="destructive"
            size="sm"
          >
            Supprimer ({selectedImages.size})
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {storeImages.length === 0 ? (
        <MediaUploader
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          fileInputRef={fileInputRef}
          setShowAllImages={setShowAllImages}
          showAllImages={showAllImages}
          hasImages={hasImages}
          ignoreNextClick={ignoreNextClick}
        />
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 ">
          {/* First image - large */}
          {storeImages[0] && (
            <div className="col-span-2 row-span-2 aspect-square">
              <ImageCard
                image={storeImages[0]}
                isSelected={selectedImages.has(storeImages[0].id)}
                onToggleSelection={() =>
                  toggleImageSelection(storeImages[0].id)
                }
                onDelete={() =>
                  deleteImage(storeImages[0].id, setSelectedImages)
                }
                onView={() => setSelectedImage(storeImages[0])}
                className="h-full"
              />
            </div>
          )}

          {/* Other images - uniform size */}

          {!showExpanded
            ? visibleImages.slice(1, 7).map((image) => (
                <div
                  key={image.id}
                  className="col-span-1 row-span-1 aspect-square"
                >
                  <ImageCard
                    image={image}
                    isSelected={selectedImages.has(image.id)}
                    onToggleSelection={() => toggleImageSelection(image.id)}
                    onDelete={() => deleteImage(image.id, setSelectedImages)}
                    onView={() => setSelectedImage(image)}
                    className="h-full"
                  />
                </div>
              ))
            : visibleImages.map((image) => (
                <div
                  key={image.id}
                  className="col-span-1 row-span-1 aspect-square"
                >
                  <h1>MOMO</h1>
                  {/* <ImageCard
                    image={image}
                    isSelected={selectedImages.has(image.id)}
                    onToggleSelection={() => toggleImageSelection(image.id)}
                    onDelete={() => deleteImage(image.id, setSelectedImages)}
                    onView={() => setSelectedImage(image)}
                    className="h-full"
                  /> */}
                </div>
              ))}
          {/* More images indicator or Add card */}
          {!showExpanded && hasMoreImages && images.length > 6 && (
            <div
              className="aspect-square relative cursor-pointer group"
              onClick={() => setShowExpanded(true)}
            >
              <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
                {images[7] && (
                  <picture>
                    <img
                      src={images[7].url || images[7].preview}
                      alt="More images"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                )}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white text-center">
                    {/* <Plus className="h-6 w-6 mx-auto mb-1" /> */}
                    <p className="text-sm font-medium">+{remainingCount}</p>
                    <p className="text-xs">images</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="col-span-1 row-span-1 aspect-square">
            <AddImageCard onOpenModal={() => setShowAllImages(true)} />
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
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
                <MediaUploader
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  fileInputRef={fileInputRef}
                  setShowAllImages={setShowAllImages}
                  showAllImages={showAllImages}
                  hasImages={hasImages}
                  ignoreNextClick={ignoreNextClick}
                />
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {filteredAndSortedImages.map((image) => (
                      <MediaLibraryItem
                        key={image.id}
                        image={image}
                        isSelected={selectedImages.has(image.id)}
                        isActive={previewImageInModal?.id === image.id}
                        onToggleSelection={() => toggleImageSelection(image.id)}
                        onDelete={() =>
                          deleteImage(image.id, setSelectedImages)
                        }
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
                            // src={image.url || image.preview}
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
                            checked={selectedImages.has(image.id)}
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
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              deleteImage(image.id, setSelectedImages)
                            }
                          >
                            <X className="h-4 w-4" />
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import MediaLibraryItem from "./media-library-item";
import FilterControls from "./MultiSelect";
import { useImageManager2 } from "./hooks/use-image-manager2";

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

// export function ViewModeSelector({
//   viewMode,
//   setViewMode,
// }: ViewModeSelectorProps) {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="p-2"
//           aria-label="Change display mode"
//         >
//           {viewMode === "grid" ? (
//             <Grid3X3 className="h-4 w-4" />
//           ) : (
//             <List className="h-4 w-4" />
//           )}
//           <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent align="end" className="w-48 p-1">
//         <div className="space-y-1">
//           <Button
//             variant={viewMode === "grid" ? "secondary" : "ghost"}
//             className="w-full justify-start cursor-pointer"
//             onClick={() => setViewMode("grid")}
//           >
//             <Grid3X3 className="h-4 w-4 mr-2" />
//             Affichage en grille
//             {viewMode === "grid" && <Check className="h-4 w-4 ml-auto" />}
//           </Button>
//           <Button
//             variant={viewMode === "list" ? "secondary" : "ghost"}
//             className="w-full justify-start cursor-pointer"
//             onClick={() => {
//               setViewMode("list");
//               // setOpenFilter(null);
//             }}
//           >
//             <List className="h-4 w-4 mr-2" />
//             Affichage en liste
//             {viewMode === "list" && <Check className="h-4 w-4 ml-auto" />}
//           </Button>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }

// export function ViewModeSelector({
//   viewMode,
//   setViewMode,
// }: // setOpenFilter,
// ViewModeSelectorProps) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="p-2"
//           aria-label="Change display mode"
//         >
//           {viewMode === "grid" ? (
//             <Grid3X3 className="h-4 w-4" />
//           ) : (
//             <List className="h-4 w-4" />
//           )}
//           <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem
//           onClick={() => {
//             // setOpenFilter(null);
//             setViewMode("grid");
//           }}
//           className="cursor-pointer"
//         >
//           <Grid3X3 className="h-4 w-4 mr-2" />
//           Affichage en grille
//           {viewMode === "grid" && <Check className="h-4 w-4 ml-auto" />}
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() => {
//             // setOpenFilter(null);
//             setViewMode("list");
//           }}
//           className="cursor-pointer"
//         >
//           <List className="h-4 w-4 mr-2" />
//           Affichage en liste
//           {viewMode === "list" && <Check className="h-4 w-4 ml-auto" />}
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
