"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ImageData {
  id: string;
  file: File;
  preview: string;
  url?: string;
  publicId?: string;
  isUploaded: boolean;
  isUploading: boolean;
  progress: number;
  isSelected: boolean;
  name: string;
  size: number;
  uploadDate: Date;
  type: string;
  usedIn: string[];
  products: string[];
  width?: number;
  height?: number;
}

type ViewMode = "grid" | "list";
type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "size-asc"
  | "size-desc";
type FileTypeFilter =
  | "all"
  | "images"
  | "videos"
  | "external-videos"
  | "3d-models";

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

export function MultiImageUploader12() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [previewImageInModal, setPreviewImageInModal] =
    useState<ImageData | null>(null);
  const [isPreviewAnimating, setIsPreviewAnimating] = useState(false);

  // Modal states
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>("all");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [usageFilter, setUsageFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isAddMediaUrlDropdownOpen, setIsAddMediaUrlDropdownOpen] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const imageListRef = useRef<HTMLDivElement>(null);

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

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages: ImageData[] = imageFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(),
      file,
      preview: URL.createObjectURL(file),
      isUploaded: false,
      isUploading: false,
      progress: 0,
      isSelected: false,
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
      type: file.type,
      usedIn: ["Supports multimédias du produit"],
      products: [],
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Start uploading each image
    newImages.forEach((image) => {
      uploadImage(image.id);
    });
  };

  const uploadImage = async (imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isUploading: true, progress: 0 } : img
      )
    );

    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image.file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId ? { ...img, progress: percentComplete } : img
            )
          );
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? {
                    ...img,
                    url: response.url,
                    publicId: response.publicId,
                    isUploaded: true,
                    isUploading: false,
                    progress: 100,
                    width: response.width,
                    height: response.height,
                  }
                : img
            )
          );
        }
      });

      xhr.open("POST", "/api/upload-cloudinary");
      xhr.send(formData);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const addImageFromUrl = async () => {
    if (!urlInput.trim()) return;

    try {
      const response = await fetch(urlInput);
      const blob = await response.blob();
      const file = new File([blob], "image-from-url.jpg", { type: blob.type });

      handleFiles([file]);
      setUrlInput("");
    } catch (error) {
      console.error("Error adding image from URL:", error);
    }
  };

  const deleteImage = async (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    if (image.publicId) {
      try {
        await fetch("/api/delete-cloudinary", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: image.publicId }),
        });
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const deleteSelectedImages = async () => {
    const imagesToDelete = images.filter((img) => selectedImages.has(img.id));

    const deletePromises = imagesToDelete.map(async (image) => {
      if (image.publicId) {
        try {
          await fetch("/api/delete-cloudinary", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: image.publicId }),
          });
        } catch (error) {
          console.error("Delete error:", error);
        }
      }
    });

    await Promise.all(deletePromises);
    setImages((prev) => prev.filter((img) => !selectedImages.has(img.id)));
    setSelectedImages(new Set());
  };

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
  const filteredAndSortedImages = images
    .filter((image) => {
      if (
        searchQuery &&
        !image.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (
        fileTypeFilter !== "all" &&
        fileTypeFilter === "images" &&
        !image.type.startsWith("image/")
      )
        return false;
      if (minSize && image.size < Number.parseFloat(minSize) * 1024 * 1024)
        return false;
      if (maxSize && image.size > Number.parseFloat(maxSize) * 1024 * 1024)
        return false;
      if (usageFilter !== "all" && !image.usedIn.includes(usageFilter))
        return false;
      if (
        selectedProducts.size > 0 &&
        !Array.from(selectedProducts).some((product) =>
          image.products.includes(product)
        )
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case "date-asc":
          return a.uploadDate.getTime() - b.uploadDate.getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "size-asc":
          return a.size - b.size;
        case "size-desc":
          return b.size - a.size;
        default:
          return 0;
      }
    });

  const visibleImages = showExpanded ? images : images.slice(0, 5);
  const remainingCount = Math.max(0, images.length - 5);
  const hasMoreImages = images.length > 5;

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
  }, [previewImageInModal]);

  // Handle preview image with animation
  const handlePreviewImage = (image: ImageData) => {
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

  // Format file type for display
  const getFileTypeDisplay = (type: string) => {
    if (type.startsWith("image/")) {
      return type.split("/")[1].toUpperCase();
    }
    return type;
  };

  // Filter products for search
  const filteredProducts = PRODUCTS.filter((product) =>
    product.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

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
          <img
            src={selectedImage.url || selectedImage.preview}
            alt={selectedImage.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">{selectedImage.name}</h3>
            <p className="text-sm text-muted-foreground">
              Taille: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm text-muted-foreground">
              Ajouté le: {selectedImage.uploadDate.toLocaleDateString()}
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
            onClick={deleteSelectedImages}
            variant="destructive"
            size="sm"
          >
            Supprimer ({selectedImages.size})
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Ajouter des images</h3>
              <p className="text-sm text-muted-foreground mb-1">
                Glissez-déposez ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF (max 10MB chacune)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-2 h-96">
          {/* First image - large */}
          {images[0] && (
            <div className="col-span-3 row-span-2 relative">
              <ImageCard
                image={images[0]}
                isSelected={selectedImages.has(images[0].id)}
                onToggleSelection={() => toggleImageSelection(images[0].id)}
                onDelete={() => deleteImage(images[0].id)}
                onView={() => setSelectedImage(images[0])}
                className="h-full"
              />
            </div>
          )}

          {/* Other images - uniform size */}
          <div className="col-span-3 grid grid-cols-3 gap-2">
            {visibleImages.slice(1, 7).map((image, index) => (
              <div key={image.id} className="aspect-square">
                <ImageCard
                  image={image}
                  isSelected={selectedImages.has(image.id)}
                  onToggleSelection={() => toggleImageSelection(image.id)}
                  onDelete={() => deleteImage(image.id)}
                  onView={() => setSelectedImage(image)}
                  className="h-full"
                />
              </div>
            ))}

            {/* More images indicator or Add card */}
            {!showExpanded && hasMoreImages && visibleImages.length > 6 ? (
              <div
                className="aspect-square relative cursor-pointer group"
                onClick={() => setShowExpanded(true)}
              >
                <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
                  {images[7] && (
                    <img
                      src={images[7].url || images[7].preview}
                      alt="More images"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-center">
                      <Plus className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">+{remainingCount}</p>
                      <p className="text-xs">images</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square">
                <AddImageCard
                  onFileSelect={() => fileInputRef.current?.click()}
                  onOpenModal={() => setShowAllImages(true)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isDragging={isDragging}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
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
        {/* [rgba(243, 243, 243, 1)] */}
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0 sm:rounded-2xl">
          <DialogHeader
          // className="p-4 border-b"
          >
            <DialogTitle className="p-4 border-b bg-gray-100 border-[rgba(227, 227, 227, 1)]">
              Bibliothèque multimédia
            </DialogTitle>

            {/* Search and Controls */}
            <div className="space-y-4 bg-yellow-100 px-5 py-3">
              <div className="flex justify-between items-center bg-purple-300">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      {viewMode === "grid" ? (
                        <Grid3X3 className="h-4 w-4" />
                      ) : (
                        <List className="h-4 w-4" />
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setViewMode("grid")}
                      className="cursor-pointer"
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Affichage en grille
                      {viewMode === "grid" && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setViewMode("list")}
                      className="cursor-pointer"
                    >
                      <List className="h-4 w-4 mr-2" />
                      Affichage en liste
                      {viewMode === "list" && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filters and Sort */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      Date d'ajout (le plus récent en premier)
                    </SelectItem>
                    <SelectItem value="date-asc">
                      Date d'ajout (le plus ancien en premier)
                    </SelectItem>
                    <SelectItem value="name-asc">
                      Nom du fichier (A-Z)
                    </SelectItem>
                    <SelectItem value="name-desc">
                      Nom du fichier (Z-A)
                    </SelectItem>
                    <SelectItem value="size-asc">
                      Taille du fichier (le plus petit en premier)
                    </SelectItem>
                    <SelectItem value="size-desc">
                      Taille du fichier (le plus grand en premier)
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={fileTypeFilter}
                  onValueChange={(value: FileTypeFilter) =>
                    setFileTypeFilter(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de fichier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="videos">Vidéos</SelectItem>
                    <SelectItem value="external-videos">
                      Vidéos externes
                    </SelectItem>
                    <SelectItem value="3d-models">Modèles 3D</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={usageFilter} onValueChange={setUsageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Utilisé dans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="Supports multimédias du produit">
                      Supports multimédias du produit
                    </SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>

                {/* Products Filter with Checkboxes */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      Produits{" "}
                      {selectedProducts.size > 0 &&
                        `(${selectedProducts.size})`}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="p-3 border-b">
                      <Input
                        placeholder="Rechercher des produits..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product}
                          className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
                        >
                          <Checkbox
                            checked={selectedProducts.has(product)}
                            onCheckedChange={() => toggleProductFilter(product)}
                          />
                          <label
                            className="text-sm cursor-pointer flex-1"
                            onClick={() => toggleProductFilter(product)}
                          >
                            {product}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedProducts.size > 0 && (
                      <div className="p-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProducts(new Set())}
                          className="w-full"
                        >
                          Effacer la sélection
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* File Size Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      Taille {(minSize || maxSize) && "(Filtré)"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Taille du fichier (Mo)
                        </Label>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Min"
                          value={minSize}
                          onChange={(e) => setMinSize(e.target.value)}
                          type="number"
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">à</span>
                        <Input
                          placeholder="Max"
                          value={maxSize}
                          onChange={(e) => setMaxSize(e.target.value)}
                          type="number"
                          className="flex-1"
                        />
                      </div>
                      {(minSize || maxSize) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMinSize("");
                            setMaxSize("");
                          }}
                          className="w-full"
                        >
                          Effacer
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex">
            {/* Split view when image is selected */}
            <div
              className={cn(
                "flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out",
                previewImageInModal ? "w-1/2" : "w-full"
              )}
            >
              {/* Upload section */}
              <div className="p-4 border-b">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList>
                    <TabsTrigger value="upload">
                      Télécharger des fichiers
                    </TabsTrigger>
                    <TabsTrigger value="url">Ajouter par URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="space-y-2">
                    <Button
                      onClick={() => modalFileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Sélectionner des fichiers
                    </Button>
                    <input
                      ref={modalFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </TabsContent>
                  <TabsContent value="url" className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL de l'image..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                      <Button onClick={addImageFromUrl}>Ajouter</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* upload section 2 */}
              {/* <div className="px-5 mt-4 mb-5">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="space-y-2">
                      <div className="relative ">
                        <p className="border w-max px-3 py-[6px] rounded-lg hover:bg-gray-100">
                          <span>Ajouter un support multimédia</span>
                        </p>
                        <div className="_Activator_17fbw_1 absolute right-3 top-0">
                          <Button
                            variant="link"
                            type="button"
                            aria-label="Ajouter à partir d'une URL"
                            tabIndex={0}
                            aria-controls=":r1qh:"
                            aria-owns=":r1qh:"
                            aria-expanded="true"
                            data-state="open"
                            aria-haspopup="dialog"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("EKO SIMBA");
                              // onOpenModal();
                            }}
                          >
                            Ajouter à partir d'une URL
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Glisser-déposer des images, des vidéos, des modèles 3D
                        et des fichiers
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* upload section 3 */}
              <div className="p-4 border-b">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors relative",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => modalFileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-muted p-4">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">
                        Ajouter des images
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Glissez-déposez ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF (max 10MB chacune)
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-xs text-muted-foreground">ou</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2"
                        >
                          Ajouter par URL
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="url-input">URL de l'image</Label>
                          <div className="flex gap-2">
                            <Input
                              id="url-input"
                              placeholder="https://exemple.com/image.jpg"
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                            />
                            <Button onClick={addImageFromUrl}>Ajouter</Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Images Grid/List */}
              <div className="flex-1 overflow-y-auto p-4" ref={imageListRef}>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredAndSortedImages.map((image) => (
                      <MediaLibraryItem
                        key={image.id}
                        image={image}
                        isSelected={selectedImages.has(image.id)}
                        isActive={previewImageInModal?.id === image.id}
                        onToggleSelection={() => toggleImageSelection(image.id)}
                        onDelete={() => deleteImage(image.id)}
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
                        <img
                          src={image.url || image.preview}
                          alt={image.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{image.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
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
                            onClick={() => deleteImage(image.id)}
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
              <div
                className={cn(
                  "w-1/2 border-l flex flex-col h-full transition-transform duration-300 ease-in-out",
                  isPreviewAnimating ? "translate-x-0" : "translate-x-full"
                )}
                style={{
                  transform: isPreviewAnimating
                    ? "translateX(0)"
                    : "translateX(100%)",
                }}
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium">Aperçu</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClosePreview}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col">
                  {/* Image with navigation */}
                  <div className="relative flex-1 flex items-center justify-center p-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 rounded-full z-10"
                      onClick={() => navigatePreview("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <img
                      src={
                        previewImageInModal.url || previewImageInModal.preview
                      }
                      alt={previewImageInModal.name}
                      className="max-w-full max-h-[60vh] object-contain transition-opacity duration-200"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 rounded-full z-10"
                      onClick={() => navigatePreview("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image metadata */}
                  <div className="p-4 bg-muted">
                    <h4 className="font-medium text-sm truncate">
                      {previewImageInModal.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {previewImageInModal.uploadDate.toLocaleDateString()} •{" "}
                      {getFileTypeDisplay(previewImageInModal.type)} •
                      {previewImageInModal.width && previewImageInModal.height
                        ? ` ${previewImageInModal.width} × ${previewImageInModal.height}`
                        : " Dimensions inconnues"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Taille:{" "}
                      {(previewImageInModal.size / 1024 / 1024).toFixed(2)} MB
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

interface ImageCardProps {
  image: ImageData;
  isSelected: boolean;
  onToggleSelection: () => void;
  onDelete: () => void;
  onView: () => void;
  className?: string;
}

function ImageCard({
  image,
  isSelected,
  onToggleSelection,
  onDelete,
  onView,
  className,
}: ImageCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0 relative h-full">
        <div className="relative h-full cursor-pointer" onClick={onView}>
          <img
            src={image.url || image.preview}
            alt="Upload"
            className="w-full h-full object-cover"
          />

          {/* Upload Progress Overlay */}
          {image.isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 min-w-[120px]">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload...</span>
                    <span>{Math.round(image.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          {image.isUploaded && (
            <>
              {/* Checkbox */}
              <div
                className="absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggleSelection}
                  className="h-5 w-5 bg-white border-2 shadow-sm"
                />
              </div>

              {/* Delete Button */}
              <div
                className="absolute top-2 left-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 rounded-full shadow-sm"
                  onClick={onDelete}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}

          {/* Selection Overlay */}
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MediaLibraryItemProps {
  image: ImageData;
  isSelected: boolean;
  isActive: boolean;
  onToggleSelection: () => void;
  onDelete: () => void;
  onView: () => void;
}

function MediaLibraryItem({
  image,
  isSelected,
  isActive,
  onToggleSelection,
  onDelete,
  onView,
}: MediaLibraryItemProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden group transition-all duration-200",
        isActive ? "ring-2 ring-primary scale-105" : "hover:scale-102"
      )}
      data-image-id={image.id}
    >
      <img
        src={image.url || image.preview}
        alt={image.name}
        className="w-full aspect-square object-cover"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />

      {/* Controls */}
      <div
        className="absolute top-2 right-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelection}
          className="h-5 w-5 bg-white border-2 shadow-sm"
        />
      </div>

      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1">
          <Button
            variant={isActive ? "default" : "secondary"}
            size="icon"
            className="h-8 w-8 bg-black/70 hover:bg-black/90"
            onClick={onView}
          >
            <Eye className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File name */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs truncate">
        {image.name}
      </div>
    </div>
  );
}

interface AddImageCardProps {
  onFileSelect: () => void;
  onOpenModal: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}

function AddImageCard({
  onFileSelect,
  onOpenModal,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
}: AddImageCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative h-full">
        <div
          className={cn(
            "aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors border-2 border-dashed",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onFileSelect}
        >
          <div className="flex flex-col items-center justify-center space-y-2 p-4">
            <div className="rounded-full bg-muted p-3">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-xs text-center">Ajouter ou glisser</p>
          </div>
        </div>

        {/* Modal button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-2 left-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
        >
          Bibliothèque
        </Button>
      </CardContent>
    </Card>
  );
}
