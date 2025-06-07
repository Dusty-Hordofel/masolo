import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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

const ImageUpload3: React.FC = () => {
  const [processingImages, setProcessingImages] = useState<
    ImageProcessingState[]
  >([]);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  const { register, control } = useForm<ImageFormData>();

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
      await processIndividualImage(imageState);
    }

    // Nettoyer après traitement (optionnel - garde les images terminées)
    // setTimeout(() => {
    //   setProcessingImages([]);
    //   reset();
    // }, 2000);
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const updateImageState = (
    id: string,
    updates: Partial<ImageProcessingState>
  ) => {
    setProcessingImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const processIndividualImage = async (imageState: ImageProcessingState) => {
    try {
      // Phase 1: Importation (simulation)
      updateImageState(imageState.id, { status: "importing", progress: 20 });
      await new Promise((resolve) => setTimeout(resolve, 800));

      updateImageState(imageState.id, { progress: 40 });
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Phase 2: Traitement
      updateImageState(imageState.id, { status: "processing", progress: 60 });
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Upload vers Cloudinary
      const formData = new FormData();
      formData.append("files", imageState.file);

      updateImageState(imageState.id, { progress: 80 });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }

      const result = await response.json();

      // Phase 3: Terminé
      updateImageState(imageState.id, {
        status: "completed",
        progress: 100,
        cloudinaryData: result.images[0], // Supposant qu'on upload une image à la fois
      });
    } catch (error) {
      console.error("Erreur:", error);
      updateImageState(imageState.id, { status: "error", progress: 0 });
    }
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
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression:", error);

      if (error instanceof Error) {
        alert(`Erreur lors de la suppression de l'image: ${error.message}`);
      } else {
        alert("Erreur inconnue lors de la suppression de l'image.");
      }
    } finally {
      // Retirer l'image de l'état de suppression
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(publicId);
        return newSet;
      });
    }
  };

  const removeImage = (publicId: string, imageId: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette image définitivement de Cloudinary ?"
      )
    ) {
      deleteImageFromCloudinary(publicId, imageId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Téléchargement d&apos;Images Cloudinary
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
                  className="relative bg-white rounded-lg border shadow-sm overflow-hidden"
                >
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
                        <button
                          onClick={() =>
                            removeImage(
                              imageState.cloudinaryData!.public_id,
                              imageState.id
                            )
                          }
                          disabled={deletingImages.has(
                            imageState.cloudinaryData.public_id
                          )}
                          className={`absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center transition-all ${
                            deletingImages.has(
                              imageState.cloudinaryData.public_id
                            )
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                          title={
                            deletingImages.has(
                              imageState.cloudinaryData.public_id
                            )
                              ? "Suppression en cours..."
                              : "Supprimer définitivement"
                          }
                        >
                          {deletingImages.has(
                            imageState.cloudinaryData.public_id
                          ) ? (
                            <svg
                              className="animate-spin h-3 w-3 text-white"
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
                          ) : (
                            "×"
                          )}
                        </button>
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

                    {/* Informations pour les images terminées */}
                    {imageState.status === "completed" &&
                      imageState.cloudinaryData && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">ID:</span>{" "}
                            {imageState.cloudinaryData.public_id}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Dimensions:</span>{" "}
                            {imageState.cloudinaryData.width} ×{" "}
                            {imageState.cloudinaryData.height}
                          </p>
                          <a
                            href={imageState.cloudinaryData.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium block"
                          >
                            Voir l&apos;image complète →
                          </a>
                        </div>
                      )}

                    {/* Nom du fichier pour les images en cours */}
                    {imageState.status !== "completed" && (
                      <p className="text-xs text-gray-600 truncate">
                        {imageState.file.name}
                      </p>
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

export default ImageUpload3;
