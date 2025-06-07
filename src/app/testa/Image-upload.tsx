import { CloudinaryImage, ImageFormData } from "@/@types/cloudinaty";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
// import { CloudinaryImage, ImageFormData } from '@/@types/cloudinary';

const ImageUpload: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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
    setIsUploading(true);
    setPreviewImages([]);

    try {
      // Créer les prévisualisations
      // const newPreviews: string[] = [];
      const previewPromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const previews = await Promise.all(previewPromises);
      setPreviewImages(previews);

      // Télécharger vers Cloudinary
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }

      const result = await response.json();

      // Ajouter les nouvelles images à la liste existante
      setUploadedImages((prev) => [...prev, ...result.images]);

      // Réinitialiser après un délai pour voir les prévisualisations
      setTimeout(() => {
        reset();
        setPreviewImages([]);
      }, 1500);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du téléchargement des images");
      setPreviewImages([]);
    } finally {
      setIsUploading(false);
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
        {isUploading && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
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
                Téléchargement en cours vers Cloudinary...
              </span>
            </div>
          </div>
        )}

        {/* Prévisualisation pendant le téléchargement */}
        {previewImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Images en cours de téléchargement ({previewImages.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Téléchargement ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <svg
                        className="animate-spin h-6 w-6 text-white"
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
                  )}
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

export default ImageUpload;
