import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createPreview, processIndividualImage } from "./utils/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Types définis directement dans le composant
interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

interface ImageFormData {
  images: FileList;
}

interface ImageProcessingState {
  id: string;
  file: File;
  preview: string;
  status: "importing" | "processing" | "completed" | "error";
  progress: number;
  cloudinaryData?: CloudinaryImage;
}

const ImageUpload5: React.FC = () => {
  const [processingImages, setProcessingImages] = useState<
    ImageProcessingState[]
  >([]);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set()
  );

  const { register, reset, control } = useForm<ImageFormData>();

  const watchedFiles = useWatch({
    control,
    name: "images",
  });

  // Auto-upload dès la sélection des images
  React.useEffect(() => {
    if (watchedFiles && watchedFiles.length > 0) {
      handleAutoUpload(watchedFiles);
    }
  }, [watchedFiles]);

  const handleAutoUpload = async (files: FileList) => {
    // Créer l'état initial pour chaque image
    const initialStates: ImageProcessingState[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = await createPreview(file);

      initialStates.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        status: "importing",
        progress: 0,
      });
    }

    setProcessingImages(initialStates);

    // Traiter chaque image individuellement
    for (const imageState of initialStates) {
      await processIndividualImage(imageState, setProcessingImages);
    }

    // Nettoyer après traitement (optionnel - garde les images terminées)
    // setTimeout(() => {
    //   setProcessingImages([]);
    //   reset();
    // }, 2000);
  };

  const deleteImageFromCloudinary = async (
    publicId: string,
    imageId: string
  ) => {
    // Marquer l'image comme en cours de suppression
    setDeletingImages((prev) => new Set(prev).add(publicId));

    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      const result = await response.json();

      if (result.success) {
        // Supprimer l'image de la liste de traitement
        setProcessingImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        throw new Error("La suppression sur Cloudinary a échoué");
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      alert(`Erreur lors de la suppression de l'image: ${error.message}`);
    } finally {
      // Retirer l'image de l'état de suppression
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(publicId);
        return newSet;
      });
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImageIds((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const deleteSelectedImages = () => {
    if (selectedImageIds.size === 0) return;

    if (window.confirm("Supprimer toutes les images sélectionnées ?")) {
      processingImages.forEach((img) => {
        if (selectedImageIds.has(img.id) && img.cloudinaryData?.public_id) {
          deleteImageFromCloudinary(img.cloudinaryData.public_id, img.id);
        }
      });

      setSelectedImageIds(new Set()); // Réinitialiser la sélection
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Téléchargement d'Images Cloudinary
      </h1>

      {/* Interface de sélection d'images */}
      <div className="mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <label htmlFor="images" className="cursor-pointer">
            <span className="text-lg font-medium text-gray-700">
              Cliquez pour sélectionner des images
            </span>
            <span className="block text-sm text-gray-500 mt-1">
              PNG, JPG, GIF - Téléchargement automatique
            </span>
          </label>

          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            {...register("images")}
          />
        </div>

        {/* Status de téléchargement */}
        {processingImages.length > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-blue-700 font-medium">
                Traitement en cours (
                {
                  processingImages.filter((img) => img.status !== "completed")
                    .length
                }
                /{processingImages.length})
              </span>
            </div>
          </div>
        )}

        {/* Supprimer les images sélectionnées */}
        {selectedImageIds.size > 0 && (
          <div className="mb-4">
            <button
              onClick={deleteSelectedImages}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Supprimer la sélection ({selectedImageIds.size})
            </button>
          </div>
        )}

        {/* Images en cours de traitement et images terminées */}
        {processingImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Images (
              {
                processingImages.filter((img) => img.status === "completed")
                  .length
              }{" "}
              terminées / {processingImages.length} total)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {processingImages.map((imageState) => (
                <div
                  key={imageState.id}
                  className="relative group bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                  {/* backdrop-blur-sm pointer-events-none*/}
                  <div
                    className={cn(
                      "absolute inset-0  transition-opacity z-10  group-hover:cursor-pointer",
                      selectedImageIds.has(imageState.id)
                        ? "bg-white/50 opacity-0 group-hover:opacity-100"
                        : "bg-black/50 opacity-0 group-hover:opacity-100"
                    )}
                  />

                  <div className="relative">
                    <img
                      src={
                        imageState.status === "completed" &&
                        imageState.cloudinaryData
                          ? imageState.cloudinaryData.secure_url
                          : imageState.preview
                      }
                      alt={
                        imageState.status === "completed"
                          ? `Image terminée`
                          : `Traitement ${imageState.file.name}`
                      }
                      className="w-full h-32 object-cover"
                    />

                    {/* Overlay avec spinner pour les images en cours */}
                    {imageState.status !== "completed" &&
                      imageState.status !== "error" && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="text-center">
                            <svg
                              className="animate-spin h-6 w-6 text-white mx-auto mb-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      )}

                    {/* Icône de succès */}
                    {imageState.status === "completed" && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-green-500 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Icône d'erreur */}
                    {imageState.status === "error" && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-red-500 rounded-full p-2">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Bouton de suppression pour les images terminées */}
                    {imageState.status === "completed" &&
                      imageState.cloudinaryData && (
                        // opacity-0 group-hover:opacity-100
                        <div
                          className={cn(
                            "absolute top-2 left-2 z-10 bg-white p-1 rounded shadow transition-opacity duration-200",
                            selectedImageIds.has(imageState.id)
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <Checkbox
                            checked={selectedImageIds.has(imageState.id)}
                            onCheckedChange={() =>
                              toggleImageSelection(imageState.id)
                            }
                          />
                        </div>
                      )}

                    {/* Overlay de suppression */}
                    {imageState.status === "completed" &&
                      imageState.cloudinaryData &&
                      deletingImages.has(
                        imageState.cloudinaryData.public_id
                      ) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-center">
                            <svg
                              className="animate-spin h-6 w-6 text-white mx-auto mb-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-white text-xs">
                              Suppression...
                            </span>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-3">
                    {/* Statut et barre de progression pour les images en cours */}
                    {imageState.status !== "completed" && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              imageState.status === "importing"
                                ? "bg-blue-100 text-blue-700"
                                : imageState.status === "processing"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {imageState.status === "importing"
                              ? "Importation en cours"
                              : imageState.status === "processing"
                              ? "Traitement en cours"
                              : "Erreur"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {imageState.progress}%
                          </span>
                        </div>

                        {/* Barre de progression */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              imageState.status === "error"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${imageState.progress}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload5;
