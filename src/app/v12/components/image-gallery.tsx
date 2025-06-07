"use client"

import { useState } from "react"
import { ImageUploader } from "./image-uploader"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

interface ImageData {
  url: string
  publicId: string
  id: string
}

export function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [uploaders, setUploaders] = useState<string[]>(["initial"])

  const handleImageUploaded = (imageData: { url: string; publicId: string }) => {
    const newImage: ImageData = {
      ...imageData,
      id: Date.now().toString(),
    }
    setImages((prev) => [...prev, newImage])
  }

  const handleImageDeleted = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId))
    setSelectedImages((prev) => {
      const newSet = new Set(prev)
      // Remove from selected if it was selected
      const imageToRemove = images.find((img) => img.publicId === publicId)
      if (imageToRemove) {
        newSet.delete(imageToRemove.publicId)
      }
      return newSet
    })
  }

  const handleSelectionChange = (isSelected: boolean, publicId?: string) => {
    if (!publicId) return

    setSelectedImages((prev) => {
      const newSet = new Set(prev)
      if (isSelected) {
        newSet.add(publicId)
      } else {
        newSet.delete(publicId)
      }
      return newSet
    })
  }

  const deleteSelectedImages = async () => {
    const deletePromises = Array.from(selectedImages).map(async (publicId) => {
      try {
        const response = await fetch("/api/delete-cloudinary", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId }),
        })

        if (response.ok) {
          return publicId
        }
        return null
      } catch (error) {
        console.error("Error deleting image:", error)
        return null
      }
    })

    const deletedIds = await Promise.all(deletePromises)
    const successfullyDeleted = deletedIds.filter((id) => id !== null)

    // Remove successfully deleted images from state
    setImages((prev) => prev.filter((img) => !successfullyDeleted.includes(img.publicId)))
    setSelectedImages(new Set())
  }

  const addNewUploader = () => {
    setUploaders((prev) => [...prev, Date.now().toString()])
  }

  const selectAll = () => {
    setSelectedImages(new Set(images.map((img) => img.publicId)))
  }

  const deselectAll = () => {
    setSelectedImages(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={addNewUploader} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
          {images.length > 0 && (
            <>
              <Button onClick={selectAll} variant="outline" size="sm">
                Tout sélectionner
              </Button>
              <Button onClick={deselectAll} variant="outline" size="sm">
                Tout désélectionner
              </Button>
            </>
          )}
        </div>

        {selectedImages.size > 0 && (
          <Button onClick={deleteSelectedImages} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer ({selectedImages.size})
          </Button>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploaders.map((uploaderId) => (
          <ImageUploader
            key={uploaderId}
            onImageUploaded={handleImageUploaded}
            onImageDeleted={handleImageDeleted}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>

      {/* Selected Images Info */}
      {selectedImages.size > 0 && (
        <div className="text-sm text-muted-foreground">{selectedImages.size} image(s) sélectionnée(s)</div>
      )}
    </div>
  )
}
