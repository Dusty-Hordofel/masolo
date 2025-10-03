"use client";

import type React from "react";

import { Dispatch, SetStateAction} from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Eye,
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

import { useImageFilters } from "../_hooks/use-image-filters";
import {  Image as PrismaImage } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import MediaLibraryItem from "../_hooks/media-library-item";
import { UploadingImage } from "./multi-image-uploader";
import { ViewModeSelector } from "./view-mode-selector";
import MediaDropZone from "./media-drop-zone";
import FilterControls from "./filter-controls";


const MediaLibraryDialog = ({
    storeImages,
    toggleImageSelection,
    setUploadingImages,
    uploadFile,
    hasImages,
    selectedImageIds, 
    showAllImages,
    setShowAllImages,
    setPreviewImageInModal,
    previewImageInModal,
    isPreviewAnimating, 
    setIsPreviewAnimating,
    imageListRef
}:{
    hasImages:boolean;
    imageListRef?: React.RefObject<HTMLDivElement>;
    isPreviewAnimating:boolean, 
    setIsPreviewAnimating:React.Dispatch<React.SetStateAction<boolean>>,
    storeImages: PrismaImage[];
    toggleImageSelection: (id: string) => void;
    selectedImageIds:string[];
    showAllImages:boolean,
    setShowAllImages: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadingImages: React.Dispatch<React.SetStateAction<UploadingImage[]>>;
    previewImageInModal:PrismaImage | null;
    setPreviewImageInModal: Dispatch<SetStateAction<PrismaImage | null>>;
     uploadFile: (file: File) => Promise<{
    success: boolean;
    title: string;
    description: string;
    data: PrismaImage;
}

>
    
}
    
) => {

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



  return (
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
  )
}

export default MediaLibraryDialog