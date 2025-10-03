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
  ImageIcon,
  Calendar,
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
import MediaLibraryDialog from "./mediaLibrary-dialog";

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
  handleDeleteSelectedImages,
  toggleImageSelection,
  selectedImageIds,
  setSelectedImageIds,
}: 
{
  storeId: string;
  productId: string;
  // currentProductImages: PrismaImage[];
  storeImages: PrismaImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<PrismaImage[]>>;
  handleDeleteSelectedImages: () => Promise<void>;
  toggleImageSelection: (id: string) => void;
  selectedImageIds: string[];
  setSelectedImageIds: React.Dispatch<React.SetStateAction<string[]>>;

}) {
  console.log("🚀 ~ MultiImageUploader9 ~ selectedImageIds:TALA", selectedImageIds)
  console.log("🚀 ~ MultiImageUploader9 ~ selectedImageIds:TALA", selectedImageIds.length)
 

  const {
   /*  selectedImage, *///ne pas suppimer
    setSelectedImage,
    previewImageInModal,
    setPreviewImageInModal,
    isPreviewAnimating,
    setIsPreviewAnimating,
    showExpanded,
    setShowExpanded,
    imageListRef,
  } = useImageSelection();


  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [showAllImages, setShowAllImages] = useState(false);
  console.log("🚀 ~ MultiImageUploader9 ~ uploadingImages:", uploadingImages);

  const { isUploading, uploadFiles, uploadFile } = useFileUploadToCloudinary(
    storeId,
    productId,
    setUploadedImages
  );


  const visibleImages = showExpanded ? storeImages : storeImages.slice(0, 6);


  /* const remainingCount = Math.max(0, storeImages.length - 6); */
  const hasMoreImages = storeImages.length > 7;
  const hasImages = storeImages.length > 0;


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

 
 

 /*  if (selectedImage)  {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
      <Button
        variant="outline"
        onClick={() => setSelectedImage(null)}
        className="absolute top-4 left-4 flex items-center gap-2 z-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <picture>
        <img
          src={selectedImage.secureUrl}
          alt={selectedImage.name || ""}
          className="max-h-[70vh] max-w-full h-auto w-auto object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
        />
      </picture>

      <div className="w-full max-w-2xl pt-5">
              <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-foreground mb-2 truncate">{selectedImage.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Ajouté le{" "}
                          {selectedImage.createdAt.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              </div>
            </div>
    </div>
  </div>
}
 */

  return (
    <div className="space-y-4">
      
      {
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
              {`Supprimer ${selectedImageIds.length}`}
            </Button>
          </div>
        )
      }

      <MediaDropZone
        setUploadingImages={setUploadingImages}
        uploadFile={uploadFile}
        showAllImages={showAllImages}
        hasImages={hasImages}
      />

      {storeImages.length === 0 ? (
        <MediaDropZone
          setUploadingImages={setUploadingImages}
          uploadFile={uploadFile}
          showAllImages={showAllImages}
          hasImages={hasImages}
        />
      ) : (
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
      )}

      {/* Media Library Modal */}
      <MediaLibraryDialog
        storeImages={storeImages}
        toggleImageSelection={toggleImageSelection}
        setUploadingImages={setUploadingImages}
        uploadFile={uploadFile}
         imageListRef={imageListRef} 
        hasImages={hasImages}
        selectedImageIds={selectedImageIds}
        showAllImages={showAllImages}
        setShowAllImages={setShowAllImages}
          previewImageInModal={previewImageInModal}
        setPreviewImageInModal={setPreviewImageInModal}
        isPreviewAnimating={isPreviewAnimating}
        setIsPreviewAnimating={setIsPreviewAnimating}

        
      />
    </div>
  );
}

