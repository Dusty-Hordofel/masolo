"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Check, ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function RealImageUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image")
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 10MB")
      return
    }

    // Reset states
    setError(null)
    setIsComplete(false)
    setProgress(0)

    // Set file and create preview
    setFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadFile = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    abortControllerRef.current = new AbortController()

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setProgress(percentComplete)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setIsComplete(true)
          setIsUploading(false)
          setProgress(100)
        } else {
          setError(`Erreur de téléchargement: ${xhr.statusText || "Erreur inconnue"}`)
          setIsUploading(false)
        }
      })

      xhr.addEventListener("error", () => {
        setError("Erreur de connexion")
        setIsUploading(false)
      })

      xhr.addEventListener("abort", () => {
        setIsUploading(false)
      })

      xhr.open("POST", "/api/upload")
      xhr.send(formData)

      // Store the XHR request to be able to abort it
      abortControllerRef.current.signal.addEventListener("abort", () => {
        xhr.abort()
      })
    } catch (err) {
      setError("Erreur de téléchargement")
      setIsUploading(false)
      console.error("Upload error:", err)
    }
  }

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const resetUploader = () => {
    setFile(null)
    setPreview(null)
    setProgress(0)
    setIsUploading(false)
    setIsComplete(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">Déposez votre image ici</h3>
            <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner un fichier</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF jusqu&apos;à 10MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {preview ? (
                <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={resetUploader} disabled={isUploading}>
              <X className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>

          {error && (
            <div className="flex items-center text-sm text-destructive mb-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            {isUploading ? (
              <Button variant="outline" onClick={cancelUpload}>
                Annuler
              </Button>
            ) : isComplete ? (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Téléchargement terminé
              </div>
            ) : (
              <Button onClick={uploadFile}>Télécharger</Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
