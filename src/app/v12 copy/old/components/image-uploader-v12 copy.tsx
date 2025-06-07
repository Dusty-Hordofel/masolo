"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageUploaded?: (imageData: { url: string; publicId: string }) => void;
  onImageDeleted?: (publicId: string) => void;
  onSelectionChange?: (isSelected: boolean, publicId?: string) => void;
}

export function ImageUploaderv12({
  onImageUploaded,
  onImageDeleted,
  onSelectionChange,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    publicId: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start upload automatically when file is selected
  useEffect(() => {
    if (file && !isUploading && !isComplete) {
      uploadToCloudinary();
    }
  }, [file, isUploading, isComplete]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image");
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 10MB");
      return;
    }

    // Reset states
    setError(null);
    setIsComplete(false);
    setProgress(0);
    setIsSelected(false);

    // Set file and create preview
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setUploadedImage({ url: response.url, publicId: response.publicId });
          setIsComplete(true);
          setIsUploading(false);
          setProgress(100);
          onImageUploaded?.(response);
        } else {
          setError(
            `Erreur de téléchargement: ${xhr.statusText || "Erreur inconnue"}`
          );
          setIsUploading(false);
        }
      });

      xhr.addEventListener("error", () => {
        setError("Erreur de connexion");
        setIsUploading(false);
      });

      xhr.open("POST", "/api/upload-cloudinary");
      xhr.send(formData);
    } catch (err) {
      setError("Erreur de téléchargement");
      setIsUploading(false);
      console.error("Upload error:", err);
    }
  };

  const deleteFromCloudinary = async () => {
    if (!uploadedImage) return;

    try {
      const response = await fetch("/api/delete-cloudinary", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: uploadedImage.publicId }),
      });

      if (response.ok) {
        onImageDeleted?.(uploadedImage.publicId);
        resetUploader();
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error("Delete error:", err);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setIsUploading(false);
    setIsComplete(false);
    setIsSelected(false);
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsSelected(checked);
    onSelectionChange?.(checked, uploadedImage?.publicId);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Only toggle selection if the image is complete and not clicking on checkbox
    if (isComplete && !(e.target as HTMLElement).closest("[data-checkbox]")) {
      const newSelection = !isSelected;
      setIsSelected(newSelection);
      onSelectionChange?.(newSelection, uploadedImage?.publicId);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      <CardContent className="p-0">
        {!file ? (
          <div
            className={cn(
              "aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors border-2 border-dashed m-4 rounded-lg",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-3 p-6">
              <div className="rounded-full bg-muted p-4">
                <Upload className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-1">Ajouter une image</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Glissez-déposez ou cliquez
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF (max 10MB)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative aspect-square">
            {/* Image Preview */}
            <img
              src={uploadedImage?.url || preview || "/placeholder.svg"}
              alt="Preview"
              className={cn(
                "w-full h-full object-cover",
                isComplete ? "cursor-pointer" : ""
              )}
              onClick={handleImageClick}
            />

            {/* Upload Progress Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 w-4/5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload en cours...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 w-4/5 text-center">
                  <p className="text-sm text-destructive mb-2">{error}</p>
                  <Button size="sm" onClick={resetUploader}>
                    Réessayer
                  </Button>
                </div>
              </div>
            )}

            {/* Controls Overlay (only when complete) */}
            {isComplete && (
              <>
                {/* Checkbox */}
                <div className="absolute top-2 right-2" data-checkbox>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={handleCheckboxChange}
                    className="h-5 w-5 bg-white border-2 shadow-sm"
                  />
                </div>

                {/* Delete Button */}
                <div className="absolute top-2 left-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromCloudinary();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {/* Selection Overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg pointer-events-none" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
