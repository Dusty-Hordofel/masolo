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
}

const ImageUpload2: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImage[]>([]);
  const [processingImages, setProcessingImages] = useState<
    ImageProcessingState[]
  >([]);

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
      await processIndividualImage(imageState);
    }

    // Nettoyer après traitement
    setTimeout(() => {
      setProcessingImages([]);
      reset();
    }, 2000);
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
      updateImageState(imageState.id, { status: "completed", progress: 100 });

      // Ajouter à la galerie
      setUploadedImages((prev) => [...prev, ...result.images]);
    } catch (error) {
      console.error("Erreur:", error);
      updateImageState(imageState.id, { status: "error", progress: 0 });
    }
  };

  const removeImage = (publicId: string) => {
    setUploadedImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
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

        {/* Images en cours de traitement avec statuts individuels */}
        {processingImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Images en cours de traitement
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {processingImages.map((imageState) => (
                <div
                  key={imageState.id}
                  className="relative bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={imageState.preview}
                      alt={`Traitement ${imageState.file.name}`}
                      className="w-full h-32 object-cover"
                    />

                    {/* Overlay avec spinner */}
                    {imageState.status !== "completed" && (
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
                      <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-green-500 rounded-full p-2">
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
                  </div>

                  {/* Statut et barre de progression */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          imageState.status === "importing"
                            ? "bg-blue-100 text-blue-700"
                            : imageState.status === "processing"
                            ? "bg-orange-100 text-orange-700"
                            : imageState.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {imageState.status === "importing"
                          ? "Importation en cours"
                          : imageState.status === "processing"
                          ? "Traitement en cours"
                          : imageState.status === "completed"
                          ? "Terminé"
                          : "Erreur"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {imageState.progress}%
                      </span>
                    </div>

                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          imageState.status === "error"
                            ? "bg-red-500"
                            : imageState.status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${imageState.progress}%` }}
                      ></div>
                    </div>

                    {/* Nom du fichier */}
                    <p className="text-xs text-gray-600 mt-2 truncate">
                      {imageState.file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Affichage des images téléchargées */}
      {uploadedImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Images téléchargées ({uploadedImages.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedImages.map((image, index) => (
              <div
                key={image.public_id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative">
                  <img
                    src={image.secure_url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.public_id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">ID:</span> {image.public_id}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Dimensions:</span>{" "}
                    {image.width} × {image.height}
                  </p>
                  <a
                    href={image.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Voir l&apos;image complète →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload2;
