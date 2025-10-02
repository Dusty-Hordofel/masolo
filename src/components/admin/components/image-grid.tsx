import React, { Dispatch, SetStateAction, useCallback } from "react";
import ImageCard from "./image-card";
import AddImageCard from "./add-image-card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Image } from "@prisma/client";
// import { UploadingImage } from "../product-media-uploader5";

// Composant amélioré avec de meilleures pratiques
const ImageGrid = ({
  visibleImages,
  storeImages,
  selectedImageIds,
  toggleImageSelection,
  setSelectedImage,
  showExpanded,
  setShowExpanded,
  hasMoreImages,
  isUploading,
  setShowAllImages,
  uploadingImages,
}: {
  visibleImages: Image[];
  storeImages: Image[];
  selectedImageIds: string[];
  toggleImageSelection: (id: string) => void;
  setSelectedImage: Dispatch<SetStateAction<Image | null>>;
  showExpanded: boolean;
  setShowExpanded: Dispatch<SetStateAction<boolean>>;
  hasMoreImages: boolean;
  isUploading: boolean;
  setShowAllImages: React.Dispatch<React.SetStateAction<boolean>>;
  uploadingImages: UploadingImage[];
}) => {
  // Calcul des données dérivées
  const firstImage = visibleImages[0];
  const remainingImages = visibleImages.slice(1);
  const remainingCount = Math.max(0, storeImages.length - visibleImages.length);
  const moreImagesPreview = visibleImages[7];

  // Gestionnaires d'événements optimisés
  const handleToggleSelection = useCallback(
    (imageId: string) => {
      toggleImageSelection(imageId);
    },
    [toggleImageSelection]
  );

  const handleViewImage = useCallback(
    (image: Image) => {
      setSelectedImage(image);
    },
    [setSelectedImage]
  );

  const handleExpandGrid = useCallback(() => {
    setShowExpanded(true);
  }, [setShowExpanded]);

  const handleOpenModal = useCallback(() => {
    setShowAllImages(true);
  }, [setShowAllImages]);

  // Composant pour l'image principale
  const MainImageCard = () => {
    if (!firstImage) return null;

    return (
      <div className="col-span-2 row-span-2 aspect-square">
        <ImageCard
          image={storeImages[0]}
          isSelected={selectedImageIds.includes(firstImage.id)}
          onToggleSelection={() => handleToggleSelection(firstImage.id)}
          onView={() => handleViewImage(firstImage)}
          className="h-full w-full"
        />
      </div>
    );
  };

  // Composant pour les images secondaires
  const SecondaryImageCards = () => (
    <>
      {remainingImages.map((image) => (
        <div key={image.id} className="col-span-1 row-span-1 aspect-square">
          <ImageCard
            image={image}
            isSelected={selectedImageIds.includes(image.id)}
            onToggleSelection={() => handleToggleSelection(image.id)}
            onView={() => handleViewImage(image)}
            className="h-full w-full"
          />
        </div>
      ))}
    </>
  );

  // Composant pour l'indicateur "plus d'images"
  const MoreImagesIndicator = () => {
    if (!(!showExpanded && hasMoreImages && !isUploading)) return null;

    return (
      <div
        className="aspect-square relative cursor-pointer group transition-transform hover:scale-105"
        onClick={handleExpandGrid}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleExpandGrid();
          }
        }}
        aria-label={`Voir ${remainingCount} images supplémentaires`}
      >
        <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
          {moreImagesPreview && (
            <picture>
              <img
                src={moreImagesPreview.secureUrl}
                alt={`Aperçu de ${remainingCount} images supplémentaires`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </picture>
          )}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors group-hover:bg-black/70">
            <div className="text-white text-center">
              <p className="text-sm font-medium">+{remainingCount}</p>
              <p className="text-xs opacity-90">
                {remainingCount === 1 ? "image" : "images"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour le bouton d'ajout
  const AddImageButton = () => {
    if (!(showExpanded && hasMoreImages && !isUploading)) return null;

    return (
      <div className="col-span-1 row-span-1 aspect-square">
        <AddImageCard
          onOpenModal={handleOpenModal}
          // className="h-full w-full"
        />
      </div>
    );
  };

  // Composant pour les images en cours d'upload
  const UploadingImages = () =>
    uploadingImages.map((img, idx) => {
      return (
        <UploadingImage
          image={img}
          index={idx}
          visibleImages={visibleImages.length}
        />
      );
    });

  return (
    <div
      className="grid grid-cols-3 gap-1 sm:grid-cols-6 auto-rows-fr"
      role="grid"
      aria-label="Galerie d'images de produits"
    >
      <MainImageCard />
      <SecondaryImageCards />
      <MoreImagesIndicator />
      <UploadingImages />
      <AddImageButton />
    </div>
  );
};

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

// Exemple d'utilisation avec React.memo pour les performances
export default React.memo(ImageGrid);
