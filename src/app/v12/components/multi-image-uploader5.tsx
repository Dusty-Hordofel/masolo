"use client";

import type React from "react";

import { useEffect } from "react";
import {
  // Upload,
  X,
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  CircleX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Image from "next/image";
import MediaLibraryItem from "./media-library-item";
import { FileTypeFilter, ImageData, SortOption } from "@/@types";
import AddImageCard from "./add-image-card";
import ImageCard from "./image-card";
import { MediaUploader } from "./media-uploader";
import { useImageFilters } from "./hooks/use-image-filters";
import { useImageSelection } from "./hooks/use-image-selection";
import { useDragAndDrop } from "./hooks/use-drag-and-drop";
import { useImageManager } from "./hooks/use-image-manager";

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

export function MultiImageUploader5() {
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
    // filteredAndSortedImages
  } = useImageFilters();

  const {
    selectedImages,
    setSelectedImages,
    selectedImage,
    setSelectedImage,
    previewImageInModal,
    setPreviewImageInModal,
    isPreviewAnimating,
    setIsPreviewAnimating,
    showAllImages,
    setShowAllImages,
    showExpanded,
    setShowExpanded,
    imageListRef,
    ignoreNextClick,
    selectedProducts,
    setSelectedProducts,
    productSearchQuery,
    setProductSearchQuery,
    toggleImageSelection,
  } = useImageSelection();

  const {
    images,
    storeImages,
    setStoreImages,
    handleFileChange,
    handleFiles,
    deleteImage,
    deleteSelectedImages,
    fileInputRef,
  } = useImageManager();

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(handleFiles);

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

  const visibleImages = showExpanded ? images : images.slice(0, 6);
  const remainingCount = Math.max(0, images.length - 5);
  const hasMoreImages = images.length > 5;
  const hasImages = images.length > 0;

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
  }, [previewImageInModal, imageListRef]);

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
          <picture>
            <img
              src={selectedImage.url || selectedImage.preview}
              alt={selectedImage.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </picture>
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
            onClick={() =>
              deleteSelectedImages(selectedImages, setSelectedImages)
            }
            variant="destructive"
            size="sm"
          >
            Supprimer ({selectedImages.size})
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <MediaUploader
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          fileInputRef={fileInputRef}
          setShowAllImages={setShowAllImages}
          showAllImages={showAllImages}
          hasImages={hasImages}
          ignoreNextClick={ignoreNextClick}
        />
      ) : (
        // gap-2 h-96
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 ">
          {/* First image - large */}
          {images[0] && (
            <div className="col-span-2 row-span-2 aspect-square">
              <ImageCard
                image={images[0]}
                isSelected={selectedImages.has(images[0].id)}
                onToggleSelection={() => toggleImageSelection(images[0].id)}
                onDelete={() => deleteImage(images[0].id, setSelectedImages)}
                onView={() => setSelectedImage(images[0])}
                className="h-full"
              />
            </div>
          )}

          {/* Other images - uniform size */}

          {!showExpanded
            ? visibleImages.slice(1, 7).map((image) => (
                <div
                  key={image.id}
                  className="col-span-1 row-span-1 aspect-square"
                >
                  <ImageCard
                    image={image}
                    isSelected={selectedImages.has(image.id)}
                    onToggleSelection={() => toggleImageSelection(image.id)}
                    onDelete={() => deleteImage(image.id, setSelectedImages)}
                    onView={() => setSelectedImage(image)}
                    className="h-full"
                  />
                </div>
              ))
            : visibleImages.map((image) => (
                <div
                  key={image.id}
                  className="col-span-1 row-span-1 aspect-square"
                >
                  <ImageCard
                    image={image}
                    isSelected={selectedImages.has(image.id)}
                    onToggleSelection={() => toggleImageSelection(image.id)}
                    onDelete={() => deleteImage(image.id, setSelectedImages)}
                    onView={() => setSelectedImage(image)}
                    className="h-full"
                  />
                </div>
              ))}
          {/* More images indicator or Add card */}
          {!showExpanded && hasMoreImages && images.length > 6 && (
            <div
              className="aspect-square relative cursor-pointer group"
              onClick={() => setShowExpanded(true)}
            >
              <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
                {images[7] && (
                  <picture>
                    <img
                      src={images[7].url || images[7].preview}
                      alt="More images"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                )}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white text-center">
                    {/* <Plus className="h-6 w-6 mx-auto mb-1" /> */}
                    <p className="text-sm font-medium">+{remainingCount}</p>
                    <p className="text-xs">images</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="col-span-1 row-span-1 aspect-square">
            <AddImageCard onOpenModal={() => setShowAllImages(true)} />
          </div>
        </div>
      )}

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="p-2">
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
              <div
                className="
                   flex  overflow-x-auto gap-4
                   md:grid md:grid-cols-5 md:overflow-x-visible
                 "
              >
                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      Date d&apos;ajout (le plus récent en premier)
                    </SelectItem>
                    <SelectItem value="date-asc">
                      Date d&apos;ajout (le plus ancien en premier)
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
                  <PopoverContent className="w-56">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-y-3">
                        <div>
                          <Label className="text-sm font-medium">
                            Taille minimale (Mo)
                          </Label>
                          <Input
                            placeholder="Min"
                            value={minSize}
                            onChange={(e) => setMinSize(e.target.value)}
                            type="number"
                            className="flex-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Taille maximale (Mo)
                          </Label>
                          <Input
                            placeholder="Max"
                            value={maxSize}
                            onChange={(e) => setMaxSize(e.target.value)}
                            type="number"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      {(minSize || maxSize) && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            setMinSize("");
                            setMaxSize("");
                          }}
                          className=" w-max h-max p-0 "
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

          {/* bg-red-300  */}
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
                {/* Upload section */}
                {/* <div className="border-b">
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
                </div> */}
                <MediaUploader
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  fileInputRef={fileInputRef}
                  setShowAllImages={setShowAllImages}
                  showAllImages={showAllImages}
                  hasImages={hasImages}
                  ignoreNextClick={ignoreNextClick}
                />
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {filteredAndSortedImages.map((image) => (
                      <MediaLibraryItem
                        key={image.id}
                        image={image}
                        isSelected={selectedImages.has(image.id)}
                        isActive={previewImageInModal?.id === image.id}
                        onToggleSelection={() => toggleImageSelection(image.id)}
                        onDelete={() =>
                          deleteImage(image.id, setSelectedImages)
                        }
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
                            src={image.url || image.preview}
                            alt={image.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </picture>
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
                            onClick={() =>
                              deleteImage(image.id, setSelectedImages)
                            }
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
                            previewImageInModal.url ||
                            previewImageInModal.preview
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
