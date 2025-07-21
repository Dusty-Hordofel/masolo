import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileImage } from "lucide-react";

interface UploadUIProps {
  isUploading: boolean;
  uploadProgress: {
    current: number;
    total: number;
    fileName: string;
    fileSize: string;
    percentage: number;
    canCancel: boolean;
  } | null;
  uploadedCount: number;
  failedUploads: string[];
  cancelledUploads: string[];
  canCancel: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onCancel: () => void;
}

const UploadUI: React.FC<UploadUIProps> = ({
  isUploading,
  uploadProgress,
  uploadedCount,
  failedUploads,
  cancelledUploads,
  canCancel,
  onUpload,
  onCancel,
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />

        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FileImage className="w-12 h-12 text-gray-400" />
          <span className="text-sm text-gray-600">
            {isUploading
              ? "Upload en cours..."
              : "Cliquez pour sélectionner des images"}
          </span>
        </label>
      </div>

      {/* Progress d'upload */}
      {uploadProgress && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">
                Upload en cours ({uploadProgress.current}/{uploadProgress.total}
                )
              </span>
            </div>

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
            )}
          </div>

          <Progress value={uploadProgress.percentage} className="mb-2" />

          <div className="text-xs text-gray-600">
            <p>
              Fichier actuel: {uploadProgress.fileName} (
              {uploadProgress.fileSize})
            </p>
            <p>{uploadedCount} image(s) uploadée(s) avec succès</p>
          </div>
        </div>
      )}

      {/* Résultats */}
      {(failedUploads.length > 0 || cancelledUploads.length > 0) && (
        <div className="space-y-2">
          {failedUploads.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                Échecs d'upload ({failedUploads.length}):
              </p>
              <ul className="text-xs text-red-600 mt-1 space-y-1">
                {failedUploads.map((filename, index) => (
                  <li key={index}>• {filename}</li>
                ))}
              </ul>
            </div>
          )}

          {cancelledUploads.length > 0 && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700 font-medium">
                Uploads annulés ({cancelledUploads.length}):
              </p>
              <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                {cancelledUploads.map((filename, index) => (
                  <li key={index}>• {filename}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadUI;
